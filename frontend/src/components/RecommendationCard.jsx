const RecommendationCard = ({ title, year, rating, genre, poster }) => {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden shadow hover:shadow-teal-500/10 transition">
      <img src={poster} alt={title} className="w-full h-48 object-cover" />
      <div className="p-4 text-white">
        <h3 className="text-lg font-semibold mb-1">{title}</h3>
        <p className="text-sm text-gray-400">{year} • {genre}</p>
        <p className="text-sm text-teal-400 mt-2">IMDb: {rating}</p>
      </div>
    </div>
  );
};

export default RecommendationCard;
