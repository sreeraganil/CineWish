import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../config/axios";
import TrendingCard from "../components/TrendingCard";
import BackHeader from "../components/Backheader";

const Collection = () => {
  const { id } = useParams();

  const [collection, setCollection] = useState(null);
  const [error, setError] = useState("");
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    if (!id) return;

    window.scrollTo({ top: 0, behavior: "instant" });

    const fetchCollection = async () => {
      try {
        setError("");

        const { data } = await API.get(`/tmdb/collection/${id}`);

        setCollection(data);
        document.title = `CineWish – ${data.name}`;
      } catch (err) {
        console.error("collection fetch error:", err.message);
        setError("Failed to load collection");
      }
    };

    fetchCollection();
  }, [id]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950 px-4">
        <div className="text-center max-w-md">
          <svg className="w-12 h-12 sm:w-16 sm:h-16 mx-auto text-red-500 mb-3 sm:mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h2 className="text-lg sm:text-xl font-semibold text-white mb-2">Oops!</h2>
          <p className="text-sm sm:text-base text-red-400">{error}</p>
        </div>
      </div>
    );
  }

  const backdropUrl = collection?.backdrop_path
    ? `https://image.tmdb.org/t/p/original${collection?.backdrop_path}`
    : collection?.poster_path
    ? `https://image.tmdb.org/t/p/original${collection?.poster_path}`
    : null;

  // Check if overview is short (less than 150 characters)
  const hasShortOverview = !collection?.overview || collection.overview.length < 150;

  return (
    <>
      <BackHeader title="Collection" />
      <section className="bg-gray-950 text-white min-h-screen">
        {/* Hero Section - Adjusted height based on content */}
        <div className={`relative overflow-hidden ${
          hasShortOverview 
            ? 'h-[40vh] sm:h-[45vh] md:h-[50vh] lg:h-[55vh]' 
            : 'h-[45vh] sm:h-[50vh] md:h-[60vh] lg:h-[65vh]'
        }`}>
          {/* Background with Fallback */}
          {backdropUrl ? (
            <>
              {/* Preload image */}
              <img
                src={backdropUrl}
                alt=""
                className="hidden"
                onLoad={() => setImageLoaded(true)}
                onError={() => setImageLoaded(false)}
              />
              
              {/* Background Image */}
              <div
                className={`absolute inset-0 bg-cover bg-center transition-opacity duration-700 ${
                  imageLoaded ? 'opacity-100' : 'opacity-0'
                }`}
                style={{
                  backgroundImage: `url(${backdropUrl})`,
                  backgroundPosition: 'center 20%',
                }}
              />
            </>
          ) : null}
          
          {/* Fallback Gradient - Teal Theme */}
          <div 
            className={`absolute inset-0 transition-opacity duration-700 ${
              !backdropUrl || !imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            style={{
              background: 'linear-gradient(135deg, #0f766e 0%, #14b8a6 50%, #2dd4bf 100%)'
            }}
          />

          {/* Noise Texture Overlay */}
          <div 
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' /%3E%3C/svg%3E")`,
            }}
          />
          
          {/* Gradient Overlays - Stronger on mobile */}
          <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/85 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-gray-950/98 via-gray-950/60 to-gray-950/80 md:via-gray-950/40 md:to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-gray-950" />

          {/* Animated Glow Effect - Teal */}
          <div className="absolute bottom-0 left-0 right-0 h-16 sm:h-24 bg-gradient-to-t from-teal-500/20 to-transparent blur-xl sm:blur-2xl" />

          {/* Content - Better spacing */}
          <div className="relative h-full w-full px-4 sm:px-6 md:px-8 flex items-end pb-5 sm:pb-8 md:pb-12 lg:pb-16">
            <div className="w-full max-w-7xl mx-auto">
              <div className={`max-w-full sm:max-w-3xl md:max-w-4xl animate-fadeIn ${
                hasShortOverview ? 'space-y-2 sm:space-y-3' : 'space-y-3 sm:space-y-4 md:space-y-5'
              }`}>
                {/* Collection Badge - Teal Theme */}
                <div className="inline-flex items-center gap-1.5 sm:gap-2 bg-gradient-to-r from-teal-500/20 to-cyan-500/20 backdrop-blur-md px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border border-teal-400/30 shadow-lg shadow-teal-500/20">
                  <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-teal-300 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
                  </svg>
                  <span className="text-[11px] sm:text-xs font-semibold text-white tracking-wide">
                    {collection?.parts?.length || 0} {collection?.parts?.length === 1 ? 'Movie' : 'Movies'}
                  </span>
                </div>

                {/* Title - Compact on mobile */}
                <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black leading-[1.1] tracking-tight break-words">
                  <span className="bg-gradient-to-br from-white via-teal-100 to-teal-400 bg-clip-text text-transparent drop-shadow-2xl">
                    {collection?.name}
                  </span>
                </h1>

                {/* Overview - Better height management */}
                {collection?.overview && (
                  <p className="text-xs sm:text-sm md:text-base lg:text-lg text-gray-200 leading-snug sm:leading-relaxed max-w-full sm:max-w-2xl md:max-w-3xl line-clamp-2 md:line-clamp-3 drop-shadow-lg">
                    {collection?.overview}
                  </p>
                )}

                {/* Decorative Line - Teal */}
                <div className="w-12 sm:w-16 md:w-20 h-0.5 bg-gradient-to-r from-teal-500 to-cyan-400 rounded-full" />
              </div>
            </div>
          </div>
        </div>

        {/* Movies Grid Section - Reduced top padding */}
        <div className="relative w-full px-4 sm:px-6 md:px-8 py-6 sm:py-10 md:py-12 lg:py-16">
          <div className="max-w-7xl mx-auto">
            {/* Decorative Background Elements - Teal - Hidden on mobile */}
            <div className="hidden lg:block absolute top-20 right-10 w-72 h-72 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="hidden lg:block absolute bottom-20 left-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

            {/* Section Header - Compact */}
            <div className="relative flex flex-col sm:flex-row sm:items-end sm:justify-between mb-5 sm:mb-6 md:mb-8 pb-3 sm:pb-4 border-b border-gray-800 gap-2 sm:gap-0">
              <div>
                <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-white via-teal-100 to-teal-400 bg-clip-text text-transparent">
                  Complete Collection
                </h2>
                <p className="text-[11px] sm:text-xs md:text-sm text-gray-400 mt-1 flex items-center gap-1.5">
                  <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Sorted by release date
                </p>
              </div>
            </div>

            {/* Movies Grid - Optimized spacing */}
            <div className="relative grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-3 sm:gap-4 md:gap-5">
              {collection?.parts
                ?.sort(
                  (a, b) =>
                    new Date(a.release_date || 0) - new Date(b.release_date || 0),
                )
                .map((movie, index) => (
                  <div
                    key={movie.id}
                    className="group relative transform transition-all duration-500 hover:scale-105 hover:z-10 animate-slideUp"
                    style={{
                      animationDelay: `${index * 40}ms`,
                      animationFillMode: 'backwards'
                    }}
                  >
                    {/* Card Glow on Hover - Teal */}
                    <div className="hidden md:block absolute -inset-1 bg-gradient-to-r from-teal-600 to-cyan-600 rounded-lg opacity-0 group-hover:opacity-20 blur transition duration-500" />
                    
                    <div className="relative">
                      <TrendingCard {...movie} media_type="movie" />
                      
                      {/* Release Year Badge - Compact */}
                      {movie.release_date && (
                        <div className="mt-2 text-center">
                          <span className="inline-flex items-center gap-1 bg-gradient-to-r from-gray-800 to-gray-900 backdrop-blur-sm px-2 sm:px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-semibold text-gray-200 border border-gray-700 shadow-lg">
                            <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-teal-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            {new Date(movie.release_date).getFullYear()}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
            </div>

            {/* Empty State - Compact */}
            {(!collection?.parts || collection?.parts.length === 0) && (
              <div className="text-center py-10 sm:py-12 md:py-16">
                <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gray-800/50 mb-3 sm:mb-4">
                  <svg className="w-7 h-7 sm:w-8 sm:h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
                  </svg>
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-white mb-1.5">No Movies Found</h3>
                <p className="text-xs sm:text-sm text-gray-400">This collection doesn't have any movies yet</p>
              </div>
            )}
          </div>
        </div>
      </section>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(15px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(25px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.7s ease-out;
        }

        .animate-slideUp {
          animation: slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1);
        }

        /* Extra small breakpoint for very small phones */
        @media (min-width: 475px) {
          .xs\:text-3xl {
            font-size: 1.875rem;
          }
          .xs\:grid-cols-3 {
            grid-template-columns: repeat(3, minmax(0, 1fr));
          }
        }
      `}</style>
    </>
  );
};

export default Collection;