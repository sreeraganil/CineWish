import { useNavigate } from "react-router-dom";

const BackHeader = ({ title }) => {
  const navigate = useNavigate();

  return (
    <div className="sticky top-0 left-0 z-80 flex items-center gap-2 p-4 bg-gradient-to-b backdrop-blur-[4px] from-[#0000008d] to-[#00000055] text-white">
      <button
        onClick={() => navigate(-1)}
        className="p-2 rounded-full hover:bg-gray-800 transition flex items-center"
      >
        <span className="material-symbols-outlined text-teal-500">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="24"
            height="24"
            fill="currentColor"
          >
            <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
          </svg>
        </span>
      </button>
      <h2 className="text-lg font-semibold">{title}</h2>
    </div>
  );
};

export default BackHeader;
