import { GoogleGenerativeAI } from "@google/generative-ai";
import axios from "axios";

if (!process.env.GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY is not set in environment");
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

export const getTodayOTTList = async () => {
  const today = new Date().toISOString().split("T")[0];

  const prompt = `
Provide a JSON array of up to ${OTT_CONFIG.MAX_RESULTS} trending or newly released OTT movies and TV shows as of ${today}.

Requirements:
- Focus on OTT platforms (Netflix, Prime Video, Disney+, Hotstar, Apple TV+, etc.)
- Include recent releases or high buzz content from the past 2–4 weeks
- Must be real titles verifiable on TMDB

Return ONLY a raw JSON array. No markdown, no explanation, no code fences.
Format:
[{ "title": "string", "media_type": "movie" | "tv" }]
`;

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

/**
 * Fetches a single title from TMDB and resolves its OTT providers globally.
 * Aggregates flatrate providers across ALL available countries and deduplicates.
 */
async function resolveTMDBItem(title, media_type) {
  if (!["movie", "tv"].includes(media_type)) {
    throw new Error(`Invalid media_type: "${media_type}"`);
  }

  const searchUrl = `${BASE_URL}/search/${media_type}?api_key=${TMDB_KEY}&query=${encodeURIComponent(title)}`;
  const { data: searchData } = await axios.get(searchUrl);

  const results = searchData?.results;
  if (!results?.length) {
    throw new Error(`No TMDB results for "${title}"`);
  }

  const best = results[0];

  const providerUrl = `${BASE_URL}/${media_type}/${best.id}/watch/providers?api_key=${TMDB_KEY}`;
  const { data: providerData } = await axios.get(providerUrl);

  const countryResults = providerData.results ?? {};

  // Collect all flatrate provider names across every country, deduplicated
  const platformSet = new Set(
    Object.values(countryResults)
      .flatMap((country) => country.flatrate ?? [])
      .map((p) => p.provider_name)
  );

  if (platformSet.size === 0) {
    throw new Error(`No flatrate providers globally for "${title}"`);
  }

  return {
    id: best.id,
    media_type,
    title: best.title ?? best.name ?? best.original_title ?? best.original_name,
    release_date: best.release_date ?? best.first_air_date ?? null,
    poster_path: best.backdrop_path ?? best.poster_path ?? null,
    vote_average: best.vote_average ?? null,
    platforms: [...platformSet],
  };
}

/**
 * Filters items to only those released within the last `days` days.
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