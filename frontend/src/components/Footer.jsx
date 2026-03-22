const Footer = () => {
  return (
    <footer className="hidden md:block bg-black text-gray-400 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-6 py-12 grid gap-10 sm:grid-cols-2 md:grid-cols-4">

        {/* Brand */}
        <div>
          <h2 className="text-lg font-semibold text-white tracking-wide">
            Cine<span className="text-teal-400">Wish</span>
          </h2>
          <p className="mt-3 text-sm text-gray-500 leading-relaxed">
            Track what you watch. Save what you love. Discover what’s next.
          </p>
        </div>

        {/* Discover */}
        <div>
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Discover
          </h3>
          <ul className="mt-4 space-y-2 text-sm">
            <li><a href="/" className="hover:text-white">Home</a></li>
            <li><a href="/search" className="hover:text-white">Search</a></li>
            <li><a href="/genre/28" className="hover:text-white">Genres</a></li>
            <li><a href="/collection/10" className="hover:text-white">Collections</a></li>
          </ul>
        </div>

        {/* Library */}
        <div>
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Library
          </h3>
          <ul className="mt-4 space-y-2 text-sm">
            <li><a href="/wishlist" className="hover:text-white">Wishlist</a></li>
            <li><a href="/watched" className="hover:text-white">Watched</a></li>
            <li><a href="/watch/history" className="hover:text-white">History</a></li>
            <li><a href="/profile" className="hover:text-white">Profile</a></li>
          </ul>
        </div>

        {/* Meta */}
        <div>
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            More
          </h3>
          <ul className="mt-4 space-y-2 text-sm">
            <li><a href="/about" className="hover:text-white">About</a></li>
            <li><a href="/contact" className="hover:text-white">Contact</a></li>
            <li><a href="/privacy" className="hover:text-white">Privacy</a></li>
            <li><a href="/terms" className="hover:text-white">Terms</a></li>
          </ul>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col sm:flex-row justify-between items-center text-xs text-gray-600">
          <p>© {new Date().getFullYear()} CineWish</p>
          <p className="mt-2 sm:mt-0">Data powered by TMDB</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;