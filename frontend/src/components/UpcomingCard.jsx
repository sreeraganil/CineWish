import { useNavigate } from "react-router-dom";

const UpcomingCard = ({ id, title, release_date, poster_path, media_type="movie" }) => {

  const navigate = useNavigate();

  const handleClick = (media, id) => {
    navigate(`/details/${media}/${id}`)
  }

  return (
  <div
    className="min-w-[120px] sm:min-w-[140px] md:min-w-[160px] my-1 relative bg-gray-900 rounded-xl border border-gray-800 overflow-hidden shadow hover:border-teal-300 transition-all group cursor-pointer"
    onClick={() => handleClick(media_type, id)}
  >
    {/* Poster */}
    <div className="relative w-full aspect-[3/4] overflow-hidden">
      <img
        src={
          poster_path
            ? `https://image.tmdb.org/t/p/w500${poster_path}`
            : "/placeholder.png"
        }
        alt={title}
        onError={(e) => {
          e.currentTarget.src = "/placeholder.png";
        }}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        loading="lazy"
      />
    </div>

    {/* Content */}
    <div className="px-3 py-1.5 text-white">
      <h3 className="text-xs md:text-sm font-semibold truncate">
        {title}
      </h3>

      {release_date && (
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

          <p className="text-xs text-gray-400">{release_date}</p>
        </div>
      )}
    </div>

    {/* Media Type Badge */}
    <span className="absolute top-1 right-1 bg-teal-600 text-white text-[7px] sm:text-[8px] md:text-[10px] font-semibold px-1.5 py-0.5 rounded-full uppercase shadow-md">
      {media_type}
    </span>
  </div>
);

};

export default UpcomingCard;
