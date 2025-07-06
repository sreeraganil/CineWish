import { create } from "zustand";
import API from "../config/axios";
import toast from "react-hot-toast";

const userStore = create((set, get) => {
  const storedUser = JSON.parse(localStorage.getItem("user"));

  return {
    user: storedUser || null,
    trending: [],
    upcoming: [],
    recommended: [],
    searchResult: [],
    stats: null,

    // Auth Actions
    setUser: (data) => {
      set({ user: data });
      localStorage.setItem("user", JSON.stringify(data));
    },

    logoutUser: async () => {
      try {
        const res = await API.post("/auth/logout");
        set({ user: null });
        localStorage.removeItem("user");
        toast.success(res.data.message);
      } catch (err) {
        throw err?.res?.data?.message || "Logout failed";
      }
    },

    registerUser: async (formData) => {
      try {
        const res = await API.post("/auth/register", formData);
        return res.data;
      } catch (err) {
        throw err?.response?.data?.message || "Registration failed";
      }
    },

    loginUser: async (formData) => {
      try {
        const res = await API.post("/auth/login", formData);
        if (res.data.success) {
          get().setUser(res.data.user);
        }
        return res.data;
      } catch (err) {
        throw err?.response?.data?.message || "Login failed";
      }
    },

    // TMDB
    fetchTrending: async () => {
      try {
        const res = await API.get("/tmdb/trending?type=all&time=day");
        set({ trending: res.data });
      } catch (err) {
        console.error("Failed to fetch trending:", err.message);
      }
    },

    fetchUpcoming: async () => {
      try {
        const res = await API.get("/tmdb/upcoming?page=1");
        set({ upcoming: res.data });
      } catch (err) {
        console.error("Failed to fetch upcoming:", err.message);
      }
    },

    setSearchResult: (data) => {
      set({ searchResult: data });
    },

    fetchStats: async () => {
      try {
        set({ loading: true });
        const { data } = await API.get("/user/stats");
        set({ stats: data });
      } catch (err) {
        console.error("Failed to fetch stats:", err);
      } finally {
        set({ loading: false });
      }
    },

    fetchRecommendations: async (media, id) => {
      try {
        const { data } = await API.get(`/tmdb/recommendations/${media}/${id}`);
        set({ recommended: data});
      } catch (err) {
        console.error("Failed to fetch recommendations:", err);
        return [];
      }
    },
  };
});

export default userStore;
