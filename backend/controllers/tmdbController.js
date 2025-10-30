import axios from "axios";
import Trending from "../models/trendingModel.js";
import Upcoming from "../models/upcomingModel.js";
import WatchList from '../models/watchListModel.js';
import { GoogleGenerativeAI } from "@google/generative-ai";
import latestOTT from "../models/latestOTTModel.js";

const TMDB_ACCESS_TOKEN = process.env.TMDB_ACCESS_TOKEN;
const BASE_URL = "https://api.themoviedb.org/3";
const TMDB_KEY = process.env.TMDB_KEY;

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
  if (results) {
    await Upcoming.deleteMany({});
    await Upcoming.create({ data: results });
  }
};


export const updateLatestOTT = async () => {
  const results = await getLatestOTTList();
  if (results) {
    await latestOTT.deleteMany({});
    await latestOTT.create({ data: results });
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

export const getLatestOTT = async (req, res) => {
  try {
    const cached = await latestOTT.findOne();
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

// export const getRecommendations = async (req, res) => {
//   try {
//     const { media, id } = req.params;console.log(req.user)

//     // Step 1: Get details of the current media to extract genre_ids
//     const { data: mediaDetails } = await axios.get(
//       `${BASE_URL}/${media}/${id}`,
//       {
//         headers: {
//           Authorization: `Bearer ${TMDB_ACCESS_TOKEN}`,
//           accept: "application/json",
//         },
//         params: {
//           language: "en-US",
//         },
//       }
//     );

//     const genreIds = mediaDetails.genres?.map((g) => g.id) || [];

//     if (genreIds.length === 0) {
//       return res.status(404).json({ message: "No genres found to suggest" });
//     }

//     // Step 2: Discover content based on genre(s)
//     const genreQuery = genreIds.slice(0, 3).join(","); // Limit to top 3 genres

//     const { data: discoveryData } = await axios.get(
//       `${BASE_URL}/discover/${media}`,
//       {
//         headers: {
//           Authorization: `Bearer ${TMDB_ACCESS_TOKEN}`,
//           accept: "application/json",
//         },
//         params: {
//           with_genres: genreQuery,
//           sort_by: "popularity.desc",
//           language: "en-US",
//           page: 1,
//         },
//       }
//     );

//     // Step 3: Filter out current media from recommendations
//     const recommendations = discoveryData.results.filter(
//       (item) => item.id !== parseInt(id)
//     );

//     res.json(recommendations.slice(0, 15)); // Limit to 15 results
//   } catch (err) {
//     console.error("Custom Recommendations Error:", err.message);
//     res.status(500).json({ message: "Failed to generate recommendations" });
//   }
// };

export const getRecommendations = async (req, res) => {
  try {
    const { media, id } = req.params;
    const userId = req.user._id;

    const { data: mediaDetails } = await axios.get(
      `${BASE_URL}/${media}/${id}`,
      {
        headers: {
          Authorization: `Bearer ${TMDB_ACCESS_TOKEN}`,
        },
        params: { language: "en-US" },
      }
    );

    const genreIds = mediaDetails.genres?.map((g) => g.id) || [];
    if (!genreIds.length) {
      return res.status(404).json({ message: "No genres found" });
    }

    const genreQuery = genreIds.slice(0, 3).join(",");

    const { data: discoveryData } = await axios.get(
      `${BASE_URL}/discover/${media}`,
      {
        headers: {
          Authorization: `Bearer ${TMDB_ACCESS_TOKEN}`,
        },
        params: {
          with_genres: genreQuery,
          sort_by: "popularity.desc",
          language: "en-US",
          page: 1,
        },
      }
    );

    let recommended = discoveryData.results.map((item) => ({
      ...item,
      media_type: media, // <-- Inject media_type
    }));

    if (userId) {
      const userWatchList = await WatchList.find({ userId });
      const excludedIds = new Set(userWatchList.map((item) => item.tmdbId));
      excludedIds.add(parseInt(id)); 

      recommended = recommended.filter((item) => !excludedIds.has(item.id));
    }

    res.json(recommended.slice(0, 15));
  } catch (err) {
    console.error("Custom Recommendation Error:", err.message);
    res.status(500).json({ message: "Failed to fetch custom recommendations" });
  }
};


const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

export const getUpcomingList = async () => {
  const todayStr = new Date().toISOString().split("T")[0];
  const futureStr = new Date(new Date().setMonth(new Date().getMonth() + 4))
    .toISOString()
    .split("T")[0];

  const prompt = `
Provide a JSON array of 15 popular and highly anticipated upcoming movies and TV shows that will be released in the next 4 months.

Requirements:
- Only include content with official release dates between today (${todayStr}) and ${futureStr}
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
    const geminiResult = await model.generateContent(prompt);
    const rawText = geminiResult.response.text();

    const match = rawText.match(/\[\s*{[\s\S]*?}\s*\]/);
    if (!match) throw new Error("No valid JSON array found in Gemini response");

    const mediaList = JSON.parse(match[0]);

    const promises = mediaList.map(async ({ id, media_type }) => {
      const url = `${BASE_URL}/${media_type}/${id}?api_key=${TMDB_KEY}&language=en-US`;
      try {
        const { data } = await axios.get(url);
        return {
          id: data.id,
          media_type,
          title:
            data.title ||
            data.name ||
            data.original_name ||
            data.original_title,
          release_date: data.first_air_date || data.release_date,
          poster_path: data.poster_path,
        };
      } catch (err) {
        console.error(
          `Failed to fetch TMDB item ${media_type} ${id}:`,
          err.message
        );
        return null;
      }
    });

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const upperLimit = new Date();
    upperLimit.setMonth(today.getMonth() + 4);
    upperLimit.setHours(23, 59, 59, 999);

    const verifiedResults = (await Promise.all(promises))
      .filter((item) => {
        if (!item || !item.release_date) return false;
        const release = new Date(item.release_date);
        return release >= today && release <= upperLimit;
      })
      .sort((a, b) => new Date(a.release_date) - new Date(b.release_date));

    if (verifiedResults.length === 0) {
      console.warn(
        "No upcoming content found - Gemini may have provided outdated data"
      );
      return await getFallbackUpcomingList();
    }

    return verifiedResults;
  } catch (error) {
    console.error("Error during media fetch pipeline:", error.message);
    return await getFallbackUpcomingList();
  }
};

async function getFallbackUpcomingList() {
  try {
    const today = new Date().toISOString().split("T")[0];
    const futureDate = new Date();
    futureDate.setMonth(futureDate.getMonth() + 4);
    const futureDateStr = futureDate.toISOString().split("T")[0];

    const movieURL = `${BASE_URL}/discover/movie?api_key=${TMDB_KEY}&language=en-US&sort_by=popularity.desc&include_adult=false&page=1&primary_release_date.gte=${today}&primary_release_date.lte=${futureDateStr}`;
    const tvURL = `${BASE_URL}/discover/tv?api_key=${TMDB_KEY}&language=en-US&sort_by=popularity.desc&include_adult=false&page=1&first_air_date.gte=${today}&first_air_date.lte=${futureDateStr}`;

    const [moviesRes, tvRes] = await Promise.all([
      axios.get(movieURL),
      axios.get(tvURL),
    ]);

    const processItem = (item, media_type) => ({
      id: item.id,
      media_type,
      title:
        item.title || item.name || item.original_name || item.original_title,
      release_date: item.first_air_date || item.release_date,
      poster_path: item.poster_path,
    });

    const upcomingMovies = moviesRes.data.results.map((item) =>
      processItem(item, "movie")
    );
    const upcomingTV = tvRes.data.results.map((item) =>
      processItem(item, "tv")
    );

    return [...upcomingMovies, ...upcomingTV]
      .sort((a, b) => new Date(a.release_date) - new Date(b.release_date))
      .slice(0, 15);
  } catch (err) {
    console.error("Error in fallback upcoming content fetch:", err.message);
    return null;
  }
}



export const getLatestOTTList = async () => {
  const todayStr = new Date().toISOString().split("T")[0];
  const pastStr = new Date(new Date().setMonth(new Date().getMonth() - 2))
    .toISOString()
    .split("T")[0];

  const prompt = `
Provide a JSON array of 15 popular and highly rated movies and TV shows that were released on OTT platforms in the past 2 months.

Requirements:
- Official release date must be between ${pastStr} and ${todayStr}
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

The response must be a valid JSON array only — no markdown, no comments, no extra text before or after the array.
`;

  try {
    const geminiResult = await model.generateContent(prompt);
    const rawText = geminiResult.response.text();

    const match = rawText.match(/\[\s*{[\s\S]*?}\s*\]/);
    if (!match) throw new Error("No valid JSON array found in Gemini response");

    const mediaList = JSON.parse(match[0]);

    const promises = mediaList.map(async ({ id, media_type }) => {
      const url = `${BASE_URL}/${media_type}/${id}?api_key=${TMDB_KEY}&language=en-US`;
      try {
        const { data } = await axios.get(url);
        return {
          id: data.id,
          media_type,
          title:
            data.title ||
            data.name ||
            data.original_name ||
            data.original_title,
          release_date: data.first_air_date || data.release_date,
          poster_path: data.poster_path,
        };
      } catch (err) {
        console.error(
          `Failed to fetch TMDB item ${media_type} ${id}:`,
          err.message
        );
        return null;
      }
    });

    const past = new Date();
    past.setMonth(past.getMonth() - 2);
    past.setHours(0, 0, 0, 0);

    const today = new Date();
    today.setHours(23, 59, 59, 999);

    const verifiedResults = (await Promise.all(promises))
      .filter((item) => {
        if (!item || !item.release_date) return false;
        const release = new Date(item.release_date);
        return release >= past && release <= today;
      })
      .sort((a, b) => new Date(b.release_date) - new Date(a.release_date));

    if (verifiedResults.length === 0) {
      console.warn(
        "No latest OTT content found - Gemini may have provided outdated data"
      );
      return await getFallbackLatestOTTList();
    }

    return verifiedResults;
  } catch (error) {
    console.error("Error during latest OTT fetch pipeline:", error.message);
    return await getFallbackLatestOTTList();
  }
};

async function getFallbackLatestOTTList() {
  try {
    const today = new Date().toISOString().split("T")[0];
    const pastDate = new Date();
    pastDate.setMonth(pastDate.getMonth() - 2);
    const pastDateStr = pastDate.toISOString().split("T")[0];

    const movieURL = `${BASE_URL}/discover/movie?api_key=${TMDB_KEY}&language=en-US&sort_by=primary_release_date.desc&include_adult=false&page=1&primary_release_date.gte=${pastDateStr}&primary_release_date.lte=${today}&with_watch_providers=8&watch_region=IN`;
    const tvURL = `${BASE_URL}/discover/tv?api_key=${TMDB_KEY}&language=en-US&sort_by=first_air_date.desc&include_adult=false&page=1&first_air_date.gte=${pastDateStr}&first_air_date.lte=${today}&with_watch_providers=8&watch_region=IN`;

    const [moviesRes, tvRes] = await Promise.all([
      axios.get(movieURL),
      axios.get(tvURL),
    ]);

    const processItem = (item, media_type) => ({
      id: item.id,
      media_type,
      title:
        item.title || item.name || item.original_name || item.original_title,
      release_date: item.first_air_date || item.release_date,
      poster_path: item.poster_path,
    });

    const latestMovies = moviesRes.data.results.map((item) =>
      processItem(item, "movie")
    );
    const latestTV = tvRes.data.results.map((item) =>
      processItem(item, "tv")
    );

    return [...latestMovies, ...latestTV]
      .sort((a, b) => new Date(b.release_date) - new Date(a.release_date))
      .slice(0, 15);
  } catch (err) {
    console.error("Error in fallback latest OTT fetch:", err.message);
    return null;
  }
}
