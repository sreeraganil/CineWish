import { GoogleGenerativeAI } from "@google/generative-ai";
import axios from "axios";
import SentNotification from "../models/SentNotification.js";

if (!process.env.GEMINI_API_KEY) throw new Error("GEMINI_API_KEY is not set");
if (!process.env.TMDB_KEY) throw new Error("TMDB_KEY is not set");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
const BASE_URL = "https://api.themoviedb.org/3";
const TMDB_KEY = process.env.TMDB_KEY;

const OTT_CONFIG = {
  MAX_RESULTS: 8,
  RECENCY_DAYS: 30,
  FALLBACK_RECENCY_DAYS: 90,
};

// ─── Main Export ─────────────────────────────────────────────────────────────

export const getTodayOTTList = async () => {
  try {
    const [trendingMovies, trendingTV] = await Promise.all([
      axios.get(`${BASE_URL}/trending/movie/day?api_key=${TMDB_KEY}`),
      axios.get(`${BASE_URL}/trending/tv/day?api_key=${TMDB_KEY}`),
    ]);

    const candidates = [
      ...trendingMovies.data.results.map((r) => ({ ...r, media_type: "movie" })),
      ...trendingTV.data.results.map((r) => ({ ...r, media_type: "tv" })),
    ];

    // Deduplicate by id
    const seen = new Set();
    const unique = candidates.filter(({ id }) =>
      seen.has(id) ? false : seen.add(id)
    );

    // Filter out already-sent notifications
    const sentDocs = await SentNotification.find({}, { tmdb_id: 1 });
    const sentIds = new Set(sentDocs.map((d) => d.tmdb_id));
    const unsent = unique.filter((item) => !sentIds.has(item.id));

    if (unsent.length === 0) {
      console.warn("[OTT] All trending items already sent. Clearing history.");
      await SentNotification.deleteMany({});
      // retry with full list
      return buildList(unique);
    }

    return buildList(unsent);
  } catch (error) {
    console.error("[OTT] Pipeline failed:", error.message);
    return [];
  }
};

async function buildList(items) {
  const normalized = items.map(normalizeItem);

  const filtered = filterByRecency(normalized, OTT_CONFIG.RECENCY_DAYS);
  const pool = filtered.length > 0
    ? filtered
    : filterByRecency(normalized, OTT_CONFIG.FALLBACK_RECENCY_DAYS);

  return pool.slice(0, OTT_CONFIG.MAX_RESULTS);
}

// ─── Gemini Enrichment ───────────────────────────────────────────────────────

/**
 * Uses Gemini to generate a short punchy hook for the notification body.
 * Falls back to overview if Gemini fails.
 */
export const enrichWithGemini = async (item) => {
  const prompt = `You are writing a mobile push notification for a streaming app.

Title: "${item.title}"
Type: ${item.media_type === "tv" ? "TV Show" : "Movie"}
Rating: ${item.vote_average ? item.vote_average.toFixed(1) + "/10" : "N/A"}
Overview: "${item.overview ?? "Not available"}"

Write a single punchy sentence (max 80 characters) that makes someone want to watch this.
- No spoilers
- No generic phrases like "Don't miss" or "Watch now"
- No emojis
- Just the hook, nothing else`;

  try {
    const result = await model.generateContent(prompt);
    const hook = result.response.text().trim().replace(/^["']|["']$/g, "");
    return hook.length > 0 ? hook : item.overview?.slice(0, 80) ?? "";
  } catch (err) {
    console.warn(`[OTT] Gemini enrichment failed for "${item.title}": ${err.message}`);
    return item.overview?.slice(0, 80) ?? "";
  }
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function normalizeItem(item) {
  return {
    id: item.id,
    media_type: item.media_type,
    title: item.title ?? item.name ?? item.original_title ?? item.original_name,
    overview: item.overview ?? null,
    release_date: item.release_date ?? item.first_air_date ?? null,
    poster_path: item.backdrop_path ?? item.poster_path ?? null,
    vote_average: item.vote_average ?? null,
  };
}

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


// getTodayOTTList().then(data => console.log(data))