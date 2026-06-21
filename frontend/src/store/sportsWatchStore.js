import { create } from 'zustand';
import { sportsApi } from '../config/sportsApi';

const useSportsWatchStore = create((set) => ({
  streams: [],
  selectedStream: null,
  loading: false,
  error: null,

  fetchStreams: async (source, id) => {
    set({ loading: true, error: null });
    try {
      const data = await sportsApi.getStreams(source, id);
      set({ 
        streams: data || [], 
        selectedStream: data?.length > 0 ? data[0] : null,
        loading: false 
      });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  setSelectedStream: (stream) => set({ selectedStream: stream }),
  
  clearStreams: () => set({ streams: [], selectedStream: null, error: null, loading: false })
}));

export default useSportsWatchStore;
