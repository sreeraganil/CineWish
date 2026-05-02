import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import BackHeader from "../components/BackHeader";
import API from "../config/axios";

const SOURCES = ["vidking", "videasy"];

const Watch = () => {
  const { media, id, s = "1", e = "1" } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);
  const [activeSource, setActiveSource] = useState("vidking");
  const lastSentRef = useRef(0);
  const iframeRef = useRef(null);

  // 1. Static Clean URL Generation — per source
  const src = useMemo(() => {
    if (activeSource === "videasy") {
      const baseUrl =
        media === "tv"
          ? `https://player.videasy.net/tv/${id}/${s}/${e}`
          : `https://player.videasy.net/movie/${id}`;

      const params = new URLSearchParams({
        color: "009689",
        autoPlay: "true",
        nextEpisode: "true",
        episodeSelector: "true",
        autoplayNextEpisode: "true",
      });

      return `${baseUrl}?${params.toString()}`;
    }

    // vidking (default)
    const baseUrl =
      media === "tv"
        ? `https://www.vidking.net/embed/tv/${id}/${s}/${e}`
        : `https://www.vidking.net/embed/movie/${id}`;

    const params = new URLSearchParams({
      color: "009689",
      autoPlay: "true",
      nextEpisode: "true",
      episodeSelector: "true",
    });

    return `${baseUrl}?${params.toString()}`;
  }, [id, media, s, e, activeSource]);

  // 2. Progress Syncing (Background Only)
  const syncProgress = useCallback(
    async (currentTime, duration, episode, season, mediaType, id) => {
      if (currentTime < 5) return;
      const now = Date.now();
      if (now - lastSentRef.current < 15000) return;
      lastSentRef.current = now;

      try {
        await API.post("/watch/progress", {
          mediaType: mediaType,
          mediaId: Number(id),
          season: mediaType === "tv" ? Number(season) : null,
          episode: mediaType === "tv" ? Number(episode) : null,
          progressSeconds: Math.floor(currentTime),
          durationSeconds: Math.floor(duration),
          poster: state?.poster,
          backdrop: state?.backdrop,
          title: state?.title,
        });
      } catch (e) {
        console.warn("Backend progress sync failed");
      }
    },
    [state]
  );

  // 3. Message passing for progress tracking
  useEffect(() => {
    if (!state?.title) {
      navigate(`/details/${media}/${id}`);
    }

    const handleMessage = (event) => {
      const trustedOrigins = ["vidking.net", "videasy.net"];
      if (!trustedOrigins.some((o) => event.origin.includes(o))) return;

      try {
        const payload =
          typeof event.data === "string" ? JSON.parse(event.data) : event.data;

        if (payload.type === "PLAYER_EVENT") {
          const { event: playerEvent, currentTime, duration } = payload.data || {};

          if (playerEvent === "timeupdate") {
            const { episode, season, mediaType, id } = payload.data;
            if (isLoading) setIsLoading(false);
            syncProgress(currentTime, duration, episode, season, mediaType, id);
          }
        }
      } catch (e) {
        // Ignore malformed JSON or cross-origin errors
      }
    };

    window.addEventListener("message", handleMessage);

    const fallback = setTimeout(() => setIsLoading(false), 8000);

    return () => {
      window.removeEventListener("message", handleMessage);
      clearTimeout(fallback);
    };
  }, [isLoading, syncProgress, state, media, id, navigate]);

  // Reset loading state when switching sources
  const handleSourceSwitch = (source) => {
    if (source === activeSource) return;
    setIsLoading(true);
    setActiveSource(source);
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-black flex flex-col font-sans">
      {/* Fixed Header */}
      <BackHeader title={state?.title} />

      {/* Source Switcher */}
      <div className="absolute top-[72px] right-3 z-50 flex gap-1.5">
        {SOURCES.map((source) => (
          <button
            key={source}
            onClick={() => handleSourceSwitch(source)}
            className={`px-3 py-1 rounded text-[10px] font-bold uppercase tracking-widest transition-all duration-200 border ${
              activeSource === source
                ? "bg-teal-500 border-teal-500 text-black"
                : "bg-black/60 border-zinc-700 text-zinc-400 hover:border-teal-500 hover:text-teal-400"
            }`}
          >
            {source === "vidking" ? "SERVER 1" : "SERVER 2"}
          </button>
        ))}
      </div>

      {/* Loading Spinner */}
      {isLoading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black z-40">
          <div className="w-12 h-12 border-[3px] border-teal-500/20 border-t-teal-500 rounded-full animate-spin"></div>
          <p className="mt-4 text-zinc-500 text-[9px] font-black uppercase tracking-[0.3em] animate-pulse">
            Establishing Stream
          </p>
        </div>
      )}

      {/* Optimized Iframe */}
      <iframe
        ref={iframeRef}
        src={src}
        className={`w-full h-[calc(100vh-72px)] border-none transition-opacity duration-700 ${
          isLoading ? "opacity-0" : "opacity-100"
        }`}
        allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
        allowFullScreen
        onLoad={() => setTimeout(() => setIsLoading(false), 1000)}
      />
    </div>
  );
};

export default Watch;