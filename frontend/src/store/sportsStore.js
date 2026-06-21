import { create } from 'zustand';
import { sportsApi } from '../config/sportsApi';

const useSportsStore = create((set, get) => ({
  categories: [],
  liveMatches: [],
  todayMatches: [],
  popularMatches: [],
  popularLiveMatches: [],
  loading: {
    categories: false,
    live: false,
    today: false,
    popular: false,
    popularLive: false,
  },
  error: null,

  fetchCategories: async () => {
    if (get().categories.length > 0) return;
    set((state) => ({ loading: { ...state.loading, categories: true }, error: null }));
    try {
      const data = await sportsApi.getSports();
      set((state) => ({ categories: data, loading: { ...state.loading, categories: false } }));
    } catch (error) {
      set((state) => ({ error: error.message, loading: { ...state.loading, categories: false } }));
    }
  },

  fetchLiveMatches: async () => {
    set((state) => ({ loading: { ...state.loading, live: true }, error: null }));
    try {
      const data = await sportsApi.getLiveMatches();
      set((state) => ({ liveMatches: data, loading: { ...state.loading, live: false } }));
    } catch (error) {
      set((state) => ({ error: error.message, loading: { ...state.loading, live: false } }));
    }
  },

  fetchTodayMatches: async () => {
    set((state) => ({ loading: { ...state.loading, today: true }, error: null }));
    try {
      const data = await sportsApi.getTodayMatches();
      set((state) => ({ todayMatches: data, loading: { ...state.loading, today: false } }));
    } catch (error) {
      set((state) => ({ error: error.message, loading: { ...state.loading, today: false } }));
    }
  },

  fetchPopularMatches: async () => {
    set((state) => ({ loading: { ...state.loading, popular: true }, error: null }));
    try {
      const data = await sportsApi.getAllPopularMatches();
      set((state) => ({ popularMatches: data, loading: { ...state.loading, popular: false } }));
    } catch (error) {
      set((state) => ({ error: error.message, loading: { ...state.loading, popular: false } }));
    }
  },

  fetchPopularLiveMatches: async () => {
      set((state) => ({ loading: { ...state.loading, popularLive: true }, error: null }));
      try {
        const data = await sportsApi.getPopularLiveMatches();
        set((state) => ({ popularLiveMatches: data, loading: { ...state.loading, popularLive: false } }));
      } catch (error) {
        set((state) => ({ error: error.message, loading: { ...state.loading, popularLive: false } }));
      }
    },
}));

export default useSportsStore;
