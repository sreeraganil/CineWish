import mongoose from "mongoose";

const trendingSchema = new mongoose.Schema({
  data: Array,
  fetchedAt: {
    type: Date,
    default: Date.now
  }
});

const Trending = mongoose.model("Trending", trendingSchema);

export default Trending;
