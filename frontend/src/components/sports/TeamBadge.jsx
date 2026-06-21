import React, { useState } from 'react';
import { getSportsImageUrl } from '../../config/sportsApi';

const TeamBadge = ({ badgeId, name, className = "w-8 h-8" }) => {
  const [error, setError] = useState(false);

  if (!badgeId || error) {
    return (
      <div className={`${className} bg-gray-800 rounded-full flex items-center justify-center text-gray-400 border border-gray-700 shadow-sm`}>
        <span className="text-xs font-bold uppercase">{name?.substring(0, 2) || '?'}</span>
      </div>
    );
  }

  return (
    <div className={`relative ${className} bg-gray-800/50 rounded-full p-0.5 border border-gray-700/50 shadow-sm`}>
      <img 
        src={getSportsImageUrl.badge(badgeId)} 
        alt={name}
        className="w-full h-full object-contain rounded-full"
        onError={() => setError(true)}
        loading="lazy"
      />
    </div>
  );
};

export default TeamBadge;
