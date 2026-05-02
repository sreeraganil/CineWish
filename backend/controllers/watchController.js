import mediaMetaModel from "../models/mediaMetaModel.js";
import WatchList from "../models/watchListModel.js";
import WatchProgress from "../models/WatchProgressModel.js";
import { fetchSeasonsFromTMDB } from "../utilities/fetchSeasons.js";
import { getNextEpisode } from "../utilities/getNextEpisode.js";

// export const saveProgress = async (req, res) => {
//   try {
//     if (!req.user) {
//       return res.status(401).json({ error: "Unauthorized" });
//     }

//     const userId = req.user.id;

//     const {
//       mediaType,
//       mediaId,
//       season,
//       episode,
//       progressSeconds,
//       durationSeconds,

//       // optional UI cache
//       title,
//       poster,
//       backdrop,
//     } = req.body;

//     if (!mediaType || !mediaId) {
//       return res.status(400).json({ error: "Invalid payload" });
//     }

//     const status =
//       durationSeconds &&
//       progressSeconds / durationSeconds >= 0.9
//         ? "completed"
//         : "watching";

//     const filter = {
//       userId,
//       mediaType,
//       mediaId,
//       season: season ?? null,
//       episode: episode ?? null,
//     };

//     const update = {
//       $set: {
//         progressSeconds,
//         durationSeconds,
//         status,
//         lastWatchedAt: new Date(),
//       },
//       $setOnInsert: {},
//     };

//     // write UI cache ONLY on first insert
//     if (title) update.$setOnInsert.title = title;
//     if (poster) update.$setOnInsert.poster = poster;
//     if (backdrop) update.$setOnInsert.backdrop = backdrop;

//     await WatchProgress.updateOne(filter, update, { upsert: true });

//     res.sendStatus(204);
//   } catch (err) {
//     console.error("saveProgress error:", err);
//     res.status(500).json({ error: "Internal server error" });
//   }
// };

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
      title,
      poster,
      backdrop,
      year,
      genre,
    } = req.body;

    if (!mediaType || !mediaId) {
      return res.status(400).json({ error: "Invalid payload" });
    }

    /* -----------------------------
       1) SEED SEASON CACHE (TV only, fire-and-forget)
    ------------------------------ */
    if (mediaType === "tv") {
      mediaMetaModel.exists({ mediaId: Number(mediaId), type: "tv" }).then((exists) => {
        if (!exists) {
          fetchSeasonsFromTMDB(mediaId)
            .then((seasons) =>
              mediaMetaModel.findOneAndUpdate(
                { mediaId: Number(mediaId), type: "tv" },
                { $setOnInsert: { seasons } },
                { upsert: true }
              )
            )
            .catch((err) => console.warn("Season cache seed failed:", err.message));
        }
      });
    }

    /* -----------------------------
       2) COMPUTE STATUS
    ------------------------------ */
    const ratio =
      durationSeconds && progressSeconds
        ? progressSeconds / durationSeconds
        : 0;

    const newStatus = ratio >= 0.9 ? "completed" : "watching";

    /* -----------------------------
       3) UPSERT PROGRESS
    ------------------------------ */
    const filter = {
      userId,
      mediaType,
      mediaId,
      season: season ?? null,
      episode: episode ?? null,
    };

    await WatchProgress.findOneAndUpdate(
      filter,
      {
        $set: {
          progressSeconds,
          durationSeconds,
          status: newStatus,
          lastWatchedAt: new Date(),
          // keep metadata fresh on every update (fixes $setOnInsert-only bug)
          title,
          poster,
          backdrop,
        },
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    // Nothing more to do until the episode is completed
    if (newStatus !== "completed") {
      return res.sendStatus(204);
    }

    /* -----------------------------
       4) MOVIES → DIRECT WATCHED
    ------------------------------ */
    if (mediaType === "movie") {
      await WatchList.updateOne(
        { userId, tmdbId: mediaId, type: mediaType },
        {
          $set: { status: "watched" },
          $setOnInsert: { title, poster, year, genre },
        },
        { upsert: true }
      );

      return res.sendStatus(204);
    }

    /* -----------------------------
       5) TV — ADVANCE OR COMPLETE
    ------------------------------ */
    if (mediaType === "tv" && season != null && episode != null) {
      const meta = await mediaMetaModel.findOne({
        mediaId: Number(mediaId),
        type: "tv",
      });

      if (!meta) {
        // Metadata missing (seed hasn't settled yet) — fail gracefully
        return res.sendStatus(204);
      }

      const next = getNextEpisode(meta, season, episode);

      if (next) {
        // Pre-create the next episode row so it shows up in continue-watching
        await WatchProgress.updateOne(
          {
            userId,
            mediaType,
            mediaId,
            season: next.season,
            episode: next.episode,
          },
          {
            $setOnInsert: {
              progressSeconds: 0,
              durationSeconds: null,
              status: "watching",
              title,
              poster,
              backdrop,
              lastWatchedAt: new Date(),
            },
          },
          { upsert: true }
        );
      } else {
        // Last episode done — mark full show as watched
        await WatchList.updateOne(
          { userId, tmdbId: mediaId, type: mediaType },
          {
            $set: { status: "watched" },
            $setOnInsert: { title, poster, year, genre },
          },
          { upsert: true }
        );
      }
    }

    return res.sendStatus(204);
  } catch (err) {
    console.error("saveProgress error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getAllWatchProgress = async (req, res) => {
  const userId = req.user.id;

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;

  const skip = (page - 1) * limit;

  const [list, total] = await Promise.all([
    WatchProgress.find({ userId })
      .select(
        "mediaType mediaId season episode status progressSeconds durationSeconds lastWatchedAt title poster backdrop",
      )
      .sort({ lastWatchedAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),

    WatchProgress.countDocuments({ userId }),
  ]);

  res.json({
    data: list,
    page,
    totalPages: Math.ceil(total / limit),
    total,
  });
};

export const getContinueWatching = async (req, res) => {
  const userId = req.user.id;

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  const skip = (page - 1) * limit;

  const [list, total] = await Promise.all([
    WatchProgress.find({
      userId,
      status: "watching",
    })
      .select(
        "mediaType mediaId season episode progressSeconds durationSeconds lastWatchedAt title poster backdrop"
      )
      .sort({ lastWatchedAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),

    WatchProgress.countDocuments({
      userId,
      status: "watching",
    }),
  ]);

  res.json({
    data: list,
    page,
    totalPages: Math.ceil(total / limit),
  });
};

export const getCompletedWatchList = async (req, res) => {
  const userId = req.user.id;

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;

  const skip = (page - 1) * limit;

  const [list, total] = await Promise.all([
    WatchProgress.find({
      userId,
      status: "completed",
    })
      .select(
        "mediaType mediaId season episode lastWatchedAt title poster backdrop"
      )
      .sort({ lastWatchedAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),

    WatchProgress.countDocuments({
      userId,
      status: "completed",
    }),
  ]);

  res.json({
    data: list,
    page,
    totalPages: Math.ceil(total / limit),
  });
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
      "mediaType mediaId season episode status progressSeconds durationSeconds lastWatchedAt title poster backdrop",
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
