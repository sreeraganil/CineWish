import mongoose from "mongoose";

const SeasonSchema = new mongoose.Schema(
  {
    season: { type: Number, required: true },
    episodeCount: { type: Number, required: true },
  },
  { _id: false }
);

const MediaMetaSchema = new mongoose.Schema(
  {
    mediaId: { type: Number, required: true, index: true },
    type: { type: String, enum: ["movie", "tv"], required: true },

    seasons: { type: [SeasonSchema], default: [] },
  },
  { timestamps: true }
);

MediaMetaSchema.index({ mediaId: 1, type: 1 }, { unique: true });

export default mongoose.model("MediaMeta", MediaMetaSchema);