import WatchList from "../models/watchListModel.js";

export const addToWishlist = async (req, res) => {
  try {
    const { tmdbId, type, title, poster, year, rating, status, genre } = req.body;
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
      status,
      genre
    });

    res.status(201).json(item);
  } catch (err) {
    res
      .status(500)
      .json({ message: `Failed to add to wishlist: ${err.message}` });
  }
};

export const getWishlist = async (req, res) => {
  try {
    const userId = req.user.id;
    const status = req.query.status || "towatch";

    const { t, g, y, r, page = 1, limit = 20 } = req.query;

    // Start with basic query
    const query = { userId, status };

    if (t) query.type = t;
    if (g) query.genre = { $in: [g] };
    if (y) query.year = parseInt(y);
    if (r) query.rating = { $gte: parseFloat(r) };

    const wishlist = await WatchList.find(query).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit);
    const total = await WatchList.countDocuments({ userId, status });
    const filterTotal = await WatchList.countDocuments({ query });

    res.json({data: wishlist, total: {totalCount: total, filterTotalCount: filterTotal}});
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch wishlist", error: err.message });
  }
};


export const removeFromWishlist = async (req, res) => {
  try {
    const { id } = req.params;

    await WatchList.findByIdAndDelete(id);
    res.json({ message: "Removed from wishlist" });
  } catch (err) {
    res.status(500).json({ message: "Failed to remove item" });
  }
};

export const markAsWatched = async (req, res) => {
  try {
    const { id } = req.params;

    const updated = await WatchList.findByIdAndUpdate(
      id,
      { status: "watched" },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Item not found in watchlist" });
    }

    res.json({ message: "Marked as watched", item: updated });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to update status", error: err.message });
  }
};

export const checkIfExists = async (req, res) => {
  try {
    const userId = req.user.id;
    const { tmdbId } = req.params;

    const exists = await WatchList.findOne({ userId, tmdbId });
    res.json({ exists: !!exists, status: exists?.status || null });
  } catch (err) {
    res.status(500).json({ message: "Error checking status" });
  }
};

