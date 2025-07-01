import { create } from "zustand";
import API from "../config/axios";

const wishlistStore = create((set, get) => ({
  wishlist: [],
  
  fetchWishlist: async () => {
    try {
      const { data } = await API.get("/wishlist");
      set({ wishlist: data });
    } catch (err) {
      console.error("Failed to fetch wishlist", err);
    }
  },

  addToWishlist: async (item) => {
    try {
      const { data } = await API.post("/wishlist", item);
      set((state) => ({ wishlist: [...state.wishlist, data] }));
      return data;
    } catch (err) {
      throw err?.response?.data?.message || "Failed to add to wishlist";
    }
  },

  removeFromWishlist: async (tmdbId) => {
    try {
      await API.delete(`/wishlist/${tmdbId}`);
      set((state) => ({
        wishlist: state.wishlist.filter((item) => item.tmdbId !== tmdbId),
      }));
    } catch (err) {
      console.error("Failed to remove from wishlist", err);
    }
  },
}));
export default wishlistStore;
