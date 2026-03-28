const Loader = () => {
  const movieIcons = [
    "🎬",
    "🍿",
    "🎥",
    "📽️",
    "🎞️",
    "👨‍🎤",
    "👩‍🎤",
    "🦸",
    "🦹‍♂️",
    "👽",
    "🤖",
    "🐉",
  ];

  const duplicatedIcons = [...movieIcons, ...movieIcons];

  return (
    <div className="flex flex-col items-center justify-center h-full text-white p-4 scale-80 md:scale-100">
      <div className="relative w-full max-w-lg h-40 mb-12 overflow-hidden scale-80">
        <div className="absolute top-0 left-0 w-full h-3 bg-gray-700 rounded-t-lg z-10">
          <div className="absolute top-0 left-0 w-200 h-full bg-gray-600 opacity-70 animate-[filmEdgeScroll_4s_linear_infinite]"></div>
        </div>

        <div className="absolute bottom-0 left-0 w-full h-3 bg-gray-700 rounded-b-lg z-10">
          <div className="absolute top-0 left-0 w-200 h-full bg-gray-600 opacity-70 animate-[filmEdgeScroll_4s_linear_infinite]"></div>
        </div>

        <div className="absolute top-0 left-0 h-full w-8 bg-gray-800/90 flex flex-col items-center justify-between py-3 z-20">
          {[...Array(12)].map((_, i) => (
            <div
              key={`left-perf-${i}`}
              className="w-5 h-1.5 bg-gray-900/80 rounded-full"
            ></div>
          ))}
        </div>

        <div className="absolute top-0 right-0 h-full w-8 bg-gray-800/90 flex flex-col items-center justify-between py-3 z-20">
          {[...Array(12)].map((_, i) => (
            <div
              key={`right-perf-${i}`}
              className="w-5 h-1.5 bg-gray-900/80 rounded-full"
            ></div>
          ))}
        </div>

        <div className="absolute inset-0 flex items-center ml-8 mr-8 overflow-hidden">
          <div className="flex space-x-6 animate-[filmScroll_20s_linear_infinite] hover:animation-paused">
            {duplicatedIcons.map((icon, index) => (
              <div
                key={`frame-${index}`}
                className="flex-shrink-0 w-20 h-28 bg-gray-800 rounded-md shadow-lg overflow-hidden relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-teal-400/10 via-purple-500/10 to-pink-500/10 animate-pulse"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-3xl">
                  {icon}
                </div>

                <div className="absolute bottom-1 right-1 text-xs text-gray-500 font-mono">
                  {(index % movieIcons.length) + 1}
                </div>

                <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
};

export default Loader;





export const LogoLoader = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[300px]">
      <div className="relative w-32 h-32 flex items-center justify-center">
        
        {/* Subtle background ambient glow */}
        <div className="absolute inset-0 bg-teal-500/10 rounded-full blur-2xl animate-pulse"></div>

        {/* User's Custom SVG Logo */}
        <svg 
          className="w-[70px] h-[70px] drop-shadow-[0_0_15px_rgba(45,212,191,0.2)] relative z-10" 
          viewBox="0 0 100 100" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="cwOuter" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%"   stopColor="#2dd4bf" />
              <stop offset="50%"  stopColor="#14b8a6" />
              <stop offset="100%" stopColor="#0d6e65" />
            </linearGradient>
            <linearGradient id="cwPlay" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%"   stopColor="#5eead4" />
              <stop offset="100%" stopColor="#0d9488" />
            </linearGradient>
            <mask id="cwMask">
              <circle cx="50" cy="50" r="47" fill="white" />
              {/* INCREASED r to 40 and DECREASED cx to 58 to thin out the middle body */}
              <circle cx="60" cy="50" r="38" fill="black" />
            </mask>
          </defs>

          {/* Orbiting Crescent Group */}
          <g className="origin-center animate-[spin_2s_cubic-bezier(0.4,0,0.2,1)_infinite]">
            <circle cx="50" cy="50" r="47" fill="url(#cwOuter)" mask="url(#cwMask)" />
            {/* UPDATED inner shadow stroke to perfectly match the new mask dimensions */}
            <circle cx="60" cy="50" r="38" fill="none" stroke="rgba(0,0,0,0.3)" strokeWidth="2.5" mask="url(#cwMask)" />
          </g>

          {/* Centered Play Button */}
          <path 
            d="M 41 33 L 41 67 L 71 50 Z" 
            fill="url(#cwPlay)" 
            className="origin-center animate-pulse scale-95"
          />
        </svg>
      </div>
    </div>
  );
};
