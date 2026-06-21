import { create } from 'zustand';
import { sportsApi } from '../config/sportsApi';

const useSportsWatchStore = create((set) => ({
  sourceGroups: [],
  selectedStream: null,
  loading: false,
  error: null,

  fetchStreams: async (sourcesArray) => {
    set({ loading: true, error: null });
    if (!sourcesArray || sourcesArray.length === 0) {
       set({ sourceGroups: [], selectedStream: null, loading: false });
       return;
    }

    try {
      const streamsPromises = sourcesArray.map(async (s) => {
         try {
            const streamsData = await sportsApi.getStreams(s.source, s.id);
            const enrichedStreams = (streamsData || []).map((st, idx) => ({ ...st, sourceName: s.source, index: idx }));
            return { sourceName: s.source, streams: enrichedStreams };
         } catch(e) {
            return { sourceName: s.source, streams: [] };
         }
      });
      
      const resolvedSources = await Promise.all(streamsPromises);
      const validSources = resolvedSources.filter(s => s.streams.length > 0);
      
      let firstStream = null;
      if (validSources.length > 0 && validSources[0].streams.length > 0) {
         firstStream = validSources[0].streams[0];
      }

      set({ 
        sourceGroups: validSources, 
        selectedStream: firstStream,
        loading: false 
      });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  setSelectedStream: (stream) => set({ selectedStream: stream }),
  
  clearStreams: () => set({ sourceGroups: [], selectedStream: null, error: null, loading: false })
}));

export default useSportsWatchStore;
