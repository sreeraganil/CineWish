import { useEffect, useState } from "react";
import ContinueWatching from "../components/watch/ContinueWatching";
import WatchHistory from "../components/watch/WatchHistory";
import API from "../config/axios";

const WatchOverviewPage = () => {
  const [continueWatching, setContinueWatching] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const fetchWatchProgress = async () => {
      try {
        const { data } = await API.get("/watch/progress");

        if (!mounted) return;

        const watching = [];
        const completed = [];

        for (const item of data) {
          if (item.status === "watching") watching.push(item);
          else if (item.status === "completed") completed.push(item);
        }

        setContinueWatching(watching);
        setHistory(completed);
      } catch (err) {
        console.error("Failed to fetch watch progress", err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchWatchProgress();

    return () => {
      mounted = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 px-6 py-8 text-teal-400">
        Loading…
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 px-6 py-8">
      <ContinueWatching items={continueWatching} />
      <WatchHistory items={history} />
    </div>
  );
};

export default WatchOverviewPage;
