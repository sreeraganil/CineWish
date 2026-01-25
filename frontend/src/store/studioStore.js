import { create } from "zustand";
import API from "../config/axios";

const studioStore = create((set, get) => ({
  studioId: null,

  items: [],
  page: 1,
  totalPages: 1,
  loading: false,

  scrollPosition: 0,

  setScrollPosition: (val) => set({ scrollPosition: val }),

  resetStudio: () =>
    set({
      studioId: null,
      items: [],
      page: 1,
      totalPages: 1,
    }),

  fetchStudio: async ({ studioId, page = 1, media = "movie" }) => {
    const { loading } = get();
    if (loading) return;

    set({ loading: true });

    try {
      const { data } = await API.get("/tmdb/discover", {
        params: {
          media,
          with_companies: studioId,
          sort_by: "popularity.desc",
          page,
        },
      });

      set((state) => ({
        studioId,
        page: data.page,
        totalPages: data.total_pages,
        items:
          page === 1
            ? data.results
            : [...state.items, ...data.results],
      }));
    } catch (err) {
      console.error("Failed to fetch studio:", err.message);
    } finally {
      set({ loading: false });
    }
  },
}));

export default studioStore;
