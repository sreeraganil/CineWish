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
      user && tmdbId && await fetchRecommendations(type, tmdbId);
    } catch (err) {
      console.log(`error in fetching recommendations: ${err?.message}`);
    }
  }; 

  useEffect(() => {
    recommended?.length == 0 && user && fetchData();
  }, []);

  if (recommended?.length == 0) return null;

  return (
    <section className="bg-gray-950 p-2 sm:p-4 text-white pt-3 sm:pt-4 md:pt-5">
      <div className="max-w-8xl mx-auto">
        <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-5 md:mb-6 text-teal-400">
          Recommended For You
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 md:gap-5 lg:gap-6 px-2 sm:px-0">
          {recommended?.map((item, idx) => (
            <RecommendationCard key={idx} {...item} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default RecommendationSection;
