import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { useLocation, useParams } from "react-router-dom";
import BackHeader from "../components/Backheader";
import API from "../config/axios";

const Watch = () => {
  const { media, id, s = "1", e = "1" } = useParams();
  const { state } = useLocation();
  
  const [isLoading, setIsLoading] = useState(true);
  const lastSentRef = useRef(0);
  const iframeRef = useRef(null);

  // 1. Static Clean URL Generation
  const src = useMemo(() => {
    const baseUrl = media === 'tv' 
      ? `https://www.vidking.net/embed/tv/${id}/${s}/${e}` 
      : `https://www.vidking.net/embed/movie/${id}`;
    
    const params = new URLSearchParams({
      color: "009689",
      autoPlay: "true",
    });

    return `${baseUrl}?${params.toString()}`;
  }, [id, media, s, e]);

  // 2. Progress Syncing (Background Only)
  const syncProgress = useCallback(async (currentTime, duration) => {
    const now = Date.now();
    // Throttling: only send every 15 seconds to minimize network traffic
    if (now - lastSentRef.current < 15000) return;
    lastSentRef.current = now;

    try {
      await API.post("/watch/progress", {
        mediaType: media,
        mediaId: Number(id),
        season: media === "tv" ? Number(s) : null,
        episode: media === "tv" ? Number(e) : null,
        progressSeconds: Math.floor(currentTime),
        durationSeconds: Math.floor(duration),
        poster: state?.poster,
        backdrop: state?.backdrop,
        title: state?.title,
      });
    } catch (e) {
      console.warn("Backend progress sync failed");
    }
  }, [media, id, s, e, state]);

  // 3. Message passing for progress tracking
  useEffect(() => {
    const handleMessage = (event) => {
      // Validate origin for security
      if (!event.origin.includes("vidking.net")) return;

      try {
        const payload = typeof event.data === "string" 
          ? JSON.parse(event.data) 
          : event.data;

        if (payload.type === "PLAYER_EVENT") {
          const { event: playerEvent, currentTime, duration } = payload.data || {};

          // Hide loading overlay once the player starts communicating
          if (playerEvent === "timeupdate") {
            if (isLoading) setIsLoading(false);
            syncProgress(currentTime, duration);
          }
        }
      } catch (e) {
        // Ignore malformed JSON or cross-origin errors
      }
    };

    window.addEventListener("message", handleMessage);
    
    // Safety fallback: Ensure player shows even if handshake is slow
    const fallback = setTimeout(() => setIsLoading(false), 8000);

    return () => {
      window.removeEventListener("message", handleMessage);
      clearTimeout(fallback);
    };
  }, [isLoading, syncProgress]);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-black flex flex-col font-sans">
      {/* Fixed Header */}
        <BackHeader title={state?.title} />

      {/* Modern Loading Spinner */}
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
        className={`w-full h-[calc(100vh-72px)] border-none transition-opacity duration-700 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
        allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
        allowFullScreen
        sandbox="allow-scripts allow-same-origin allow-forms allow-presentation"
        onLoad={() => setTimeout(() => setIsLoading(false), 2000)}
      />
    </div>
  );
};

export default Watch;