import mongoose from "mongoose";

const latestOTTSchema = new mongoose.Schema({
  data: Array,
  fetchedAt: {
    type: Date,
    default: Date.now
  }
});

const latestOTT = mongoose.model("latestOTT", latestOTTSchema);

export default latestOTT;