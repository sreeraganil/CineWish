import { Link } from "react-router-dom";

const HeroSection = () => {
  return (
    <section className="bg-gradient-to-b from-gray-800 to-gray-950 text-white py-16 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl sm:text-5xl font-bold mb-4">
          Welcome to <span className="text-teal-400">CineWish</span>
        </h1>
        <p className="text-lg text-gray-400 max-w-xl mx-auto mb-8">
          Your personal movie and series wishlist. Keep track of what you want to watch and what you’ve already enjoyed — all in one place.
        </p>
        <div className="flex justify-center gap-4">
          <Link
            to="/search"
            className="bg-teal-500 hover:bg-teal-600 text-white font-semibold py-3 px-6 rounded-md transition"
          >
            Search & Add
          </Link>
          <Link
            to="/wishlist"
            className="border border-teal-500 hover:bg-teal-500 hover:text-white text-teal-400 font-semibold py-3 px-6 rounded-md transition"
          >
            View Wishlist
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
