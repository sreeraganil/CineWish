import axios from "axios";
import Trending from "../models/trendingModel.js";
import Upcoming from "../models/upcomingModel.js";
import { GoogleGenerativeAI } from "@google/generative-ai";

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

export const updateUpcoming = async () => {
  const results = await getUpcomingList();
  if(results){
    await Upcoming.deleteMany({});
    await Upcoming.create({ data: results });
  }
};

export const updateTrending = async () => {
  const results = await fetchFromTMDB("/trending/all/day");
  await Trending.deleteMany({});
  await Trending.create({ data: results });
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

    const { data: tmdbData } = await axios.get(`${BASE_URL}/${media}/${id}`, {
      headers: {
        Authorization: `Bearer ${TMDB_ACCESS_TOKEN}`,
        accept: "application/json",
      },
      params: { language: "en-US" },
    });

    let imdbRating = null;
    let imdbVotes = null;

    if (tmdbData.imdb_id && OMDB_API_KEY) {
      try {
        const { data: omdbData } = await axios.get(
          `https://www.omdbapi.com/?i=${tmdbData.imdb_id}&apikey=${OMDB_API_KEY}`
        );
        imdbRating = omdbData.imdbRating == "N/A" ? 0 : omdbData.imdbRating;
        imdbVotes = omdbData.imdbVotes == "N/A" ? 0 : omdbData.imdbVotes;
      } catch (err) {
        console.warn("OMDb fetch failed:", err.message);
      }
    }

    res.json({ ...tmdbData, imdbRating, imdbVotes });
  } catch (err) {
    console.error("getDetails error:", err.message);
    res.status(500).json({ message: "Failed to fetch detail" });
  }
};

export const getRecommendations = async (req, res) => {
  try {
    const { media, id } = req.params;

    const { data } = await axios.get(
      `${BASE_URL}/${media}/${id}/recommendations`,
      {
        headers: {
          Authorization: `Bearer ${TMDB_ACCESS_TOKEN}`,
          accept: "application/json",
        },
        params: {
          language: "en-US",
        },
      }
    );

    res.json(data.results || []);
  } catch (err) {
    console.error("TMDB Recommendations Error:", err.message);
    res.status(500).json({ message: "Failed to fetch recommendations" });
  }
};

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });


export const getUpcomingList = async () => {
  const prompt = `
Provide a JSON array of 15 popular and highly anticipated upcoming movies and TV shows that will be released in the next 4 months.

Requirements:
- Only include content with official release dates between today (${new Date().toISOString().split('T')[0]}) and ${new Date(new Date().setMonth(new Date().getMonth() + 4)).toISOString().split('T')[0]}
- Must be officially listed on The Movie Database (TMDB)
- Only return these fields:
  - "id": TMDB ID (integer)
  - "media_type": Either "movie" or "tv"
  - "release_date": The official release date in YYYY-MM-DD format

Format example:
[
  {"id": 12345, "media_type": "movie", "release_date": "2023-11-15"},
  {"id": 67890, "media_type": "tv", "release_date": "2023-12-01"}
]

The response must be a valid JSON array only — no markdown, no comments, no additional text before or after the array.
`;

  try {
    // === Gemini Call ===
    const geminiResult = await model.generateContent(prompt);
    const rawText = geminiResult.response.text();

    // Extract only the first valid JSON array using regex
    const match = rawText.match(/\[\s*{[\s\S]*?}\s*\]/);
    if (!match) throw new Error("No valid JSON array found in Gemini response");

    const mediaList = JSON.parse(match[0]);

    const tmdbApiKey = process.env.TMDB_KEY;

    const promises = mediaList.map(async ({ id, media_type }) => {
      const url = `https://api.themoviedb.org/3/${media_type}/${id}?api_key=${tmdbApiKey}&language=en-US`;
      try {
        const { data } = await axios.get(url);
        return {
          id: data.id,
          media_type,
          title: data.name || data.title,
          release_date: data.first_air_date || data.release_date,
          poster_path: data.poster_path
        };
      } catch (err) {
        console.error(`Failed to fetch TMDB item ${media_type} ${id}:`, err.message);
        return null;
      }
    });

    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize to beginning of day
    const upperLimit = new Date();
    upperLimit.setMonth(today.getMonth() + 4);
    upperLimit.setHours(23, 59, 59, 999);

    const verifiedResults = (await Promise.all(promises))
      .filter(item => {
        if (!item || !item.release_date) return false;
        const release = new Date(item.release_date);
        return release >= today && release <= upperLimit;
      })
      .sort((a, b) => new Date(a.release_date) - new Date(b.release_date));

    if (verifiedResults.length === 0) {
      console.warn("No upcoming content found - Gemini may have provided outdated data");
      // Fallback to direct TMDB API for upcoming content
      return await getFallbackUpcomingList();
    }
    console.log(verifiedResults)

    return verifiedResults;
  } catch (error) {
    console.error("Error during media fetch pipeline:", error.message);
    return null
  }
};

// Fallback function using direct TMDB API calls
async function getFallbackUpcomingList() {
  try {
    const tmdbApiKey = process.env.TMDB_KEY;
    const tmdbImageBaseUrl = "https://image.tmdb.org/t/p/w500";
    
    // Get current date and date 4 months from now
    const today = new Date().toISOString().split('T')[0];
    const futureDate = new Date();
    futureDate.setMonth(futureDate.getMonth() + 4);
    const futureDateStr = futureDate.toISOString().split('T')[0];

    // Fetch upcoming movies
    const moviesUrl = `https://api.themoviedb.org/3/discover/movie?api_key=${tmdbApiKey}&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1&primary_release_date.gte=${today}&primary_release_date.lte=${futureDateStr}`;
    
    // Fetch upcoming TV shows
    const tvUrl = `https://api.themoviedb.org/3/discover/tv?api_key=${tmdbApiKey}&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1&first_air_date.gte=${today}&first_air_date.lte=${futureDateStr}`;

    const [moviesRes, tvRes] = await Promise.all([
      axios.get(moviesUrl),
      axios.get(tvUrl)
    ]);

    const processItem = (item, media_type) => ({
      id: item.id,
      media_type,
      name: item.title || item.name,
      release_date: item.release_date || item.first_air_date,
      poster_url: item.poster_path ? `${tmdbImageBaseUrl}${item.poster_path}` : null
    });

    const upcomingMovies = moviesRes.data.results.map(item => processItem(item, 'movie'));
    const upcomingTV = tvRes.data.results.map(item => processItem(item, 'tv'));

    const allUpcoming = [...upcomingMovies, ...upcomingTV]
      .sort((a, b) => new Date(a.release_date) - new Date(b.release_date))
      .slice(0, 15); // Limit to 15 most popular

    return allUpcoming;
  } catch (error) {
    console.error("Error in fallback upcoming content fetch:", error.message);
    return null;
  }
}

