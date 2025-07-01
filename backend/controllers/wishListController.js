import WatchList from "../models/watchListModel.js";


export const addToWishlist = async (req, res) => {
  try {
    const { tmdbId, type, title, poster, year, rating } = req.body;
    const userId = req.user._id;

    const exists = await WatchList.findOne({ userId, tmdbId });
    if (exists) return res.status(400).json({ message: "Already in wishlist" });

    const item = await WatchList.create({
      userId,
      tmdbId,
      type,
      title,
      poster,
      year,
      rating,
    });

    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ message: `Failed to add to wishlist: ${err.message}` });
  }
};

export const getWishlist = async (req, res) => {
  try {
    const userId = req.user._id;
    const wishlist = await WatchList.find({ userId }).sort({ createdAt: -1 });
    res.json(wishlist);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch wishlist" });
  }
};

export const removeFromWishlist = async (req, res) => {
  try {
    const userId = req.user._id;
    const { tmdbId } = req.params;

    await WatchList.findOneAndDelete({ userId, tmdbId });
    res.json({ message: "Removed from wishlist" });
  } catch (err) {
    res.status(500).json({ message: "Failed to remove item" });
  }
};
