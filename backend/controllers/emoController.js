import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import WatchList from "../models/watchListModel.js";
import Trending from "../models/trendingModel.js";
import Upcoming from "../models/upcomingModel.js";
import NowPlaying from "../models/nowPlayingModel.js";
import latestOTT from "../models/latestOTTModel.js";

function calculateDays(dateStr) {
  if (!dateStr || String(dateStr).length < 10) return null;
  const now = new Date();
  now.setHours(0, 0, 0, 0);

  const target = new Date(dateStr);
  if (isNaN(target.getTime())) return null;
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

    // Load cached TMDB lists to cross-reference release dates and genres
    const [upDoc, npDoc, trDoc, ottDoc] = await Promise.all([
      Upcoming.findOne().lean(),
      NowPlaying.findOne().lean(),
      Trending.findOne().lean(),
      latestOTT.findOne().lean(),
    ]);

    const tmdbMap = new Map();
    const allCached = [
      ...(upDoc?.data || []),
      ...(npDoc?.data || []),
      ...(trDoc?.data || []),
      ...(ottDoc?.data || []),
    ];
    for (const it of allCached) {
      const idKey = String(it.id || it.tmdbId || "");
      const relDate = it.release_date || it.first_air_date || "";
      if (idKey && relDate && !tmdbMap.has(idKey)) {
        tmdbMap.set(idKey, {
          date: relDate,
          rating: it.vote_average || it.rating || 0,
          genre: it.genre || (it.genre_ids ? it.genre_ids[0] : null)
        });
      }
    }

    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const curYear = now.getFullYear();

    // 1. Authenticated User Wishlist Mode
    if (userId && (feed === "wishlist" || feed === "watchlist")) {
      const wishlist = await WatchList.find({ userId, status: "towatch" })
        .sort({ updatedAt: -1 })
        .limit(20)
        .lean();

      const listCount = await WatchList.countDocuments({ userId, status: "towatch" });
      const watchedCount = await WatchList.countDocuments({ userId, status: "watched" });

      const parsedItems = wishlist.map((m) => {
        const isTV = m.type === "tv" ? 1 : 0;
        const idKey = String(m.tmdbId || m._id || "");
        const cached = tmdbMap.get(idKey);
        
        let relDate = (cached && cached.date) || m.release_date || "";
        let d = calculateDays(relDate);

        if (d === null) {
          const y = Number(m.year);
          if (y > curYear) {
            d = 60; // future year upcoming
            relDate = `${y}`;
          } else if (y === curYear) {
            d = 30; // current year upcoming
            relDate = `${y}`;
          } else if (y) {
            d = -Math.max(1, Math.round((now - new Date(y, 11, 31)) / (86400000)));
            relDate = `${y}`;
          } else {
            d = 0;
            relDate = "";
          }
        }

        const rating = (cached && cached.rating) ? cached.rating : (m.rating || 0);

        return {
          id: String(m._id || m.tmdbId),
          t: formatTitle(m.title),
          y: relDate ? String(relDate).slice(0, 10) : (m.year ? String(m.year) : ""),
          k: isTV,
          g: formatGenre(m.genre, isTV),
          r: Number(Number(rating).toFixed(1)),
          d: d,
        };
      });

      // Split into upcoming and released to give a balanced mix
      const upcomingItems = parsedItems.filter(it => it.d >= 0).sort((a, b) => a.d - b.d);
      const releasedItems = parsedItems.filter(it => it.d < 0).sort((a, b) => b.d - a.d); // most recent release first

      // Combine: up to 4 upcoming + up to 4 released
      const combined = [];
      const upTake = Math.min(upcomingItems.length, 4);
      for (let i = 0; i < upTake; i++) combined.push(upcomingItems[i]);
      const relTake = Math.min(releasedItems.length, 8 - combined.length);
      for (let i = 0; i < relTake; i++) combined.push(releasedItems[i]);
      // If still under 8, fill with remaining items
      for (const it of parsedItems) {
        if (combined.length >= 8) break;
        if (!combined.some(x => x.id === it.id)) combined.push(it);
      }

      // Best pick for Tonight's Pick screen (highest rating among unwatched)
      let pick = { t: "No picks yet", g: "Cinema", r: 0 };
      if (parsedItems.length > 0) {
        const sorted = [...parsedItems].sort((a, b) => b.r - a.r);
        pick = { t: sorted[0].t, g: sorted[0].g, r: sorted[0].r };
      }

      return res.json({
        ok: true,
        linked: true,
        stats: { w: watchedCount, l: listCount },
        pick,
        items: combined,
      });
    }

    // 2. Public / Guest Feed Mode (Upcoming, Now-Playing, OTT, Trending)
    let rawList = [];
    if (feed === "upcoming") {
      if (upDoc?.data?.length) rawList = upDoc.data;
    } else if (feed === "now-playing" || feed === "theaters") {
      if (npDoc?.data?.length) rawList = npDoc.data;
    } else if (feed === "ott") {
      if (ottDoc?.data?.length) rawList = ottDoc.data;
    }

    // Default to trending if requested feed is empty
    if (!rawList.length) {
      if (trDoc?.data?.length) rawList = trDoc.data;
    }

    let parsed = rawList.map((m) => {
      const isTV = m.first_air_date || m.media_type === "tv" ? 1 : 0;
      const title = m.title || m.name || "Untitled";
      const date = m.release_date || m.first_air_date || "";
      let d = calculateDays(date);
      if (d === null) d = (feed === "upcoming" ? 1 : 0);

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

    if (feed === "upcoming") {
      // Sort upcoming by closest release date >= 0
      parsed = parsed.filter(it => it.d >= 0).sort((a, b) => a.d - b.d);
    }

    const items = parsed.slice(0, 8);

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
