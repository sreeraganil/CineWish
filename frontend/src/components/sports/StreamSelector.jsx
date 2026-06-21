import React from 'react';
import { IconEye, IconGlobe, IconCheck, IconStar } from './SportsIcons';

const sourceInfo = {
  admin: { name: 'Admin', desc: 'Official & Primary Source' },
  delta: { name: 'Delta', desc: 'Okayish backup' },
  golf: { name: 'Golf', desc: 'Third party (more ads), but very stable' },
  echo: { name: 'Echo', desc: 'Great quality overall' },
};

const StreamSelector = ({ sourceGroups, selectedStream, onSelectStream }) => {
  if (!sourceGroups || sourceGroups.length === 0) {
    return (
      <div className="bg-gray-900/50 border border-gray-800 p-4 rounded-xl mb-6">
        <p className="text-gray-400 text-center">No streams available for this match.</p>
      </div>
    );
  }

  // Helper to generate a consistent fake view count using a string hash
  const getViews = (strId) => {
    let hash = 0;
    const str = strId?.toString() || '1';
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return Math.floor(Math.abs(Math.sin(hash) * 5000)) + 100;
  };

  return (
    <div className="flex flex-col gap-4 pb-2">
      {sourceGroups.map((group, groupIndex) => {
        const sourceName = group.sourceName || 'unknown';
        const info = sourceInfo[sourceName.toLowerCase()] || {
          name: sourceName.charAt(0).toUpperCase() + sourceName.slice(1),
          desc: 'Alternative source'
        };

        return (
          <div key={`source-${sourceName}-${groupIndex}`} className="bg-[#0A0A0A] border border-[#222] rounded-xl overflow-hidden flex flex-col shadow-lg shadow-black/50">
            {/* Source Header */}
            <div className="flex items-center justify-between p-3 border-b border-[#222]">
              <div className="min-w-0 pr-3">
                <h3 className="text-white font-bold text-lg truncate">{info.name}</h3>
                <div className="flex items-center gap-1.5 text-yellow-500 text-xs font-medium">
                  <IconStar className="w-3.5 h-3.5 flex-shrink-0" />
                  <span className="truncate">{info.desc}</span>
                </div>
              </div>
              <div className="bg-gray-900 border border-gray-800 text-teal-500 text-xs font-bold px-3 py-1.5 rounded-full flex-shrink-0">
                {group.streams.length} streams
              </div>
            </div>

            {/* Streams List */}
            <div className="flex flex-col gap-[1px] bg-[#222]">
              {group.streams.map((stream, index) => {
                // Ensure a unique identifier since stream.id might be undefined
                const uniqueStreamId = stream.id ? `${sourceName}-${stream.id}` : `${sourceName}-stream-${index}`;
                
                // Compare by sourceName and index since they are now attached to every stream object
                const isSelected = selectedStream?.sourceName === sourceName && selectedStream?.index === index;
                
                const isHD = stream.hd || stream.quality?.toLowerCase().includes('hd');
                
                return (
                  <button
                    key={uniqueStreamId}
                    onClick={() => onSelectStream(stream)}
                    className={`w-full flex items-center justify-between p-3 transition-colors cursor-pointer relative ${
                      isSelected
                        ? 'bg-[#151515] border-l-2 border-l-teal-500'
                        : 'bg-[#0A0A0A] hover:bg-[#111] border-l-2 border-l-transparent'
                    }`}
                  >
                    {/* Left Side: Quality Badge & Name */}
                    <div className="flex items-center gap-3 min-w-0 pr-2">
                      <span className={`text-[10px] sm:text-xs font-bold px-1.5 py-0.5 rounded flex-shrink-0 ${
                        isHD 
                          ? 'bg-red-900/40 text-red-500'
                          : 'bg-gray-800 text-gray-400'
                      }`}>
                        {stream.quality || (isHD ? 'HD' : 'SD')}
                      </span>
                      
                      <div className="flex items-center min-w-0">
                        <span className={`font-semibold text-sm sm:text-base truncate ${isSelected ? 'text-white' : 'text-gray-300'}`}>
                          Stream {index + 1}
                        </span>
                        {isSelected && (
                          <span className="text-teal-500 text-[10px] sm:text-xs font-medium ml-1.5 sm:ml-2 flex items-center gap-0.5 sm:gap-1 flex-shrink-0">
                            <IconCheck className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> Current
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Right Side: Views & Language */}
                    <div className="flex items-center gap-3 sm:gap-4 text-xs sm:text-sm flex-shrink-0">
                      <div className="flex items-center gap-1 sm:gap-1.5 text-gray-400">
                        <IconEye className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isSelected ? 'text-teal-500/80' : 'text-gray-600'}`} />
                        <span className={isSelected ? 'text-teal-500/80' : 'text-gray-500'}>
                          {stream.viewers || getViews(`${sourceName}-${stream.id || index}`)}
                        </span>
                      </div>
                      
                      <div className="items-center gap-1.5 text-gray-300 hidden sm:flex max-w-[150px]">
                        <IconGlobe className="w-4 h-4 flex-shrink-0 text-gray-500" />
                        <span className="truncate">{stream.language || 'English'} {stream.channel ? `- ${stream.channel}` : ''}</span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StreamSelector;
