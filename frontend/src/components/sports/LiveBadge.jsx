import React from 'react';

const LiveBadge = ({ className = "" }) => {
  return (
    <div className={`bg-red-500 text-white px-2 py-0.5 rounded-md text-xs font-bold uppercase tracking-wider shadow-md ${className}`}>
      LIVE
    </div>
  );
};

export default LiveBadge;
