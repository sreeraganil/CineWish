import WatchProgress from "../models/WatchProgressModel.js";

export const saveProgress = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const userId = req.user.id;

    const {
      mediaType,
      mediaId,
      season,
      episode,
      progressSeconds,
      durationSeconds,

      // optional UI cache
      title,
      poster,
      backdrop,
    } = req.body;

    if (!mediaType || !mediaId) {
      return res.status(400).json({ error: "Invalid payload" });
    }

    const status =
      durationSeconds &&
      progressSeconds / durationSeconds >= 0.9
        ? "completed"
        : "watching";

    const filter = {
      userId,
      mediaType,
      mediaId,
      season: season ?? null,
      episode: episode ?? null,
    };

    const update = {
      $set: {
        progressSeconds,
        durationSeconds,
        status,
        lastWatchedAt: new Date(),
      },
      $setOnInsert: {},
    };

    // write UI cache ONLY on first insert
    if (title) update.$setOnInsert.title = title;
    if (poster) update.$setOnInsert.poster = poster;
    if (backdrop) update.$setOnInsert.backdrop = backdrop;

    await WatchProgress.updateOne(filter, update, { upsert: true });

    res.sendStatus(204);
  } catch (err) {
    console.error("saveProgress error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getAllWatchProgress = async (req, res) => {
  const userId = req.user.id;

  const list = await WatchProgress.find({ userId })
    .select(
      "mediaType mediaId season episode status progressSeconds durationSeconds lastWatchedAt title poster backdrop"
    )
    .sort({ lastWatchedAt: -1 })
    .lean();

  res.json(list);
};


export const getContinueWatching = async (req, res) => {
  const userId = req.user.id;

  const list = await WatchProgress.find({
    userId,
    status: "watching",
  })
    .select(
      "mediaType mediaId season episode progressSeconds durationSeconds lastWatchedAt title poster backdrop"
    )
    .sort({ lastWatchedAt: -1 })
    .limit(20)
    .lean();

  res.json(list);
};


export const getCompletedWatchList = async (req, res) => {
  const userId = req.user.id;

  const list = await WatchProgress.find({
    userId,
    status: "completed",
  })
    .select(
      "mediaType mediaId season episode lastWatchedAt title poster backdrop"
    )
    .sort({ lastWatchedAt: -1 })
    .lean();

  res.json(list);
};


export const getWatchProgressByMedia = async (req, res) => {
  const userId = req.user.id;
  const { mediaType, mediaId } = req.params;
  const { season, episode } = req.query;

  if (!mediaType || !mediaId) {
    return res.status(400).json({ error: "mediaType and mediaId required" });
  }

  const query = {
    userId,
    mediaType,
    mediaId: Number(mediaId),
  };

  if (mediaType === "tv") {
    if (season !== undefined) query.season = Number(season);
    if (episode !== undefined) query.episode = Number(episode);
  }

  const result = await WatchProgress.find(query)
    .select(
      "mediaType mediaId season episode status progressSeconds durationSeconds lastWatchedAt title poster backdrop"
    )
    .sort({ lastWatchedAt: -1 })
    .lean();

  if (mediaType === "movie" || (season && episode)) {
    return res.json(result[0] || null);
  }

  res.json(result);
};

export const removeFromHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    const { mediaType, mediaId } = req.params;
    const { season, episode } = req.query;

    if (!mediaType || !mediaId) {
      return res.status(400).json({ error: "mediaType and mediaId required" });
    }

    const query = {
      userId,
      mediaType,
      mediaId: Number(mediaId),
    };

    // ✅ TV: delete specific episode ONLY when both are provided
    if (mediaType === "tv") {
      if (season === undefined || episode === undefined) {
        return res.status(400).json({
          error: "season and episode are required to delete a TV episode",
        });
      }

      query.season = Number(season);
      query.episode = Number(episode);
    }

    const result = await WatchProgress.deleteOne(query);

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "History item not found" });
    }

    res.sendStatus(204);
  } catch (err) {
    console.error("removeFromHistory error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};
