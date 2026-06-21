import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { getFullImageUrl, getSportsImageUrl } from '../../config/sportsApi';
import LiveBadge from './LiveBadge';
import { IconSports, IconEye, IconStar } from './SportsIcons';

const SportsCard = ({ match, layout = 'row' }) => {
  const [imageError, setImageError] = useState(false);
  const isLive = match?.status === 1;

  // Format time (assuming match.date is a timestamp or date string)
  const startTime = match?.date ? new Date(match.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';
  const startDate = match?.date ? new Date(match.date).toLocaleDateString([], { month: 'short', day: 'numeric' }) : '';

  // Use poster from stream.pk or fallback to a gradient
  const posterUrl = match.poster ? getFullImageUrl(match.poster) : !imageError && match?.teams?.home?.badge && match?.teams?.away?.badge 
    ? getSportsImageUrl.poster(match.teams.home.badge, match.teams.away.badge)
    : null;

  // Determine classes based on layout
  const widthClasses = layout === 'grid' 
    ? 'w-full' 
    : 'flex-none w-[160px] sm:w-[200px] md:w-[240px] lg:w-[260px] xl:w-[280px]';

  return (
    <Link 
      to={`/sports/watch/${match?.id}`}
      className={`group flex flex-col gap-3 ${widthClasses} focus:outline-none focus:ring-2 focus:ring-teal-500 rounded-xl`}
    >
      {/* Background Image Container */}
      <div className="relative aspect-video bg-[#2c2f33] rounded-xl overflow-hidden transition-all duration-300 group-hover:scale-105 shadow-md">
        
        {/* Image or Fallback */}
        {posterUrl && !imageError ? (
          <img 
            src={posterUrl} 
            alt={match?.title || 'Match'}
            className="w-full h-full object-cover transition-opacity duration-300"
            onError={() => setImageError(true)}
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center opacity-40 bg-gradient-to-br from-[#1a2f1a] to-[#2a1a1a]">
            <IconSports className="w-12 h-12 text-gray-400 mb-2" />
          </div>
        )}

        {/* Top Badges */}
        <div className="absolute top-2 left-2 flex gap-2">
          {isLive && <LiveBadge />}
        </div>
        
        <div className="absolute top-2 right-2">
          {match?.viewers ? (
            <div className="flex items-center gap-1.5 bg-[#ff5a00] text-white px-2 py-0.5 rounded-full text-xs font-bold shadow-md">
              {match.viewers} <IconEye className="w-3.5 h-3.5" />
            </div>
          ) : (
            <div className="bg-[#eab308] text-white p-1 rounded-full shadow-md flex items-center justify-center">
              <IconStar className="w-3.5 h-3.5" />
            </div>
          )}
        </div>
      </div>

      {/* Text Content */}
      <div className="flex flex-col px-1">
        <h3 className="text-white font-bold text-xs sm:text-sm line-clamp-2 leading-snug group-hover:text-teal-400 transition-colors">
          {match?.title || 'Unknown Match'}
        </h3>
        <p className="text-gray-400 text-[10px] sm:text-xs mt-1 font-medium">
          {match?.category || 'Sport'} | {isLive && startTime ? startTime : (startTime || startDate)}
        </p>
      </div>
    </Link>
  );
};

export default SportsCard;
