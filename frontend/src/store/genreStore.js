import { create } from "zustand";
import API from "../config/axios";

const genreStore = create((set, get) => ({
  genreId: null,
  media: "movie",

  items: [],
  page: 1,
  totalPages: 1,
  loading: false,

  scrollPosition: 0,

  setScrollPosition: (val) => set({ scrollPosition: val }),

  resetGenre: () =>
    set({
      genreId: null,
      items: [],
      page: 1,
      totalPages: 1,
    }),

  fetchGenre: async ({
    genreId,
    media = "movie",
    page = 1,
    year,
    rating,
    sort = "popularity.desc",
  }) => {
    const { loading } = get();

    // prevent duplicate scroll calls (but allow fresh filter calls)
    if (loading && page !== 1) return;

    set({ loading: true });

    try {
      const { data } = await API.get("/tmdb/discover", {
        params: {
          media,
          with_genres: genreId,
          page,
          sort_by: sort,

          ...(rating && { "vote_average.gte": rating }),

          ...(year && {
            [media === "movie"
              ? "primary_release_year"
              : "first_air_date_year"]: year,
          }),
        },
      });

      set((state) => ({
        genreId,
        media,
        page: data.page,
        totalPages: data.total_pages,

        filters: { year, rating, sort },

        items: page === 1 ? data.results : [...state.items, ...data.results],
      }));
    } catch (err) {
      console.error("Failed to fetch genre:", err.message);
    } finally {
      set({ loading: false });
    }
  },
}));

export default genreStore;
