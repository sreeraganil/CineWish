import mongoose from "mongoose";

const nowPlayingSchema = new mongoose.Schema({
  data: Array,
  fetchedAt: {
    type: Date,
    default: Date.now
  }
});

const NowPlaying = mongoose.model("nowPlaying", nowPlayingSchema);

export default NowPlaying;