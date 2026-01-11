import { useNavigate } from "react-router-dom";

const RecommendationCard = ({ id, title, release_date, name, vote_average, backdrop_path, media_type }) => {
  const navigate = useNavigate();

  const handleClick = (media, id) => {
    navigate(`/details/${media}/${id}`)
  }

  return (
    <div className="relative hover:scale-105 bg-gray-900 border border-gray-800 rounded-xl overflow-hidden shadow hover:shadow-teal-500/10 transition" onClick={()=>handleClick(media_type, id)}>
      <img src={`https://image.tmdb.org/t/p/w500${backdrop_path}`} alt={title} className="w-full h-48 object-cover" />
      <div className="p-4 text-white">
        <h3 className="text-lg font-semibold mb-1">{title || name}</h3>
        <p className="text-sm text-gray-400">{release_date?.slice(0,4)}</p>
        <p className="text-sm text-teal-400 mt-2">Rating: {parseFloat(vote_average).toFixed(1)}</p>
      </div>
      <span className="absolute top-2 right-2 bg-teal-600 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase shadow-md">
        {media_type}
      </span>
    </div>
  );
};

export default RecommendationCard;
