import mongoose from "mongoose";

const sentNotificationSchema = new mongoose.Schema({
  tmdb_id: { type: Number, required: true, unique: true },
  title: { type: String },
  sent_at: { type: Date, default: Date.now },
});

export default mongoose.model("SentNotification", sentNotificationSchema);