import { useNavigate } from "react-router-dom";

const BackHeader = ({ title }) => {
  const navigate = useNavigate();

  return (
    <div className="sticky top-0 left-0 z-80 flex items-center gap-2 p-4 bg-gradient-to-b backdrop-blur-[4px] from-[#0000008d] to-[#00000055] text-white">
      <button
        onClick={() => navigate(-1)}
        className="p-2 rounded-full hover:bg-gray-800 transition flex items-center"
      >
        <span className="material-symbols-outlined text-teal-500">arrow_back</span>
      </button>
      <h2 className="text-lg font-semibold">{title}</h2>
    </div>
  );
};

export default BackHeader;
