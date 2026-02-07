const CardSkeleton = () => {
  return (
    <div className="min-w-[120px] sm:min-w-[150px] my-1 relative bg-gray-900 rounded-xl border border-gray-800 overflow-hidden shadow animate-pulse">
      {/* Poster */}
      <div className="w-full aspect-[4/5] sm:aspect-[3/4] bg-gray-800" />

      {/* Meta */}
      <div className="p-2 sm:p-3 space-y-1.5 sm:space-y-2">
        <div className="h-3 sm:h-4 bg-gray-700 rounded w-3/4"></div>
        <div className="h-2.5 sm:h-3 bg-gray-700 rounded w-1/2"></div>
      </div>

      {/* Type Badge */}
      <div className="absolute top-1 right-1 h-3 sm:h-4 w-9 sm:w-12 bg-gray-700 rounded-full"></div>
    </div>
  );
};

export default CardSkeleton;
