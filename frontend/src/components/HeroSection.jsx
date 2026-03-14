import { Link } from "react-router-dom";

const HeroSection = () => {
  return (
    <section className="bg-gradient-to-b from-gray-800 to-gray-950 text-white pt-10 pb-2 px-6">
      <div className="max-w-2xl mx-auto text-center">
        <h1 className="text-3xl sm:text-4xl font-bold mb-3">
          Welcome to <span className="text-teal-400">CineWish</span>
        </h1>
        <p className="text-gray-400 text-sm sm:text-base max-w-sm mx-auto mb-6">
          Your personal watchlist for movies and series — all in one place.
        </p>
        <div className="flex justify-center gap-3">
          <Link
            to="/search"
            className="bg-teal-500 hover:bg-teal-600 text-white font-medium py-2 px-5 rounded-md transition text-sm"
          >
            Search & Add
          </Link>
          <Link
            to="/wishlist"
            className="border border-teal-500 hover:bg-teal-500 hover:text-white text-teal-400 font-medium py-2 px-5 rounded-md transition text-sm"
          >
            View Wishlist
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;