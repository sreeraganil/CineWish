// pages/LoginRequired.jsx
import { Link } from "react-router-dom";

const LoginRequired = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-teal-900 to-black text-white flex flex-col items-center justify-center px-4 text-center animate-bg">
      <div className="max-w-md w-full bg-gray-900 rounded-lg p-8 shadow-2xl border border-gray-800">
        <div className="mb-6">
          <div className="w-16 h-16 bg-teal-900 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-teal-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold mb-2 text-teal-400">Login Required</h1>
          <p className="text-gray-400 mb-6">
            You need to be logged in to view your wishlist or watched list.
          </p>
        </div>
        
        <div className="flex flex-col space-y-4">
          <Link
            to="/login"
            className="px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-medium transition duration-200 transform hover:scale-105"
          >
            Go to Login
          </Link>
          <Link
            to="/"
            className="px-6 py-3 text-gray-400 hover:text-white rounded-lg font-medium transition duration-200 border border-gray-700 hover:border-gray-600"
          >
            Back to Home
          </Link>
        </div>
        
        <p className="text-gray-500 text-sm mt-6">
          Don't have an account?{' '}
          <Link to="/register" className="text-teal-400 hover:text-teal-300 underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginRequired;