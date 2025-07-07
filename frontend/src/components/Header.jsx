import { Link, NavLink } from "react-router-dom";
import userStore from "../store/userStore";

const Header = () => {
  const { user } = userStore();
  const linkClass = ({ isActive }) =>
    isActive
      ? "text-teal-400 underline underline-offset-4"
      : "hover:text-teal-400 transition";

  const iconLinkClass = ({ isActive }) =>
    isActive
      ? "text-teal-400 flex flex-col items-center justify-center p-2 rounded-full bg-gray-800"
      : "hover:text-teal-400 transition flex flex-col items-center justify-center p-2";

  return (
    <>
      <header className="bg-gray-900 text-white border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <img className="h-10" src="/logo/logo.png" alt="logo" />
            <h1 className="text-xl font-bold">
              Cine<span className="text-teal-400">Wish</span>
            </h1>
          </div>

          <nav className="hidden md:flex gap-6 text-sm font-medium">
            <NavLink to="/" className={linkClass}>
              Home
            </NavLink>
            <NavLink to="/wishlist" className={linkClass}>
              Wishlist
            </NavLink>
            <NavLink to="/watched" className={linkClass}>
              Watched
            </NavLink>
            <NavLink to="/search" className={linkClass}>
              Search
            </NavLink>
          </nav>

          {user ? <Link to="/profile">
            <div className="w-9 h-9 bg-teal-600 text-white rounded-full flex items-center justify-center text-2xl font-semibold uppercase">
              {user.username?.charAt(0)}
            </div>
          </Link> : <button>Login</button>}
        </div>
      </header>

      <nav className="fixed bottom-0 left-0 w-full bg-gray-900 border-t border-gray-800 md:hidden flex justify-around items-center py-2 z-50">
        <NavLink to="/" className={iconLinkClass}>
          {({ isActive }) => (
            <>
              <span className="material-symbols-outlined">home</span>
              {!isActive && <p className="text-[10px]">Home</p>}
            </>
          )}
        </NavLink>
        <NavLink to="/wishlist" className={iconLinkClass}>
          {({ isActive }) => (
            <>
              <span className="material-symbols-outlined">playlist_add</span>
              {!isActive && <p className="text-[10px]">Wishlist</p>}
            </>
          )}
        </NavLink>
        <NavLink to="/watched" className={iconLinkClass}>
         {({ isActive }) => (
            <>
              <span className="material-symbols-outlined">playlist_add_check</span>
              {!isActive && <p className="text-[10px]">Watched</p>}
            </>
          )}
        </NavLink>
        <NavLink to="/search" className={iconLinkClass}>
          {({ isActive }) => (
            <>
              <span className="material-symbols-outlined">search</span>
              {!isActive && <p className="text-[10px]">Search</p>}
            </>
          )}
        </NavLink>
      </nav>
    </>
  );
};

export default Header;
