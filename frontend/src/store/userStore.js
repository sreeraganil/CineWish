import { create } from "zustand";
import API from "../config/axios";

const userStore = create((set, get) => {
  const storedUser = JSON.parse(localStorage.getItem("user"));

  return {
    user: storedUser || null,
    trending: [],
    upcoming: [],
    searchResult: [],

    // Auth Actions
    setUser: (data) => {
      set({ user: data });
      localStorage.setItem("user", JSON.stringify(data));
    },

    logoutUser: () => {
      set({ user: null });
      localStorage.removeItem("user");
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
      set({ searchResult: data })
    }
  };
});

export default userStore;
