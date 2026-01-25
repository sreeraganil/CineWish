import { create } from "zustand";
import API from "../config/axios";

const networkStore = create((set, get) => ({
  networkId: null,
  media: "tv",

  items: [],
  page: 1,
  totalPages: 1,
  loading: false,

  scrollPosition: 0,

  setScrollPosition: (val) => set({ scrollPosition: val }),

  resetNetwork: () =>
    set({
      networkId: null,
      media: "tv",
      items: [],
      page: 1,
      totalPages: 1,
    }),

  fetchNetwork: async ({ networkId, media = "tv", page = 1 }) => {
    const { loading } = get();
    if (loading) return;

    set({ loading: true });

    try {
      const { data } = await API.get("/tmdb/discover", {
        params: {
          media,
          with_networks: networkId,
          page,
          sort_by: "popularity.desc",
        },
      });

      set((state) => ({
        networkId,
        media,
        page: data.page,
        totalPages: data.total_pages,
        items:
          page === 1
            ? data.results
            : [...state.items, ...data.results],
      }));
    } catch (err) {
      console.error("Failed to fetch network:", err.message);
    } finally {
      set({ loading: false });
    }
  },
}));

export default networkStore;
