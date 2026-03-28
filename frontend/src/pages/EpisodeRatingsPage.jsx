import { useEffect, useMemo, useState, useRef, useCallback } from "react";
import API from "../config/axios";
import { useParams } from "react-router-dom";
import BackHeader from "../components/BackHeader";

/* ──────────────────────────────────────────────── */
/* Rating tiers */
/* ──────────────────────────────────────────────── */
const TIERS = [
  { min: 9.5, color: "bg-teal-400 text-teal-950", label: "Masterpiece" },
  { min: 9.0, color: "bg-emerald-400 text-emerald-950", label: "Exceptional" },
  { min: 8.5, color: "bg-green-400 text-green-950", label: "Excellent" },
  { min: 8.0, color: "bg-yellow-300 text-yellow-950", label: "Great" },
  { min: 7.0, color: "bg-amber-400 text-amber-950", label: "Good" },

  // 👇 Now red spectrum
  { min: 6.0, color: "bg-orange-400 text-orange-950", label: "Decent" },
  { min: 5.0, color: "bg-red-400 text-red-950", label: "Weak" },
  { min: 0, color: "bg-red-700 text-red-100", label: "Bad" },
];

const getTier = (r) => (r == null ? null : TIERS.find((t) => r >= t.min));

const CELL_SIZE = 44;
const SEASON_LABEL_W = 56;

/* ──────────────────────────────────────────────── */
/* Fixed-position Tooltip (portal-style via state)  */
/* ──────────────────────────────────────────────── */
function TooltipPortal({ tooltip }) {
  if (!tooltip) return null;
  const { x, y, season, epNum, ep, tier } = tooltip;

  // Tooltip dimensions (approximate)
  const TW = 160;
  const TH = 90;
  const ARROW = 8;
  const OFFSET = 6;

  // Try to place above; if not enough room, place below
  const placeAbove = y - TH - ARROW - OFFSET > 0;

  const left = Math.max(8, Math.min(x - TW / 2, window.innerWidth - TW - 8));
  const top = placeAbove ? y - TH - ARROW - OFFSET : y + CELL_SIZE + OFFSET;

  return (
    <div
      style={{
        position: "fixed",
        left,
        top,
        width: TW,
        zIndex: 9999,
        pointerEvents: "none",
      }}
      className="rounded-lg bg-slate-900 border border-slate-700 shadow-2xl text-xs"
    >
      {/* Arrow */}
      {placeAbove ? (
        <div
          style={{
            position: "absolute",
            bottom: -ARROW,
            left: Math.min(Math.max(x - left - ARROW, 8), TW - 24),
            width: 0,
            height: 0,
            borderLeft: `${ARROW}px solid transparent`,
            borderRight: `${ARROW}px solid transparent`,
            borderTop: `${ARROW}px solid #334155`,
          }}
        />
      ) : (
        <div
          style={{
            position: "absolute",
            top: -ARROW,
            left: Math.min(Math.max(x - left - ARROW, 8), TW - 24),
            width: 0,
            height: 0,
            borderLeft: `${ARROW}px solid transparent`,
            borderRight: `${ARROW}px solid transparent`,
            borderBottom: `${ARROW}px solid #334155`,
          }}
        />
      )}

      <div className="p-2.5 space-y-1">
        <p className="font-mono font-bold text-slate-300">
          S{String(season).padStart(2, "0")} E{String(epNum).padStart(2, "0")}
        </p>
        <p className="text-slate-400 leading-tight line-clamp-2">{ep.title}</p>
        {ep.rating != null ? (
          <div className="flex items-center gap-2 pt-0.5">
            <span className="font-bold text-white text-sm">
              {ep.rating.toFixed(1)}
            </span>
            {tier && (
              <span
                className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${tier.color}`}
              >
                {tier.label}
              </span>
            )}
          </div>
        ) : (
          <p className="text-slate-500 italic">No rating</p>
        )}
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────── */
/* Cell */
/* ──────────────────────────────────────────────── */
function Cell({ season, epNum, ep, onMouseEnter, onMouseLeave }) {
  const tier = getTier(ep?.rating);
  const ref = useRef(null);

  const handleMouseEnter = useCallback(() => {
    if (!ep || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    onMouseEnter({
      x: rect.left + rect.width / 2,
      y: rect.top,
      season,
      epNum,
      ep,
      tier,
    });
  }, [ep, season, epNum, tier, onMouseEnter]);

  if (!ep) {
    return (
      <div
        style={{ width: CELL_SIZE, height: CELL_SIZE, flexShrink: 0 }}
        className="rounded bg-slate-800/30"
      />
    );
  }

  return (
    <div
      ref={ref}
      style={{ width: CELL_SIZE, height: CELL_SIZE, flexShrink: 0 }}
      className={`relative rounded cursor-default select-none transition-transform hover:scale-110 hover:z-10 ${
        tier ? tier.color : "bg-slate-700 text-slate-300"
      }`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <span className="absolute inset-0 flex items-center justify-center text-[11px] font-bold leading-none">
        {ep.rating != null ? ep.rating.toFixed(1) : "—"}
      </span>
    </div>
  );
}

/* ──────────────────────────────────────────────── */
/* Main Page */
/* ──────────────────────────────────────────────── */
export default function EpisodeRatingsPage() {
  const [episodes, setEpisodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tooltip, setTooltip] = useState(null);
  const { imdbId } = useParams();

  const handleMouseEnter = useCallback((data) => setTooltip(data), []);
  const handleMouseLeave = useCallback(() => setTooltip(null), []);

  useEffect(() => {
    API.get(`/tmdb/ratings/${imdbId}`)
      .then((res) => setEpisodes(res.data.episodes || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [imdbId]);

  /* ──────────────────────────────────────────────── */
  /* Derived data */
  /* ──────────────────────────────────────────────── */
  const { seasons, maxEpisode, stats } = useMemo(() => {
    const map = new Map();
    let maxEp = 0;

    for (const ep of episodes) {
      if (!map.has(ep.season)) map.set(ep.season, new Map());
      map.get(ep.season).set(ep.episode, ep);
      if (ep.episode !== 0) maxEp = Math.max(maxEp, ep.episode);
    }

    const seasonKeys = [...map.keys()].sort((a, b) => a - b);
    const rated = episodes.filter((e) => e.rating != null && e.episode !== 0);
    const avg =
      rated.length === 0
        ? 0
        : rated.reduce((s, e) => s + e.rating, 0) / rated.length;
    const best = rated.reduce(
      (b, e) => (!b || e.rating > b.rating ? e : b),
      null,
    );
    const worst = rated.reduce(
      (b, e) => (!b || e.rating < b.rating ? e : b),
      null,
    );

    return {
      seasons: seasonKeys.map((s) => [s, map.get(s)]),
      maxEpisode: maxEp,
      stats: { avg, best, worst, total: episodes.length },
    };
  }, [episodes]);

  /* ──────────────────────────────────────────────── */
  /* Loading */
  /* ──────────────────────────────────────────────── */
  if (loading) {
  return (
    <>
    <BackHeader title="Episode Ratings" />
    <div className="w-full min-h-[calc(100vh-72px)] bg-slate-950 text-slate-100 px-4 py-2 md:px-6 md:py-3 space-y-6">

      {/* Header skeleton */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="h-8 w-48 rounded-lg bg-slate-800 animate-pulse" />
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: 7 }).map((_, i) => (
            <div
              key={i}
              className="h-6 rounded bg-slate-800 animate-pulse"
              style={{ width: 64 + (i % 3) * 16, animationDelay: `${i * 60}ms` }}
            />
          ))}
        </div>
      </div>

      {/* Heatmap skeleton */}
      <div className="w-full rounded-xl border border-slate-800 bg-slate-900/50 overflow-hidden">
        <div className="flex">

          {/* Sticky season label column */}
          <div className="sticky left-0 z-10 bg-slate-900 border-r border-slate-800 flex-shrink-0 p-1.5 pt-0" style={{ width: 56 }}>
            <div style={{ height: 24 }} />
            <div className="space-y-1">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  style={{ height: 44, animationDelay: `${i * 80}ms` }}
                  className="flex items-center justify-end pr-2"
                >
                  <div className="h-3 w-8 rounded bg-slate-700/80 animate-pulse" />
                </div>
              ))}
            </div>
          </div>

          {/* Episode grid skeleton */}
          <div className="overflow-x-hidden flex-1 p-1.5">
            {/* Ep number row */}
            <div className="flex items-center gap-1 mb-1" style={{ height: 24 }}>
              {Array.from({ length: 18 }).map((_, i) => (
                <div
                  key={i}
                  className="flex-shrink-0 h-2.5 rounded bg-slate-800 animate-pulse"
                  style={{ width: 44, animationDelay: `${i * 30}ms` }}
                />
              ))}
            </div>

            {/* Cell rows — shimmer cells with randomised opacity to mimic real data */}
            <div className="space-y-1">
              {Array.from({ length: 8 }).map((_, row) => (
                <div key={row} className="flex items-center gap-1">
                  {Array.from({ length: 18 }).map((_, col) => {
                    // some cells "missing" at end of rows to look realistic
                    const missing = col > 10 + (row % 4) * 2;
                    return (
                      <div
                        key={col}
                        className={`flex-shrink-0 rounded animate-pulse ${
                          missing ? "bg-slate-800/30" : "bg-slate-700/60"
                        }`}
                        style={{
                          width: 44,
                          height: 44,
                          animationDelay: `${(row * 18 + col) * 18}ms`,
                          animationDuration: "1.4s",
                        }}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Stat cards skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="rounded-xl bg-slate-900 border border-slate-800 p-4 space-y-2"
            style={{ animationDelay: `${i * 100}ms` }}
          >
            <div className="h-2.5 w-20 rounded bg-slate-700 animate-pulse" />
            <div className="h-7 w-14 rounded bg-slate-700/80 animate-pulse" style={{ animationDelay: `${i * 100 + 50}ms` }} />
            <div className="h-2 w-32 rounded bg-slate-800 animate-pulse" style={{ animationDelay: `${i * 100 + 100}ms` }} />
          </div>
        ))}
      </div>

    </div>
    </>
  );
}

  const epNumbers = Array.from({ length: maxEpisode }, (_, i) => i + 1);

  /* ──────────────────────────────────────────────── */
  /* Render */
  /* ──────────────────────────────────────────────── */
  return (
    <>
      {/* Header */}
      <BackHeader title="Episode Ratings" />
      <div className="w-full min-h-[calc(100vh-72px)] bg-slate-950 text-slate-100 px-4 py-2 md:px-6 md:py-3 space-y-6">
        {/* Legend */}
        <div className="flex flex-wrap gap-2 justify-end">
          {TIERS.map((t) => (
            <span
              key={t.label}
              className={`flex items-center gap-1.5 px-2 py-1 rounded text-xs font-medium ${t.color}`}
            >
              {t.label}
            </span>
          ))}
        </div>

        <div className="w-full rounded-xl border border-slate-800 bg-slate-900/50 overflow-hidden">
          {/* The outer div clips; the inner grid handles scroll */}
          <div className="flex">
            {/* ── Sticky season label column ── */}
            <div
              className="sticky left-0 z-10 bg-slate-900 border-r border-slate-800 flex-shrink-0"
              style={{ width: SEASON_LABEL_W }}
            >
              {/* Header spacer — matches the episode-number header row height */}
              <div style={{ height: 34 }} />

              {/* Season labels */}
              <div className="space-y-1 p-1.5 pt-0">
                {seasons.map(([season]) => (
                  <div
                    key={season}
                    style={{ height: CELL_SIZE }}
                    className="flex items-center justify-end pr-2 text-xs font-mono font-semibold text-slate-400"
                  >
                    S{String(season).padStart(2, "0")}
                  </div>
                ))}
              </div>
            </div>

            {/* ── Scrollable episode grid ── */}
            <div className="overflow-x-auto flex-1">
              <div
                style={{
                  minWidth: maxEpisode * CELL_SIZE + (maxEpisode - 1) * 4,
                }}
                className="p-1.5"
              >
                {/* Episode number header */}
                <div className="flex items-center mb-1" style={{ gap: 4 }}>
                  {epNumbers.map((n) => (
                    <div
                      key={n}
                      style={{ width: CELL_SIZE, height: 24, flexShrink: 0 }}
                      className="flex items-center justify-center text-[10px] font-mono text-slate-500"
                    >
                      {n}
                    </div>
                  ))}
                </div>

                {/* Season rows */}
                <div className="space-y-1">
                  {seasons.map(([season, eps]) => (
                    <div
                      key={season}
                      className="flex items-center"
                      style={{ gap: 4 }}
                    >
                      {epNumbers.map((n) => {
                        const ep = eps.get(n) ?? null;
                        return ep ? (
                          <Cell
                            key={n}
                            season={season}
                            epNum={n}
                            ep={ep}
                            onMouseEnter={handleMouseEnter}
                            onMouseLeave={handleMouseLeave}
                          />
                        ) : null;
                      })}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <StatCard label="Total Episodes" value={stats.total} />
          <StatCard
            label="Average Rating"
            value={stats.avg ? stats.avg.toFixed(2) : "—"}
          />
          <StatCard
            label="Best Episode"
            value={stats.best?.rating?.toFixed(1)}
            sub={
              stats.best
                ? `S${String(stats.best.season).padStart(2, "0")} E${String(stats.best.episode).padStart(2, "0")} · ${stats.best.title}`
                : undefined
            }
          />
          <StatCard
            label="Worst Episode"
            value={stats.worst?.rating?.toFixed(1)}
            sub={
              stats.worst
                ? `S${String(stats.worst.season).padStart(2, "0")} E${String(stats.worst.episode).padStart(2, "0")} · ${stats.worst.title}`
                : undefined
            }
          />
        </div>

        {/* Portal tooltip */}
        <TooltipPortal tooltip={tooltip} />
      </div>
    </>
  );
}

/* ──────────────────────────────────────────────── */
/* Small stat card */
/* ──────────────────────────────────────────────── */
function StatCard({ label, value, sub }) {
  return (
    <div className="rounded-xl bg-slate-900 border border-slate-800 p-4 space-y-1">
      <p className="text-xs text-slate-500 uppercase tracking-wider font-medium">
        {label}
      </p>
      <p className="text-2xl font-bold text-slate-100">{value ?? "—"}</p>
      {sub && <p className="text-xs text-slate-400 truncate">{sub}</p>}
    </div>
  );
}
