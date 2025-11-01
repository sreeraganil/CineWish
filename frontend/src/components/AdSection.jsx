const wallpapers = [
  "https://res.cloudinary.com/daccfo8ad/image/upload/c_limit,h_600,w_600/f_auto,q_auto:low/v1/wallpapers/rrjiumnynjrowieykomk",
  "https://res.cloudinary.com/daccfo8ad/image/upload/c_limit,h_600,w_600/f_auto,q_auto:low/v1/wallpapers/ombsre2i4hs32lq7b4hf",
  "https://res.cloudinary.com/daccfo8ad/image/upload/c_limit,h_600,w_600/f_auto,q_auto:low/v1/wallpapers/jknl8gf4bo6jvfligkbw",
  "https://res.cloudinary.com/daccfo8ad/image/upload/c_limit,h_600,w_600/f_auto,q_auto:low/v1/wallpapers/sn99wwhtstk27eeopvoo",
]

const AdSection = () => {
  return (
    <div className="relative z-90 w-full mt-12 px-4">
      <div className="bg-gradient-to-br from-gray-900 via-gray-950 to-black border border-gray-800 rounded-xl shadow-md p-6 text-center">
        <h2 className="text-xl md:text-2xl font-bold text-white mb-2">
          Need Stunning Wallpapers?
        </h2>
        <p className="text-gray-400 mb-5">
          Explore high-quality wallpapers for your devices on{" "}
          <span className="text-teal-400 font-semibold">WallPortal</span>.
        </p>

        {/* Wallpaper preview grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
          {wallpapers.map((src, idx) => (
            <img
              key={idx}
              src={src}
              alt={`wallpaper-${idx}`}
              className="rounded-lg object-cover h-28 w-full hover:scale-105 transition-transform shadow-md"
            />
          ))}
        </div>

        <a
          href="https://wallportal.onrender.com"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-lg font-medium transition-all shadow-md hover:shadow-teal-500/30"
        >
          Visit WallPortal 🚀
        </a>
      </div>
    </div>
  )
}

export default AdSection
