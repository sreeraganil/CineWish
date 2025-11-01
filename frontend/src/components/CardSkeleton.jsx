const CardSkeleton = () => {
  return (
    <div className="min-w-[160px] my-1 relative bg-gray-900 rounded-xl border border-gray-800 overflow-hidden shadow animate-pulse">
      <div className="h-48 w-full bg-gray-800"></div>


      <div className="p-3 space-y-2">
        <div className="h-4 bg-gray-700 rounded w-3/4"></div>
        <div className="h-3 bg-gray-700 rounded w-1/2"></div>
        {/* <div className="h-3 bg-gray-700 rounded w-1/3 mt-3"></div> */}
      </div>

      <div className="absolute top-2 right-2 h-4 w-12 bg-gray-700 rounded-full"></div>
    </div>
  );
};

export default CardSkeleton;
