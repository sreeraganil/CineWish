import { useEffect, useMemo } from "react";
import { useLocation, useParams } from "react-router-dom";
import BackHeader from "../components/Backheader";
import API from "../config/axios";

const Watch = () => {
  const { media, id, s = 1, e = 1 } = useParams();
  const { state } = useLocation();

  const resumeTime =
    typeof state?.progressSeconds === "number" &&
    state.progressSeconds > 5
      ? Math.floor(state.progressSeconds)
      : null;

  const src = useMemo(() => {
    const base =
      media === "tv"
        ? `https://www.vidking.net/embed/tv/${id}/${s}/${e}`
        : `https://www.vidking.net/embed/movie/${id}`;

    const params = new URLSearchParams({
      color: "009689",
      autoPlay: "true",
      ...(media === "tv" && {
        nextEpisode: "true",
        episodeSelector: "true",
      }),
      ...(resumeTime && { t: resumeTime }), // 👈 resume hint
    });

    return `${base}?${params.toString()}`;
  }, [media, id, s, e, resumeTime]);

  useEffect(() => {
    let lastSent = 0;

    const handler = (event) => {
      if (!event.origin.includes("vidking.net")) return;
      if (typeof event.data !== "string") return;

      let payload;
      try {
        payload = JSON.parse(event.data);
      } catch {
        return;
      }

      if (payload.type !== "PLAYER_EVENT") return;

      const {
        event: playerEvent,
        currentTime,
        duration,
        id: contentId,
        mediaType,
        season,
        episode,
      } = payload.data || {};

      // 🚫 DO NOT overwrite real progress with near-zero values
      if (
        typeof currentTime !== "number" ||
        typeof duration !== "number" ||
        currentTime < 5
      ) {
        return;
      }

      const now = Date.now();
      if (playerEvent === "timeupdate" && now - lastSent < 10_000) return;
      lastSent = now;

      API.post("/watch/progress", {
        mediaType,
        mediaId: Number(contentId),
        season: season ?? null,
        episode: episode ?? null,
        progressSeconds: Math.floor(currentTime),
        durationSeconds: Math.floor(duration),

        // optional UI cache (written once by backend)
        title: state?.title,
        poster: state?.poster,
        backdrop: state?.backdrop,
      }).catch(() => {});
    };

    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, [state]);

  return (
    <div className="relative w-screen h-screen overflow-hidden">
      <BackHeader title={state?.title} />
      <iframe
        src={src}
        className="w-full h-[calc(100vh-64px)]"
        allow="autoplay fullscreen"
        allowFullScreen
        sandbox="allow-scripts allow-same-origin allow-presentation"
      />
    </div>
  );
};

export default Watch;
