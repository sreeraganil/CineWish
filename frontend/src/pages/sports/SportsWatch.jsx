import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import { sportsApi, getSportsImageUrl } from '../../config/sportsApi';
import useSportsWatchStore from '../../store/sportsWatchStore';
import StreamSelector from '../../components/sports/StreamSelector';
import { IconBack, IconVideoOff } from '../../components/sports/SportsIcons';

const SportsWatch = () => {
  const { matchId } = useParams();
  const navigate = useNavigate();
  const [match, setMatch] = useState(null);
  const [loadingMatch, setLoadingMatch] = useState(true);
  
  const { sourceGroups, selectedStream, loading: loadingStreams, fetchStreams, setSelectedStream, clearStreams } = useSportsWatchStore();

  useEffect(() => {
    const initWatch = async () => {
      setLoadingMatch(true);
      try {
        const matchData = await sportsApi.getMatchById(matchId);
        setMatch(matchData);
        if (matchData) {
           document.title = `Watching: ${matchData.title} - CineWish Sports`;
           // Assuming match has sources array with 'source' and 'id'
           if (matchData.sources && matchData.sources.length > 0) {
              await fetchStreams(matchData.sources);
           }
        }
      } catch (error) {
        console.error("Error initializing watch:", error);
      } finally {
        setLoadingMatch(false);
      }
    };

    initWatch();

    return () => {
      clearStreams();
    };
  }, [matchId, fetchStreams, clearStreams]);

  const getPosterUrl = () => {
    if (!match) return null;
    if (match.poster) {
       return `https://streamed.pk${match.poster}`;
    }
    if (match.teams?.home?.badge && match.teams?.away?.badge) {
       return getSportsImageUrl.poster(match.teams.home.badge, match.teams.away.badge);
    }
    return null;
  };

  const posterBg = getPosterUrl();

  return (
    <div className="min-h-screen bg-black text-white pb-20 md:pb-0 flex flex-col overflow-x-hidden">
      <Header />
      
      {/* Content wrapper taking exactly the remaining viewport height on desktop */}
      <div className="flex flex-col lg:h-[calc(100vh-64px)] w-full">
        
        {/* Top Header Row */}
        <div className="w-full max-w-8xl mx-auto px-4 pt-4 md:pt-6 flex-shrink-0">
          <div className="flex items-center gap-4 mb-4">
            <button 
              onClick={() => navigate('/sports')}
              className="bg-gray-800 hover:bg-gray-700 text-white p-2 rounded-full transition flex items-center justify-center border border-gray-700 cursor-pointer"
            >
              <IconBack className="w-5 h-5 pointer-events-none" />
            </button>
            <h1 className="text-xl md:text-2xl font-bold text-white line-clamp-1">{match?.title || 'Watch Stream'}</h1>
          </div>
        </div>
        
        <div className="flex-1 w-full max-w-8xl mx-auto flex flex-col lg:flex-row gap-6 p-4 pt-0 min-h-0">
          
          {/* Main Player Area (Left) */}
          <div className="flex-[3] flex flex-col min-h-0">
           {/* Player Container */}
           <div className="w-full aspect-video bg-gray-950 rounded-xl overflow-hidden shadow-2xl border border-gray-800 relative">
              {/* Background Poster (Only visible when loading or no stream) */}
              {(!selectedStream || loadingMatch || loadingStreams) && posterBg && (
                 <div className="absolute inset-0 opacity-20">
                    <img src={posterBg} alt="Match Poster" className="w-full h-full object-cover blur-sm" />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-transparent to-gray-950/50"></div>
                 </div>
              )}

              {loadingMatch || loadingStreams ? (
                 <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 z-10">
                    <div className="w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-gray-300 font-medium tracking-wide">Loading stream...</p>
                 </div>
              ) : selectedStream ? (
                 <iframe
                    src={selectedStream.url || selectedStream.embedUrl}
                    title={match?.title}
                    className="w-full h-full relative z-10"
                    allowFullScreen
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                 ></iframe>
              ) : (
                 <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-center p-6 z-10">
                    <div className="bg-gray-900/80 p-4 rounded-full border border-gray-800">
                      <IconVideoOff className="w-10 h-10 text-gray-500" />
                    </div>
                    <p className="text-xl font-bold text-gray-200">No stream available</p>
                    <p className="text-gray-400 max-w-sm">We couldn't find a working stream for this match right now.</p>
                 </div>
              )}
           </div>
          </div>

          {/* Info & Selector Area (Right) */}
          <div className="flex-[1] flex flex-col gap-4 w-full lg:min-w-[320px] lg:max-w-[400px] lg:overflow-y-auto scrollbar-hide pb-4">
             
             {/* Match Info */}
             {match && (
                <div className="bg-gray-900 p-4 md:p-5 rounded-xl border border-gray-800">
                   <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                      {match.status === 1 && <span className="bg-red-600/20 text-red-500 px-2 py-0.5 rounded font-bold uppercase text-xs">Live</span>}
                      <span className="capitalize">{match.category}</span>
                      <span>•</span>
                      <span>{new Date(match.date).toLocaleDateString()}</span>
                   </div>
                   <p className="text-gray-300 text-sm">
                      {match.description || `Watching ${match.teams?.home?.name || 'Home'} vs ${match.teams?.away?.name || 'Away'}`}
                   </p>
                </div>
             )}

             {/* Stream Selector */}
             {!loadingMatch && sourceGroups && sourceGroups.length > 0 && (
                <StreamSelector 
                   sourceGroups={sourceGroups}
                   selectedStream={selectedStream}
                   onSelectStream={setSelectedStream}
                />
             )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SportsWatch;
