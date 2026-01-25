import { create } from "zustand";
import API from "../config/axios";

const providerStore = create((set, get) => ({
  providerId: null,
  media: "movie",

  items: [],
  page: 1,
  totalPages: 1,
  loading: false,

  scrollPosition: 0,

  setScrollPosition: (val) => set({ scrollPosition: val }),

  resetProvider: () =>
    set({
      providerId: null,
      items: [],
      page: 1,
      totalPages: 1,
      media: "movie",
    }),

  fetchProvider: async ({
    providerId,
    media = "movie",
    page = 1,
  }) => {
    const { loading } = get();
    if (loading) return;

    set({ loading: true });

    try {
      const { data } = await API.get("/tmdb/discover", {
        params: {
          media,
          with_watch_providers: providerId,
          watch_region: "IN",
          sort_by: "popularity.desc",
          page,
        },
      });

      set((state) => ({
        providerId,
        media,
        page: data.page,
        totalPages: data.total_pages,
        items:
          page === 1
            ? data.results
            : [...state.items, ...data.results],
      }));
    } catch (err) {
      console.error("Provider discover failed:", err.message);
    } finally {
      set({ loading: false });
    }
  },
}));

export default providerStore;
