import React from 'react';
import { IconDns, IconPlay, IconEye, IconGlobe } from './SportsIcons';

const StreamSelector = ({ streams, selectedStream, onSelectStream }) => {
  if (!streams || streams.length === 0) {
    return (
      <div className="bg-gray-900/50 border border-gray-800 p-4 rounded-xl mb-6">
        <p className="text-gray-400 text-center">No streams available for this match.</p>
      </div>
    );
  }

  // Helper to generate a consistent fake view count if api doesn't provide it
  const getViews = (id) => {
    return Math.floor(Math.abs(Math.sin(id?.toString().charCodeAt(0) || 1) * 5000)) + 100;
  };

  return (
    <div className="flex flex-col gap-2">
      <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2 px-1">
        <IconDns className="w-5 h-5 text-teal-400" />
        Available Streams
      </h3>
      <div className="flex flex-col gap-2 overflow-y-auto scrollbar-hide pb-2">
        {streams.map((stream, index) => {
          const isSelected = selectedStream?.id === stream.id;
          const isHD = stream.quality?.toLowerCase().includes('hd') || index === 0; // fallback to HD for first if unknown
          
          return (
            <button
              key={`${stream.id || 'stream'}-${index}`}
              onClick={() => onSelectStream(stream)}
              className={`w-full flex items-center justify-between p-3 rounded-lg transition-all duration-200 border cursor-pointer ${
                isSelected
                  ? 'bg-teal-900/20 border-teal-500 shadow-sm shadow-teal-500/20'
                  : 'bg-[#111111] border-gray-800 hover:bg-gray-800 hover:border-gray-700'
              }`}
            >
              {/* Left Side: Quality Badge & Name */}
              <div className="flex items-center gap-3">
                <span className={`text-[10px] sm:text-xs font-bold px-2 py-1 rounded ${
                  isHD 
                    ? (isSelected ? 'bg-teal-600 text-white' : 'bg-red-900/80 text-red-400') 
                    : 'bg-gray-800 text-gray-300'
                }`}>
                  {stream.quality || (isHD ? 'HD' : 'SD')}
                </span>
                <span className={`font-semibold text-sm sm:text-base ${isSelected ? 'text-teal-400' : 'text-gray-200'}`}>
                  Stream {index + 1}
                </span>
              </div>

              {/* Right Side: Views & Language */}
              <div className="flex items-center gap-4 text-xs sm:text-sm">
                <div className="flex items-center gap-1.5 text-gray-400">
                  <IconEye className={`w-4 h-4 ${isSelected ? 'text-teal-400' : 'text-teal-500/70'}`} />
                  <span className={isSelected ? 'text-teal-400 font-medium' : 'text-gray-400'}>
                    {stream.views || getViews(stream.id || index)}
                  </span>
                </div>
                
                <div className="flex items-center gap-1.5 text-gray-300 hidden sm:flex">
                  <IconGlobe className="w-4 h-4 text-gray-400" />
                  <span>{stream.language || 'English'} {stream.channel ? `- ${stream.channel}` : ''}</span>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default StreamSelector;
