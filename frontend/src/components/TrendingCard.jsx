import { useNavigate } from "react-router-dom";

const TrendingCard = ({
  id,
  title,
  name,
  release_date: m_year,
  first_air_date: s_year,
  vote_average,
  poster_path,
  media_type = "movie",
}) => {
  const navigate = useNavigate();

  const handleClick = (media = "movie", id) => {
    navigate(`/details/${media}/${id}`);
  };

  return (
    <div
      className="min-w-[160px] my-1 relative bg-gray-900 rounded-xl border border-gray-800 overflow-hidden shadow hover:border-teal-300 transition-all group"
      onClick={() => handleClick(media_type, id)}
    >
      <img
        src={`https://image.tmdb.org/t/p/w500${poster_path}`}
        alt={name || title}
        className="h-48 w-full object-cover group-hover:object-bottom transition-all"
      />
      <div className="p-3 text-white">
        <h3 className="text-sm font-semibold truncate">{name || title}</h3>
        <div className="flex items-center gap-1">
          <svg
            className="w-3 h-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <p className="text-xs text-gray-400 py-0.5">
            {m_year ? m_year?.slice(0, 4) : s_year?.slice(0, 4)}
          </p>
        </div>
      </div>
      <span className="absolute top-2 right-2 bg-teal-600 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase shadow-md">
        {media_type}
      </span>
      {!!(vote_average && parseFloat(vote_average) > 0) && (
        <div className="absolute top-2 left-2">
          <div className="flex items-center gap-1 bg-black/60 backdrop-blur-sm px-2 py-1 rounded-full">
            <svg
              className="w-3 h-3 text-yellow-400"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="text-white text-xs font-semibold">
              {vote_average.toFixed(1)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrendingCard;
