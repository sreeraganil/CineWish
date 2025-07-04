import { Link } from "react-router-dom";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center px-4 text-center">
      <DotLottieReact
        src="/lottie/404.lottie"
        loop
        autoplay
        style={{ width: "clamp(300px, 50vw, 700px)" }}
      />
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
