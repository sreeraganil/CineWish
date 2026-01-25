import { useNavigate } from "react-router-dom";

const RecommendationCard = ({
  id,
  title,
  release_date,
  first_air_date,
  name,
  vote_average,
  backdrop_path,
  media_type,
}) => {
  const navigate = useNavigate();

  const handleClick = (media, id) => {
    navigate(`/details/${media}/${id}`);
  };

  const displayTitle = title || name;
  const year = release_date?.slice(0, 4) || first_air_date?.slice(0, 4);
  const rating = vote_average?.toFixed(1);

  return (
    <div
      onClick={() => handleClick(media_type, id)}
      className="group relative bg-gray-900 rounded-xl overflow-hidden transition-all duration-300 hover:-translate-y-2 border border-gray-800 hover:border-teal-500/50 cursor-pointer"
    >
      {/* Backdrop Container */}
      <div className="relative h-32 sm:h-36 md:h-40 overflow-hidden bg-gray-800">
        <img
          src={
            backdrop_path
              ? `https://image.tmdb.org/t/p/w500${backdrop_path}`
              : "/placeholder.png"
          }
          alt={displayTitle}
          onError={(e) => {
            e.currentTarget.src = "/placeholder.png";
          }}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          loading="lazy"
        />

        {/* Gradient Overlay on Hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Media Badge */}
        <div className="absolute top-2 right-2">
          <span className="bg-teal-500/90 backdrop-blur-sm text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase shadow-lg border border-teal-400/30">
            {media_type}
          </span>
        </div>

        {/* Rating Badge */}
        {rating && parseFloat(rating) > 0 && (
          <div className="absolute top-2 left-2">
            <div className="flex items-center gap-1 bg-black/60 backdrop-blur-sm px-2 py-1 rounded-full">
              <svg className="w-3 h-3 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="text-white text-xs font-semibold">{rating}</span>
            </div>
          </div>
        )}

      </div>

      {/* Info Section */}
      <div className="p-3">
        <h3 className="text-sm font-semibold text-white mb-1 truncate group-hover:text-teal-400 transition-colors">
          {displayTitle}
        </h3>

        <div className="flex items-center text-xs text-gray-400">
          {year && (
            <div className="flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>{year}</span>
            </div>
          )}
        </div>
      </div>

    </div>
  );
};

export default RecommendationCard;