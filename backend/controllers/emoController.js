import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import WatchList from "../models/watchListModel.js";
import Trending from "../models/trendingModel.js";
import Upcoming from "../models/upcomingModel.js";
import NowPlaying from "../models/nowPlayingModel.js";
import latestOTT from "../models/latestOTTModel.js";

function calculateDays(dateStr, year) {
  if (!dateStr && !year) return 0;
  const now = new Date();
  now.setHours(0, 0, 0, 0);

  let target = null;
  if (dateStr && String(dateStr).length >= 10) {
    target = new Date(dateStr);
  } else if (year) {
    target = new Date(Number(year), 0, 1);
  }

  if (!target || isNaN(target.getTime())) return 0;
  target.setHours(0, 0, 0, 0);

  const diffMs = target.getTime() - now.getTime();
  return Math.round(diffMs / (1000 * 60 * 60 * 24));
}

function formatTitle(title, maxLen = 38) {
  if (!title) return "Untitled";
  const s = String(title).trim();
  return s.length > maxLen ? s.slice(0, maxLen - 2) + ".." : s;
}

function formatGenre(genre, isTV = 0) {
  if (Array.isArray(genre) && genre.length > 0) return String(genre[0]).slice(0, 10);
  if (typeof genre === "string" && genre.trim().length > 0) return genre.trim().slice(0, 10);
  return isTV ? "Series" : "Cinema";
}

export const getEmoFeed = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const bearerToken = authHeader && authHeader.startsWith("Bearer ") ? authHeader.slice(7).trim() : null;
    const token = req.cookies?.token || bearerToken || req.query.token;

    let userId = null;
    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        userId = decoded.id;
      } catch (err) {
        // Token invalid or expired - gracefully continue as unlinked
      }
    }

    const feed = req.query.feed || (userId ? "wishlist" : "trending");

    // 1. Authenticated User Wishlist Mode
    if (userId && (feed === "wishlist" || feed === "watchlist")) {
      const wishlist = await WatchList.find({ userId, status: "towatch" })
        .sort({ updatedAt: -1 })
        .limit(8);

      const listCount = await WatchList.countDocuments({ userId, status: "towatch" });
      const watchedCount = await WatchList.countDocuments({ userId, status: "watched" });

      const items = wishlist.map((m) => {
        const isTV = m.type === "tv" ? 1 : 0;
        const d = calculateDays(m.release_date, m.year);
        return {
          id: String(m._id || m.tmdbId),
          t: formatTitle(m.title),
          y: m.year ? String(m.year) : (m.release_date ? String(m.release_date).slice(0, 10) : ""),
          k: isTV,
          g: formatGenre(m.genre, isTV),
          r: Number((m.rating || 0).toFixed(1)),
          d: d,
        };
      });

      // Best pick for Tonight's Pick screen
      let pick = { t: "No picks yet", g: "Cinema", r: 0 };
      if (items.length > 0) {
        const sorted = [...items].sort((a, b) => b.r - a.r);
        pick = { t: sorted[0].t, g: sorted[0].g, r: sorted[0].r };
      }

      return res.json({
        ok: true,
        linked: true,
        stats: { w: watchedCount, l: listCount },
        pick,
        items,
      });
    }

    // 2. Public / Guest Feed Mode (Upcoming, Now-Playing, OTT, Trending)
    let rawList = [];
    if (feed === "upcoming") {
      const doc = await Upcoming.findOne();
      if (doc?.data?.length) rawList = doc.data;
    } else if (feed === "now-playing" || feed === "theaters") {
      const doc = await NowPlaying.findOne();
      if (doc?.data?.length) rawList = doc.data;
    } else if (feed === "ott") {
      const doc = await latestOTT.findOne();
      if (doc?.data?.length) rawList = doc.data;
    }

    // Default to trending if requested feed is empty
    if (!rawList.length) {
      const doc = await Trending.findOne();
      if (doc?.data?.length) rawList = doc.data;
    }

    const items = rawList.slice(0, 8).map((m) => {
      const isTV = m.first_air_date || m.media_type === "tv" ? 1 : 0;
      const title = m.title || m.name || "Untitled";
      const date = m.release_date || m.first_air_date || "";
      const d = calculateDays(date);

      return {
        id: String(m.id || ""),
        t: formatTitle(title),
        y: date.slice(0, 10),
        k: isTV,
        g: formatGenre(m.genre, isTV),
        r: Number((m.vote_average || 0).toFixed(1)),
        d: d,
      };
    });

    let pick = { t: "Trending Pick", g: "Cinema", r: 0 };
    if (items.length > 0) {
      const sorted = [...items].sort((a, b) => b.r - a.r);
      pick = { t: sorted[0].t, g: sorted[0].g, r: sorted[0].r };
    }

    return res.json({
      ok: true,
      linked: false,
      stats: { w: 0, l: items.length },
      pick,
      items,
    });
  } catch (err) {
    return res.status(500).json({ ok: false, err: err.message || "Failed to load Emo feed" });
  }
};

export const markWatchedEmo = async (req, res) => {
  try {
    const id = req.params.id || req.body?.id;
    if (!id) return res.status(400).json({ ok: false, message: "Movie ID required" });

    const userId = req.user._id;
    const query = isNaN(id) ? { _id: id, userId } : { $or: [{ _id: id }, { tmdbId: Number(id) }], userId };

    const updated = await WatchList.findOneAndUpdate(query, { status: "watched" }, { new: true });
    if (!updated) {
      return res.status(404).json({ ok: false, message: "Item not found in watchlist" });
    }

    return res.json({ ok: true, message: "Marked as watched", item: updated });
  } catch (err) {
    return res.status(500).json({ ok: false, message: err.message || "Failed to mark as watched" });
  }
};
