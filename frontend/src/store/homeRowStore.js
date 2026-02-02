import { create } from "zustand";
import API from "../config/axios";

const useHomeRowStore = create((set, get) => ({
  rows: {},

  /*
    rows shape:

    {
      topIndian: {
        items: [],
        page: 1,
        totalPages: 1,
        loading: false,
        media: "movie",
        params: {}
      }
    }
  */

  /* ---------------- FETCH ROW ---------------- */

  fetchRow: async ({ key, media = "movie", params = {}, page = 1 }) => {
    const { rows } = get();

    const current = rows[key];

    if (current?.loading) return;

    set({
      rows: {
        ...rows,
        [key]: {
          ...current,
          loading: true,
        },
      },
    });

    try {
      const { data } = await API.get("/tmdb/discover", {
        params: {
          media,
          page,
          ...params,
        },
      });

      set((state) => ({
        rows: {
          ...state.rows,
          [key]: {
            media,
            params,
            loading: false,
            page: data.page,
            totalPages: data.total_pages,
            items:
              page === 1
                ? data.results
                : [...(state.rows[key]?.items || []), ...data.results],
          },
        },
      }));
    } catch (err) {
      console.error(`Failed to fetch row ${key}:`, err.message);

      set((state) => ({
        rows: {
          ...state.rows,
          [key]: {
            ...state.rows[key],
            loading: false,
          },
        },
      }));
    }
  },

  /* ---------------- RESET ONE ROW ---------------- */

  resetRow: (key) =>
    set((state) => {
      const copy = { ...state.rows };
      delete copy[key];
      return { rows: copy };
    }),

  /* ---------------- RESET ALL ---------------- */

  resetAllRows: () => ({ rows: {} }),

  lastRowScroll: null,

  setLastRowScroll: (data) => set({ lastRowScroll: data }),

  getLastRowScroll: () => get().lastRowScroll,

  clearLastRowScroll: () => set({ lastRowScroll: null }),
}));

export default useHomeRowStore;
