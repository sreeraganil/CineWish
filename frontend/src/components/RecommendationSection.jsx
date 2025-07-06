import { useEffect } from "react";
import userStore from "../store/userStore";
import RecommendationCard from "./RecommendationCard";
import wishlistStore from "../store/wishlistStore";

const dummyRecommendations = [
  {
    title: "Dune: Part Two",
    year: 2024,
    rating: 8.6,
    genre: "Sci-Fi",
    poster:
      "https://miro.medium.com/v2/resize:fit:1400/1*SvqveyU-E2RAHPwHykl5YQ.jpeg",
  },
  {
    title: "Oppenheimer",
    year: 2023,
    rating: 8.8,
    genre: "Biography",
    poster:
      "https://comicbook.com/wp-content/uploads/sites/4/2023/05/48201840-5985-42e4-9a43-203c636ada17.jpg?w=1024",
  },
  {
    title: "Breaking Bad",
    year: 2008,
    rating: 9.5,
    genre: "Crime, Drama",
    poster:
      "https://goinswriter.com/wp-content/uploads/2013/10/breaking-bad.png",
  },
];

const RecommendationSection = () => {
  const { recommended, fetchRecommendations } = userStore();
  const { watched, fetchWatched } = wishlistStore();

  const fetchData = async () => {
    try {
      await fetchWatched();
      const { tmdbId, type } = watched[0];
      console.log(tmdbId, type);
      await fetchRecommendations(type, tmdbId);
    } catch (err) {
      console.log(`error in fetching recommendations: ${err?.message}`);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (recommended?.length == 0) return null;

  return (
    <section className="bg-gray-950 py-8 px-4 text-white">
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
