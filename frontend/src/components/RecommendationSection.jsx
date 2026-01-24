import { useEffect } from "react";
import userStore from "../store/userStore";
import RecommendationCard from "./RecommendationCard";
import wishlistStore from "../store/wishlistStore";

const RecommendationSection = () => {
  const { user, recommended, fetchRecommendations } = userStore();
  const { fetchWatched } = wishlistStore();

  const fetchData = async () => {
    try {
      const watched = await fetchWatched();
      const randomIndex = Math.floor(Math.random() * watched.length);
      const { type, tmdbId } = watched[randomIndex];
      tmdbId && await fetchRecommendations(type, tmdbId);
    } catch (err) {
      console.log(`error in fetching recommendations: ${err?.message}`);
    }
  }; 

  useEffect(() => {
    recommended?.length == 0 && user && fetchData();
  }, []);

  if (recommended?.length == 0) return null;

  return (
    <section className="bg-gray-950 p-4 text-white">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-teal-400">
          Recommended For You
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {recommended?.map((item, idx) => (
            <RecommendationCard key={idx} {...item} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default RecommendationSection;
