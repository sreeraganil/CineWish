import { create } from "zustand";
import API from "../config/axios";
import toast from "react-hot-toast";  

const wishlistStore = create((set, get) => ({
  wishlist: [],
  watched: [],
  wishlistCount: {},
  watchedCount: {},

  fetchWishlist: async (queries, page = 1, limit = 20) => {
    try {
      const { data } = await API.get(`/wishlist?page=${page}&limit=${limit}&${queries}`);
      set((state) => ({
      wishlist: page === 1 ? data.data : [...state.wishlist, ...data.data],
      wishlistCount: data.total
    }));
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
      throw err || "Failed to add to wishlist";
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

 fetchWatched: async (page = 1) => {
  try {
    const { data } = await API.get(`/wishlist?status=watched&page=${page}`);
    set((state) => ({
      watched: page === 1 ? data.data : [...state.watched, ...data.data],
      watchedCount: data.total
    }));
    return data.data;
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
