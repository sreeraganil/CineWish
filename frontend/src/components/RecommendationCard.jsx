const RecommendationCard = ({ title, release_date, vote_average, genres, backdrop_path }) => {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden shadow hover:shadow-teal-500/10 transition">
      <img src={`https://image.tmdb.org/t/p/w500${backdrop_path}`} alt={title} className="w-full h-48 object-cover" />
      <div className="p-4 text-white">
        <h3 className="text-lg font-semibold mb-1">{title}</h3>
        <p className="text-sm text-gray-400">{release_date?.slice(0,4)}</p>
        <p className="text-sm text-teal-400 mt-2">Rating: {parseFloat(vote_average).toFixed(1)}</p>
      </div>
    </div>
  );
};

export default RecommendationCard;
