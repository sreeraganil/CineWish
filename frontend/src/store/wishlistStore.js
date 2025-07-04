import { create } from "zustand";
import API from "../config/axios";
import toast from "react-hot-toast";

const wishlistStore = create((set, get) => ({
  wishlist: [],
  watched: [],

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
      await get.fetchWatched();
      set((state) => ({ wishlist: [...state.wishlist, data] }));
      return data;
    } catch (err) {
      throw err?.response?.data?.message || "Failed to add to wishlist";
    }
  },

  removeFromWishlist: async (id, tag) => {
    try {
      await API.delete(`/wishlist/${id}`);
      set((state) => ({
        wishlist: state.wishlist.filter((item) => item._id !== id),
        watched: state.watched.filter((item) => item._id !== id),
      }));
      toast.success(`Item removed from ${tag}`)
    } catch (err) {
      toast.error(`Failed to remove from ${tag}`);
      console.error(`Failed to remove from ${tag}`, err);
    }
  },

  fetchWatched: async () => {
    try {
      const { data } = await API.get("/wishlist?status=watched");
      set({ watched: data });
    } catch (err) {
      console.error("Failed to fetch wishlist", err);
    }
  },

  markAsWatched: async (id) => {
    try {
      const res = await API.put(`/wishlist/${id}`);
      set((state) => ({
        wishlist: state.wishlist.filter((item) => item._id !== id),
        watched: [...state.watched, res.data.item],
      }));
      toast.success("Marked as watched");
    } catch (err) {
      toast.error(`Failed to mark as watched`);
      console.error(err);
    }
  },
}));
export default wishlistStore;
