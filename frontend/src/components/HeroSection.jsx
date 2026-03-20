import { Link } from "react-router-dom";

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-gray-900 via-gray-950 to-gray-950 text-white pt-15 pb-5 px-6">
      {/* Ambient glow background */}
      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_top,rgba(20,184,166,0.3),transparent_50%)]" />

      {/* Subtle grid pattern */}
      <div className="absolute inset-0 opacity-5 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:40px_40px]" />

      <div className="relative max-w-4xl mx-auto text-center">
        {/* Main heading */}
        <h1 className="text-5xl sm:text-6xl font-bold tracking-tight">
          Welcome to{" "}
          <span className="bg-gradient-to-r from-teal-400 via-cyan-400 to-teal-400 bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(20,184,166,0.4)]">
            CineWish
          </span>
        </h1>

        {/* Accent line */}
        <div className="w-20 h-1 bg-gradient-to-r from-teal-400 to-cyan-400 rounded-full mx-auto mt-5" />

        {/* Description */}
        <p className="text-gray-300 text-lg sm:text-xl max-w-2xl mx-auto mt-6 leading-relaxed font-medium">
          Your personal watchlist for movies and series — all in one place.
        </p>

        <p className="text-gray-400 text-base max-w-2xl mx-auto mt-4 leading-relaxed">
          Discover, track, and organize your favorite content. From blockbuster
          movies to binge-worthy series, keep everything you want to watch right
          at your fingertips.
        </p>

        {/* Action buttons */}
        <div className="flex justify-center gap-4 flex-wrap mt-12">
          <Link
            to="/search"
            className="group relative bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-300 shadow-lg shadow-teal-500/30 hover:shadow-teal-400/50 hover:-translate-y-1"
          >
            <span className="relative z-10">Search & Add</span>
            <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-teal-400 to-cyan-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
          </Link>

          <Link
            to="/wishlist"
            className="group relative border-2 border-teal-400/30 bg-gray-800/30 backdrop-blur-sm hover:bg-teal-500/10 hover:border-teal-400/60 text-teal-300 hover:text-teal-200 font-semibold py-3 px-8 rounded-lg transition-all duration-300 hover:-translate-y-1"
          >
            View Wishlist
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
