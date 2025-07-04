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
    <div className="flex flex-col items-center justify-center h-full text-white p-4">
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

      {/* <div className="text-center max-w-md">
        <div className="text-2xl font-bold mb-3 relative inline-block">
          <span className="relative">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-purple-500 animate-textGradient">
              Loading
            </span>
            <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-teal-400 to-purple-500 animate-underlineScale origin-left"></span>
          </span>
        </div>
        <p className="text-gray-400 text-sm animate-pulse">
          {
            [
              "Fetching...",
              "Loading trailers...",
              "Preparing popcorn...",
              "Dimming lights...",
            ][Math.floor(Date.now() / 1000) % 4]
          }
        </p>
      </div> */}

    </div>
  );
};

export default Loader;
