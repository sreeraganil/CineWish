import axios from "axios";
import Trending from "../models/trendingModel.js";
import Upcoming from "../models/upcomingModel.js";


const TMDB_ACCESS_TOKEN = process.env.TMDB_ACCESS_TOKEN; 
const BASE_URL = "https://api.themoviedb.org/3";

// Helper function using Bearer Token
const fetchFromTMDB = async (endpoint) => {
  try {
    const { data } = await axios.get(`${BASE_URL}${endpoint}`, {
      headers: {
        Authorization: `Bearer ${TMDB_ACCESS_TOKEN}`,
        accept: "application/json",
      },
      params: {
        language: "en-US",
      },
    });
    return data.results;
  } catch (err) {
    console.error("TMDB Fetch Error:", err.code || err.message);
    throw new Error("Failed to fetch data from TMDB");
  }
};

export const updateTrending = async () => {
  const results = await fetchFromTMDB("/trending/all/day");
  await Trending.deleteMany({});
  await Trending.create({ data: results });
};

export const updateUpcoming = async () => {
  const results = await fetchFromTMDB("/movie/upcoming");
  await Upcoming.deleteMany({});
  await Upcoming.create({ data: results });
};

export const getTrending = async (req, res) => {
  try {
    const cached = await Trending.findOne();
    res.json(cached?.data || []);
  } catch (err) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const getUpcoming = async (req, res) => {
  try {
    const cached = await Upcoming.findOne();
    res.json(cached?.data || []);
  } catch (err) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const searchTMDB = async (req, res) => {
  const { query, type } = req.query;
  if (!query) return res.status(400).json({ message: "Query is required" });

  const options = {
    method: "GET",
    url: `https://api.themoviedb.org/3/search/${type}`,
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${process.env.TMDB_ACCESS_TOKEN}`,
    },
    params: {
      query,
      language: "en-US",
      include_adult: false,
      page: 1,
    },
    timeout: 2000, // 5 seconds timeout
  };

  try {
    const response = await axios.request(options);
    res.json({
      message: "Search result",
      data: response.data.results || [],
    });
  } catch (err) {
    console.error("TMDB search error:", err.code || err.message);
    res.status(500).json({
      message: `Failed to search from TMDB: ${err.message}`,
    });
  }
};


const OMDB_API_KEY = process.env.OMDB_KEY;

export const getDetails = async (req, res) => {
  try {
    const { media, id } = req.params;

    // Step 1: Fetch from TMDB
    const { data: tmdbData } = await axios.get(`${BASE_URL}/${media}/${id}`, {
      headers: {
        Authorization: `Bearer ${TMDB_ACCESS_TOKEN}`,
        accept: "application/json",
      },
      params: { language: "en-US" },
    });

    let imdbRating = null;
    let imdbVotes = null;

    // Step 2: If IMDb ID exists, fetch rating from OMDb
    if (tmdbData.imdb_id && OMDB_API_KEY) {
      try {
        const { data: omdbData } = await axios.get(
          `https://www.omdbapi.com/?i=${tmdbData.imdb_id}&apikey=${OMDB_API_KEY}`
        );
        imdbRating = omdbData.imdbRating || null;
        imdbVotes = omdbData.imdbVotes || null;
      } catch (err) {
        console.warn("OMDb fetch failed:", err.message);
      }
    }

    // Step 3: Respond with TMDB + IMDb rating
    res.json({ ...tmdbData, imdbRating, imdbVotes });
  } catch (err) {
    console.error("getDetails error:", err.message);
    res.status(500).json({ message: "Failed to fetch detail" });
  }
};

