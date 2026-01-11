import { create } from "zustand";
import API from "../config/axios";

const watchStore = create((set, get) => ({
  continueWatching: [],
  history: [],
  loading: false,

  fetchWatchProgress: async () => {
    set({ loading: true });

    try {
      const { data } = await API.get("/watch/progress");

      set({
        continueWatching: data.filter((i) => i.status === "watching"),
        history: data.filter((i) => i.status === "completed"),
        loading: false,
      });
    } catch (err) {
      console.error("Failed to fetch watch progress", err);
      set({ loading: false });
    }
  },

  removeFromContinueWatching: async (item) => {
    // ✅ optimistic update
    set((state) => ({
      continueWatching: state.continueWatching.filter(
        (i) =>
          !(
            i.mediaType === item.mediaType &&
            i.mediaId === item.mediaId &&
            i.season === item.season &&
            i.episode === item.episode
          )
      ),
    }));

    try {
      await API.delete(`/watch/history/${item.mediaType}/${item.mediaId}`, {
        params:
          item.mediaType === "tv"
            ? { season: item.season, episode: item.episode }
            : {},
      });
    } catch (err) {
      console.error("Failed to remove item", err);

      // optional rollback
      set((state) => ({
        continueWatching: [...state.continueWatching, item],
      }));
    }
  },
}));

export default watchStore;
