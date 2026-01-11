// models/WatchProgress.js
import mongoose from "mongoose";

const WatchProgressSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      index: true,
    },

    mediaType: {
      type: String,
      enum: ["movie", "tv"],
      required: true,
      index: true,
    },

    mediaId: {
      type: Number,
      required: true,
      index: true,
    },

    season: Number,
    episode: Number,

    progressSeconds: {
      type: Number,
      default: 0,
    },

    durationSeconds: Number,

    status: {
      type: String,
      enum: ["watching", "completed"],
      required: true,
    },

    // 👇 OPTIONAL UI CACHE (never trusted)
    title: {
      type: String,
      trim: true,
    },

    poster: {
      type: String,
    },

    backdrop: {
      type: String,
    },

    lastWatchedAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  { timestamps: true }
);

// one doc per user + media + episode
WatchProgressSchema.index(
  {
    userId: 1,
    mediaType: 1,
    mediaId: 1,
    season: 1,
    episode: 1,
  },
  { unique: true }
);

export default mongoose.model("WatchProgress", WatchProgressSchema);
