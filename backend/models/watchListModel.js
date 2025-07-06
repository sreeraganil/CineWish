import mongoose from "mongoose";

const watchListSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    tmdbId: {
      type: Number,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["movie", "tv"],
      required: true,
    },
    poster: {
      type: String,
    },
    year: {
      type: Number,
    },
    genre: Array,
    rating: {
      type: Number,
    },
    status: {
      type: String,
      enum: ["towatch", "watched",],
      default: "towatch",
    },
  },
  { timestamps: true }
);

const WatchList = mongoose.model("WatchList", watchListSchema);

export default WatchList;
