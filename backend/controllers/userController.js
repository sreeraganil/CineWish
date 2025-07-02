import WatchList from "../models/watchListModel.js";

export const getWatchStats = async (req, res) => {
  try {
    const userId = req.user.id;

    const watchedItems = await WatchList.find({
      userId,
      status: "watched",
    });

    const moviesWatched = watchedItems.filter((item) => item.type === "movie").length;
    const seriesWatched = watchedItems.filter((item) => item.type === "tv").length;

    const ratings = watchedItems.map((item) => item.rating).filter(Boolean);
    const averageRating = ratings.length
      ? (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1)
      : 0;

    res.json({
      moviesWatched,
      seriesWatched,
      averageRating: parseFloat(averageRating),
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch stats", error: err.message });
  }
};
