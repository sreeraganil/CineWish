import { useNavigate } from "react-router-dom";

const Card = ({ id, title, release_date, poster_path, media_type="movie" }) => {

  const navigate = useNavigate();

  const handleClick = (media, id) => {
    navigate(`/details/${media}/${id}`)
  }

  return (
    <div className="min-w-[160px] relative bg-gray-900 border border-gray-800 rounded-xl overflow-hidden shadow hover:border-teal-300 transition" onClick={()=>handleClick(media_type, id)}>
      <img src={poster_path ? `https://image.tmdb.org/t/p/w500${poster_path}` : '/placeholder.png'} alt={title} className="h-48 w-full object-cover hover:object-bottom transition-all" />
      <div className="p-3 text-white">
        <h3 className="text-sm font-semibold truncate">{title}</h3>
        <p className="text-xs text-gray-400">{release_date}</p>
      </div>
      <span className="absolute top-2 right-2 bg-teal-600 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase shadow-md">
        {media_type}
      </span>
    </div>
  );
};

export default Card;
