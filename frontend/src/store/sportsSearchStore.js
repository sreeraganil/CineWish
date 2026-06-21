import { create } from 'zustand';
import { sportsApi } from '../config/sportsApi';

const useSportsSearchStore = create((set) => ({
  query: '',
  results: [],
  loading: false,
  error: null,
  
  setQuery: (newQuery) => set({ query: newQuery }),
  
  search: async (searchQuery) => {
    if (!searchQuery.trim()) {
      set({ results: [], loading: false, error: null });
      return;
    }
    
    set({ loading: true, error: null });
    try {
      const data = await sportsApi.searchMatches(searchQuery);
      set({ results: data, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  clearSearch: () => set({ query: '', results: [], loading: false, error: null })
}));

export default useSportsSearchStore;
