import { useNavigate } from "react-router-dom";

const TrendingCard = ({ id, title, name, year, vote_average, poster_path, media_type }) => {
  
  const navigate = useNavigate();

  const handleClick = (media, id) => {
    navigate(`/details/${media}/${id}`)
  }

  return (
    <div className="min-w-[160px] relative bg-gray-900 rounded-xl border border-gray-800 overflow-hidden shadow hover:shadow-teal-500/10 hover:scale-105 transition" onClick={()=>handleClick(media_type, id)}>
      <img src={`https://image.tmdb.org/t/p/w500${poster_path}`} alt={name || title} className="h-48 w-full object-cover" />
      <div className="p-3 text-white">
        <h3 className="text-sm font-semibold truncate">{name || title}</h3>
        <p className="text-xs text-gray-400">{year}</p>
        <p className="text-xs text-teal-400 mt-1">Rating: {parseFloat(vote_average.toFixed(1))}</p>
      </div>
      <span className="absolute top-2 right-2 bg-teal-600 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase shadow-md">
        {media_type}
      </span>
    </div>
  );
};

export default TrendingCard;
