import { useEffect, useState } from "react";
import ContinueWatching from "./ContinueWatching";
import API from "../../config/axios";

const Watching = () => {
  const [continueWatching, setContinueWatching] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const fetchContinueWatching = async () => {
      try {
        const { data } = await API.get("/watch/continue");
        if (mounted) {
          setContinueWatching(data || []);
        }
      } catch (err) {
        console.error("Failed to fetch continue watching", err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchContinueWatching();

    return () => {
      mounted = false;
    };
  }, []);

  if (loading || !continueWatching.length) return null;

  return (
    <div className="bg-gray-950 pt-8 px-4 text-white relative">
      <div className="max-w-7xl mx-auto">
        <ContinueWatching items={continueWatching.slice(0, 5)} />
      </div>
    </div>
  );
};

export default Watching;
