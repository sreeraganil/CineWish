import mongoose from "mongoose";

const upcomingSchema = new mongoose.Schema({
  data: Array,
  fetchedAt: {
    type: Date,
    default: Date.now
  }
});

const Upcoming = mongoose.model("Upcoming", upcomingSchema);

export default Upcoming;
