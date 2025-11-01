import mongoose from "mongoose";
import User from "../models/userModel.js";
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


export const getProfileData = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const [user, stats] = await Promise.all([
      User.findById(userId).select("-password").lean(),
      WatchList.aggregate([
        { 
          $match: { userId: new mongoose.Types.ObjectId(userId) },
        },
        {
          $group: {
            _id: {
              status: "$status",
              type: "$type",
            },
            count: { $sum: 1 },
          },
        },
      ]),
    ]);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    const counts = {
      watched: { movie: 0, show: 0, total: 0 },
      towatch: { movie: 0, show: 0, total: 0 }, 
    };
    
    for (const item of stats) {
      const { status, type } = item._id; 
      const count = item.count;

      if (status === "watched") {
        if (type === "movie") counts.watched.movie = count;
        else if (type === "tv") counts.watched.show = count;
      } else if (status === "towatch") { 
        if (type === "movie") counts.towatch.movie = count; 
        else if (type === "tv") counts.towatch.show = count; 
      }
    }

    counts.watched.total = counts.watched.movie + counts.watched.show;
    counts.towatch.total = counts.towatch.movie + counts.towatch.show; 
    
    res.json({
      user: {
        username: user.username,
        email: user.email,
        createdAt: user.createdAt,
      },
      watchedCount: {
        totalCount: counts.watched.total,
        movieCount: counts.watched.movie,
        showCount: counts.watched.show,
      },
      wishlistCount: {
        totalCount: counts.towatch.total, 
        movieCount: counts.towatch.movie, 
        showCount: counts.towatch.show,   
      },
    });
    
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch profile data", error: err.message });
  }
};
