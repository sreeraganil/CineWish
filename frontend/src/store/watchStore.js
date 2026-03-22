import { create } from "zustand";
import API from "../config/axios";
import toast from "react-hot-toast";

const watchStore = create((set, get) => ({
  continueWatching: [],
  history: [],
  loading: false,

  historyPage: 1,
  historyTotalPages: 1,

  /* ---------- Continue Watching ---------- */
  fetchContinueWatching: async () => {
    try {
      const { data } = await API.get("/watch/continue");

      set({
        continueWatching: data?.data,
      });
    } catch (err) {
      console.error("Failed to fetch continue watching", err);
    }
  },

  /* ---------- History (Paginated) ---------- */
  fetchHistory: async (page = 1) => {
    set({ loading: true });

    try {
      const { data } = await API.get("/watch/completed", {
        params: { page, limit: 20 },
      });

      set((state) => ({
        history: page === 1 ? data.data : [...state.history, ...data.data],
        historyPage: data.page,
        historyTotalPages: data.totalPages,
      }));
    } catch (err) {
      console.error("Failed to fetch history", err);
      set({ loading: false });
    }
  },

  /* ---------- Remove ---------- */
  removeFromHistory: async (item) => {
    // optimistic update
    set((state) => ({
      continueWatching: state.continueWatching.filter(
        (i) =>
          !(
            i.mediaType === item.mediaType &&
            i.mediaId === item.mediaId &&
            i.season === item.season &&
            i.episode === item.episode
          ),
      ),
      history: state.history.filter(
        (i) =>
          !(
            i.mediaType === item.mediaType &&
            i.mediaId === item.mediaId &&
            i.season === item.season &&
            i.episode === item.episode
          ),
      ),
    }));

    try {
      await API.delete(`/watch/history/${item.mediaType}/${item.mediaId}`, {
        params:
          item.mediaType === "tv"
            ? { season: item.season, episode: item.episode }
            : {},
      });

      toast.success("Item removed");

      // optional: refetch if page becomes empty
      const { history, historyPage } = get();

      if (history.length === 0 && historyPage > 1) {
        get().fetchHistory(historyPage - 1);
      }
    } catch (err) {
      toast.error("Failed to remove item");
      console.error("Failed to remove item", err);

      // rollback
      set((state) => ({
        continueWatching: [...state.continueWatching, item],
        history: [...state.history, item],
      }));
    }
  },
}));

export default watchStore;
