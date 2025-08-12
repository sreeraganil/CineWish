import mongoose from "mongoose";

const latestOTTSchema = new mongoose.Schema({
  data: Array,
  fetchedAt: {
    type: Date,
    default: Date.now
  }
});

const latestOTT = mongoose.model("Upcoming", latestOTTSchema);

export default latestOTT;