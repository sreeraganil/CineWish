import axios from 'axios';

const SPORTS_API_BASE_URL = 'https://streamed.pk/api';

const sportsClient = axios.create({
  baseURL: SPORTS_API_BASE_URL,
  timeout: 10000,
});

// Response interceptor for error handling
sportsClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('Sports API Error:', error);
    return Promise.reject(error);
  }
);

export const sportsApi = {
  getSports: async () => {
    const response = await sportsClient.get('/sports');
    return response.data;
  },
  
  getLiveMatches: async () => {
    const response = await sportsClient.get('/matches/live');
    return response.data;
  },

  getPopularLiveMatches: async () => {
    const response = await sportsClient.get('/matches/live/popular');
    return response.data;
  },

  getAllMatches: async () => {
    const response = await sportsClient.get('/matches/all');
    return response.data;
  },

  getAllPopularMatches: async () => {
    const response = await sportsClient.get('/matches/all/popular');
    return response.data;
  },

  getTodayMatches: async () => {
    const response = await sportsClient.get('/matches/all-today');
    return response.data;
  },

  getTodayPopularMatches: async () => {
    const response = await sportsClient.get('/matches/all-today/popular');
    return response.data;
  },

  getMatchesBySport: async (sport) => {
    const response = await sportsClient.get(`/matches/${sport}`);
    return response.data;
  },

  getPopularMatchesBySport: async (sport) => {
    const response = await sportsClient.get(`/matches/${sport}/popular`);
    return response.data;
  },

  getStreams: async (source, id) => {
    const response = await sportsClient.get(`/stream/${source}/${id}`);
    return response.data;
  },
  
  // Note: API doesn't seem to have a single match endpoint based on the spec provided.
  // We'll need to fetch a list and find it, or if it exists but wasn't documented, we might need to adjust this.
  // For now, implementing a mock fallback or client-side find.
  // We can fetch live or all and find the match.
  getMatchById: async (matchId) => {
    try {
        const liveMatches = await sportsApi.getLiveMatches();
        let match = liveMatches.find(m => m.id === matchId);
        if (match) return match;

        const allMatches = await sportsApi.getAllMatches();
        match = allMatches.find(m => m.id === matchId);
        return match || null;
    } catch (error) {
        console.error("Error finding match by ID:", error);
        return null;
    }
  },

  searchMatches: async (query) => {
      // API doesn't have a dedicated search endpoint mentioned.
      // We will do client-side filtering on all matches for MVP, or modify later if API supports it.
      if (!query) return [];
      try {
          const allMatches = await sportsApi.getAllMatches();
          const lowerQuery = query.toLowerCase();
          return allMatches.filter(m => 
              m.title?.toLowerCase().includes(lowerQuery) || 
              m.teams?.home?.name?.toLowerCase().includes(lowerQuery) ||
              m.teams?.away?.name?.toLowerCase().includes(lowerQuery) ||
              m.category?.toLowerCase().includes(lowerQuery)
          );
      } catch (error) {
          console.error("Error searching matches:", error);
          return [];
      }
  }
};

export const getSportsImageUrl = {
  badge: (id) => `${SPORTS_API_BASE_URL}/images/badge/${id}.webp`,
  poster: (homeBadge, awayBadge) => `${SPORTS_API_BASE_URL}/images/poster/${homeBadge}/${awayBadge}.webp`,
  proxy: (posterPath) => `${SPORTS_API_BASE_URL}/images/proxy/${posterPath}.webp`
};
