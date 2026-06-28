import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import BackHeader from "../components/BackHeader";
import API from "../config/axios";

const Watch = () => {
  const { media, id, s = "1", e = "1" } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();

  const [server, setServer] = useState(() => {
    return localStorage.getItem("preferredServer") || "server1";
  });

  const iframeRef = useRef(null);
  const lastProgressRef = useRef(0);

  const handleServerChange = (newServer) => {
    setServer(newServer);
    localStorage.setItem("preferredServer", newServer);
  };

  useEffect(() => {
    if (!state?.title) {
      navigate(`/details/${media}/${id}`, {
        replace: true,
      });
    }
  }, [state?.title, media, id, navigate]);

  useEffect(() => {
    lastProgressRef.current = 0;
  }, [server, id, s, e]);

  const src = useMemo(() => {
    if (server === "server2") {
      // Videasy Server
      const baseUrl =
        media === "tv"
          ? `https://player.videasy.net/tv/${id}/${s}/${e}`
          : `https://player.videasy.net/movie/${id}`;

      const params = new URLSearchParams();
      params.set("color", "009689");
      params.set("nextEpisode", "true");
      params.set("autoplayNextEpisode", "true");
      params.set("episodeSelector", "true");
      params.set("overlay", "true");

      if (state?.progressSeconds > 0) {
        params.set("progress", String(Math.floor(state.progressSeconds)));
      }

      return `${baseUrl}?${params.toString()}`;
    } else {
      // Peachify Server (Default)
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
    }
  }, [server, media, id, s, e, state?.progressSeconds]);

  useEffect(() => {
    const syncProgress = async ({
      mediaType: eventMediaType,
      tmdbId: eventTmdbId,
      season: eventSeason,
      episode: eventEpisode,
      currentTime,
      duration,
      forceSync = false,
    }) => {
      const progress = Math.floor(Number(currentTime) || 0);
      const totalDuration = Math.floor(Number(duration) || 0);

      if (progress < 5) return;

      const isBackwardSeek = progress < lastProgressRef.current - 2;
      const isForwardSync = progress - lastProgressRef.current >= 10;
      const isEnded = progress === totalDuration && totalDuration > 0;

      if (!isBackwardSeek && !isForwardSync && !isEnded && !forceSync) {
        return;
      }

      lastProgressRef.current = progress;

      const resolvedMediaType = eventMediaType === "anime" ? "tv" : (eventMediaType || media);
      const resolvedMediaId = Number(eventTmdbId || id);
      const resolvedSeason = resolvedMediaType === "tv" ? Number(eventSeason || s || 1) : null;
      const resolvedEpisode = resolvedMediaType === "tv" ? Number(eventEpisode || e || 1) : null;

      const payload = {
        mediaType: resolvedMediaType,
        mediaId: resolvedMediaId,
        season: resolvedSeason,
        episode: resolvedEpisode,
        progressSeconds: progress,
        durationSeconds: totalDuration > 0 ? totalDuration : 0,
        poster: state?.poster,
        backdrop: state?.backdrop,
        title: state?.title,
      };

      try {
        console.log("SYNCING", payload);

        await API.post("/watch/progress", payload);

        console.log(`[${server.toUpperCase()}] Progress synced`, progress);
      } catch (error) {
        console.error(`[${server.toUpperCase()}] Progress sync failed`, error);
      }
    };

    const handleMessage = async (event) => {
      let payload = event.data;

      if (!payload) return;

      // Parse string payloads if necessary
      if (typeof payload === "string") {
        try {
          payload = JSON.parse(payload);
        } catch {
          return;
        }
      }

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

      // Peachify player event tracking
      if (payload.type === "PLAYER_EVENT") {
        const {
          event: playerEvent,
          currentTime,
          duration,
          tmdbId,
          mediaType: pMediaType,
          season: pSeason,
          episode: pEpisode,
        } = payload.data || {};

        if (!["timeupdate", "pause", "ended", "seeked", "seeking"].includes(playerEvent)) {
          return;
        }

        const forceSync = ["pause", "ended", "seeked", "seeking"].includes(playerEvent);

        await syncProgress({
          mediaType: pMediaType,
          tmdbId,
          season: pSeason,
          episode: pEpisode,
          currentTime,
          duration,
          forceSync,
        });
        return;
      }

      // Videasy progress tracking event
      const vidData = payload.timestamp !== undefined ? payload : payload.data;
      if (vidData && (vidData.timestamp !== undefined || vidData.currentTime !== undefined || vidData.progress !== undefined)) {
        try {
          localStorage.setItem("videasyProgress", JSON.stringify(vidData));
        } catch {
          // ignore
        }

        const currentPos = vidData.timestamp !== undefined 
          ? vidData.timestamp 
          : (vidData.currentTime !== undefined ? vidData.currentTime : (vidData.progress * vidData.duration / 100));

        await syncProgress({
          mediaType: vidData.type,
          tmdbId: vidData.id,
          season: vidData.season,
          episode: vidData.episode,
          currentTime: currentPos,
          duration: vidData.duration,
        });
      }
    };

    window.addEventListener("message", handleMessage);

    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, [state?.poster, state?.backdrop, state?.title, server, media, id, s, e]);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-black flex flex-col">
      <BackHeader title={state?.title}>
        <div className="flex items-center gap-0.5 bg-black/60 border border-white/15 rounded-full p-0.5 backdrop-blur-md">
          <button
            onClick={() => handleServerChange("server1")}
            className={`px-2.5 py-1 text-[11px] font-medium rounded-full transition-all flex items-center gap-1 cursor-pointer ${
              server === "server1"
                ? "bg-teal-500 text-black font-semibold shadow-sm"
                : "text-gray-400 hover:text-white"
            }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${server === "server1" ? "bg-black animate-pulse" : "bg-gray-500"}`} />
            Server 1
          </button>
          <button
            onClick={() => handleServerChange("server2")}
            className={`px-2.5 py-1 text-[11px] font-medium rounded-full transition-all flex items-center gap-1 cursor-pointer ${
              server === "server2"
                ? "bg-teal-500 text-black font-semibold shadow-sm"
                : "text-gray-400 hover:text-white"
            }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${server === "server2" ? "bg-black animate-pulse" : "bg-gray-500"}`} />
            Server 2
          </button>
        </div>
      </BackHeader>

      <iframe
        key={server}
        ref={iframeRef}
        src={src}
        className="w-full h-[calc(100vh-64px)] md:h-[calc(100vh-72px)] border-none bg-gray-950 transition-opacity duration-300"
        allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
};

export default Watch;
