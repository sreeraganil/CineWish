import { GoogleGenerativeAI } from "@google/generative-ai";
import axios from "axios";

if (!process.env.GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY is not set in environment");
}
if (!process.env.TMDB_KEY) {
  throw new Error("TMDB_KEY is not set in environment");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
const BASE_URL = "https://api.themoviedb.org/3";
const TMDB_KEY = process.env.TMDB_KEY;

const OTT_CONFIG = {
  MAX_RESULTS: 8,
  RECENCY_DAYS: 10,
  FALLBACK_RECENCY_DAYS: 30,
};

// ─── Main Export ─────────────────────────────────────────────────────────────

export const getTodayOTTList = async () => {
  const today = new Date().toISOString().split("T")[0];

  const prompt = `You are a streaming content curator with up-to-date knowledge of OTT releases.

Today's date: ${today}

Task: Return a JSON array of exactly ${OTT_CONFIG.MAX_RESULTS} movies and TV shows that are:
1. Currently streaming on major OTT platforms (Netflix, Prime Video, Disney+, Hotstar, Apple TV+, HBO Max, Hulu)
2. Released or premiered within the last 2–4 weeks from today
3. Real titles that exist on TMDB (themoviedb.org)
4. A healthy mix — include both movies and TV shows

Ranking priority (pick in this order):
- New originals from Netflix / Prime Video / Disney+ / Apple TV+
- Highly anticipated sequels or returning seasons
- Critically acclaimed or award-buzz titles
- Trending titles with high viewer engagement

Strict rules:
- NO titles older than 4 weeks unless they are actively trending right now
- NO duplicates
- NO upcoming/unreleased titles
- NO theatrical-only releases (must be streamable on OTT)
- Use ONLY the base title as it appears on TMDB — NO season suffixes
  ✅ "Severance"     ❌ "Severance: Season 2"
  ✅ "The Crown"     ❌ "The Crown: Season 7"
- Do NOT invent or guess titles. If unsure whether a title exists on TMDB, omit it.
- Prefer well-known titles from major studios over obscure ones.

Return ONLY a raw JSON array. No markdown, no explanation, no code fences, no trailing commas.

[
  { "title": "exact base TMDB title", "media_type": "movie" | "tv" },
  ...
]`;

  try {
    const geminiResult = await model.generateContent(prompt);
    const rawText = geminiResult.response.text().trim();

    const cleaned = rawText.replace(/```(?:json)?|```/gi, "").trim();
    const match = cleaned.match(/\[[\s\S]*\]/);
    if (!match) throw new Error("No valid JSON array found in Gemini response");

    let list;
    try {
      list = JSON.parse(match[0]);
    } catch {
      throw new Error(`JSON parse failed. Raw response: ${rawText.slice(0, 200)}`);
    }

    if (!Array.isArray(list) || list.length === 0) {
      throw new Error("Gemini returned an empty or non-array result");
    }

    const results = await Promise.all(
      list.map(({ title, media_type }) =>
        resolveTMDBItem(title, media_type).catch((err) => {
          console.warn(`[OTT] Skipping "${title}": ${err.message}`);
          return null;
        })
      )
    );

    const resolved = results.filter(Boolean);

    if (resolved.length === 0) {
      console.warn("[OTT] No results resolved from TMDB");
      return [];
    }

    const filtered = filterByRecency(resolved, OTT_CONFIG.RECENCY_DAYS);

    if (filtered.length === 0) {
      console.warn(
        `[OTT] No items within ${OTT_CONFIG.RECENCY_DAYS} days. ` +
          `Falling back to ${OTT_CONFIG.FALLBACK_RECENCY_DAYS}-day window.`
      );
      return filterByRecency(resolved, OTT_CONFIG.FALLBACK_RECENCY_DAYS);
    }

    return filtered;
  } catch (error) {
    console.error("[OTT] Pipeline failed:", error.message);
    return [];
  }
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Strips season/episode suffixes so TMDB search works reliably.
 * "Severance: Season 2" → "Severance"
 * "The Crown S07"       → "The Crown"
 */
function cleanTitleForSearch(title) {
  return title
    .replace(/:\s*Season\s*\d+/i, "")
    .replace(/\s*Season\s*\d+/i, "")
    .replace(/\s*S\d{2}/i, "")
    .trim();
}

/**
 * Resolves a Gemini-supplied title to a full TMDB item.
 * Falls back to /search/multi if typed search returns nothing.
 */
async function resolveTMDBItem(title, media_type) {
  if (!["movie", "tv"].includes(media_type)) {
    throw new Error(`Invalid media_type: "${media_type}"`);
  }

  const cleanedTitle = cleanTitleForSearch(title);

  // Primary search
  const { data: searchData } = await axios.get(
    `${BASE_URL}/search/${media_type}?api_key=${TMDB_KEY}&query=${encodeURIComponent(cleanedTitle)}`
  );

  if (searchData?.results?.length) {
    return normalizeItem({ ...searchData.results[0], media_type });
  }

  // Fallback: multi-search (catches wrong media_type from Gemini)
  const { data: fallbackData } = await axios.get(
    `${BASE_URL}/search/multi?api_key=${TMDB_KEY}&query=${encodeURIComponent(cleanedTitle)}`
  );

  const fallback = fallbackData?.results?.find((r) =>
    ["movie", "tv"].includes(r.media_type)
  );

  if (!fallback) {
    throw new Error(`No TMDB results for "${cleanedTitle}"`);
  }

  return normalizeItem(fallback);
}

/**
 * Normalizes a raw TMDB result into a clean item shape.
 */
function normalizeItem(item) {
  return {
    id: item.id,
    media_type: item.media_type,
    title: item.title ?? item.name ?? item.original_title ?? item.original_name,
    release_date: item.release_date ?? item.first_air_date ?? null,
    poster_path: item.backdrop_path ?? item.poster_path ?? null,
    vote_average: item.vote_average ?? null,
  };
}

/**
 * Keeps only items released within the last `days` days.
 */
function filterByRecency(items, days) {
  const now = new Date();
  const cutoff = new Date();
  cutoff.setDate(now.getDate() - days);

  return items.filter((item) => {
    if (!item.release_date) return false;
    const release = new Date(item.release_date);
    return release >= cutoff && release <= now;
  });
}