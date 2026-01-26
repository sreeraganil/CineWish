import { Link, NavLink } from "react-router-dom";
import userStore from "../store/userStore";
// import SnowFall from "./events/christmas/SnowFall";

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
      <header className="bg-gray-900 text-white border-b border-gray-800 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
          <div className="relative flex items-center gap-2">
            <img className="h-10" src="/logo/logo.png" alt="logo" />
            <h1 className="text-xl font-bold">
              Cine<span className="text-teal-400 relative z-50">Wish</span>
            </h1>
            {/* <SnowFall /> */}
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

          {user ? (
            <Link to="/profile">
              <div className="w-9 h-9 bg-teal-600 text-white rounded-full flex items-center justify-center text-2xl font-semibold uppercase">
                {user.username?.charAt(0)}
              </div>
            </Link>
          ) : (
            <Link
              to="/login"
              className="bg-teal-500 rounded px-4 py-1 font-semibold hover:scale-105 transition duration-300"
            >
              Login
            </Link>
          )}
        </div>
      </header>

      <nav className="fixed bottom-0 left-0 w-full bg-gray-900 border-t border-gray-800 md:hidden flex justify-around items-center py-2 z-[100]">
        <NavLink to="/" className={iconLinkClass}>
          {({ isActive }) => (
            <>
              <span className="material-symbols-outlined">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="24"
                  height="24"
                  fill="currentColor"
                >
                  <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
                </svg>
              </span>
              {!isActive && <p className="text-[10px]">Home</p>}
            </>
          )}
        </NavLink>
        <NavLink to="/wishlist" className={iconLinkClass}>
          {({ isActive }) => (
            <>
              <span className="material-symbols-outlined">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="24"
                  height="24"
                  fill="currentColor"
                >
                  <path d="M14 10H2v2h12v-2zm0-4H2v2h12V6zm4 8v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zM2 16h8v-2H2v2z" />
                </svg>
              </span>
              {!isActive && <p className="text-[10px]">Wishlist</p>}
            </>
          )}
        </NavLink>
        <NavLink to="/watched" className={iconLinkClass}>
          {({ isActive }) => (
            <>
              <span className="material-symbols-outlined">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="24"
                  height="24"
                  fill="currentColor"
                >
                  <path d="M14 10H2v2h12v-2zm0-4H2v2h12V6zM2 16h8v-2H2v2zm19.5-4.5L23 13l-6.99 7-4.51-4.5L13 14l3.01 3 5.49-5.5z" />
                </svg>
              </span>
              {!isActive && <p className="text-[10px]">Watched</p>}
            </>
          )}
        </NavLink>
        <NavLink to="/search" className={iconLinkClass}>
          {({ isActive }) => (
            <>
              <span className="material-symbols-outlined">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="24"
                  height="24"
                  fill="currentColor"
                >
                  <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
                </svg>
              </span>
              {!isActive && <p className="text-[10px]">Search</p>}
            </>
          )}
        </NavLink>
      </nav>
    </>
  );
};

export default Header;
