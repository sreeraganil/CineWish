import { useEffect, useMemo, useRef } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import BackHeader from "../components/BackHeader";
import API from "../config/axios";

const Watch = () => {
  const { media, id, s = "1", e = "1" } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();

  const iframeRef = useRef(null);
  const lastProgressRef = useRef(0);

  useEffect(() => {
    if (!state?.title) {
      navigate(`/details/${media}/${id}`, {
        replace: true,
      });
    }
  }, [state?.title, media, id, navigate]);

  const src = useMemo(() => {
    const baseUrl =
      media === "tv"
        ? `https://peachify.top/embed/tv/${id}/${s}/${e}`
        : `https://peachify.top/embed/movie/${id}`;

    const params = new URLSearchParams();

    params.set("accent", "009689");
    params.set("autoNext", "true");
    params.set("showNextBtn", "true");
    params.set("quality", "1080");
    params.set("sub", "English");

    if (state?.progressSeconds > 0) {
      params.set("progress", String(Math.floor(state.progressSeconds)));
    }

    return `${baseUrl}?${params.toString()}`;
  }, [media, id, s, e, state?.progressSeconds]);

  useEffect(() => {
    const syncProgress = async ({
      mediaType,
      tmdbId,
      season,
      episode,
      currentTime,
      duration,
    }) => {
      const progress = Math.floor(currentTime);

      if (progress < 5) return;

      // force sync every 15 seconds of actual playback
      if (progress !== duration && progress - lastProgressRef.current < 10) {
        return;
      }

      lastProgressRef.current = progress;

      const payload = {
        mediaType,
        mediaId: Number(tmdbId),
        season: mediaType === "tv" ? Number(season) : null,
        episode: mediaType === "tv" ? Number(episode) : null,
        progressSeconds: progress,
        durationSeconds: Math.floor(duration),
        poster: state?.poster,
        backdrop: state?.backdrop,
        title: state?.title,
      };

      try {
        console.log("SYNCING", payload);

        await API.post("/watch/progress", payload);

        console.log("[PEACHIFY] Progress synced", progress);
      } catch (error) {
        console.error("[PEACHIFY] Progress sync failed", error);
      }
    };

    const handleMessage = async (event) => {
      if (event.origin !== "https://peachify.top") {
        return;
      }

      const payload = event.data;

      if (!payload) return;

      // Store raw Peachify progress object
      if (payload.type === "MEDIA_DATA") {
        try {
          localStorage.setItem(
            "peachifyProgress",
            JSON.stringify(payload.data),
          );
        } catch {
          // ignore
        }

        return;
      }

      if (payload.type !== "PLAYER_EVENT") {
        return;
      }

      const {
        event: playerEvent,
        currentTime,
        duration,
        tmdbId,
        mediaType,
        season,
        episode,
      } = payload.data || {};

      if (!["timeupdate", "pause", "ended"].includes(playerEvent)) {
        return;
      }

      await syncProgress({
        mediaType,
        tmdbId,
        season,
        episode,
        currentTime,
        duration,
      });
    };

    window.addEventListener("message", handleMessage);

    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, [state?.poster, state?.backdrop, state?.title]);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-black flex flex-col">
      <BackHeader title={state?.title} />

      <iframe
        ref={iframeRef}
        src={src}
        className="w-full h-[calc(100vh-72px)] border-none"
        allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
};

export default Watch;
