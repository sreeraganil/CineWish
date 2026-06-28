import { useNavigate } from "react-router-dom";

const BackHeader = ({ title, children }) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (window.history.state && window.history.state.idx > 0) {
      navigate(-1);
    } else {
      navigate("/", { replace: true });
    }
  };

  return (
    <div className="sticky top-0 left-0 z-80 flex items-center justify-between p-3 md:p-4 bg-gradient-to-b md:backdrop-blur-[6px] from-[#000000cc] to-[#00000044] text-white">
      <div className="flex items-center gap-2 overflow-hidden mr-2">
        <button
          onClick={handleBack}
          className="p-2 rounded-full hover:bg-gray-800/80 transition flex items-center shrink-0 cursor-pointer"
          title="Go back"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="24"
            height="24"
            fill="currentColor"
            className="text-teal-500"
          >
            <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
          </svg>
        </button>

        <h2 className="text-base md:text-lg font-semibold truncate">{title}</h2>
      </div>

      {children && <div className="flex items-center gap-2 shrink-0">{children}</div>}
    </div>
  );
};

export default BackHeader;
