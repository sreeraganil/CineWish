import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center px-4 text-center">
      <h1 className="text-7xl font-extrabold text-teal-400 mb-4">404</h1>
      <h2 className="text-2xl font-bold mb-2">Page Not Found</h2>
      <p className="text-gray-400 mb-6">
        Oops! The page you’re looking for doesn’t exist.
      </p>
      <Link
        to="/"
        className="bg-teal-500 hover:bg-teal-600 text-white font-semibold py-2 px-6 rounded-md transition"
      >
        Go Home
      </Link>
    </div>
  );
};

export default NotFound;
