import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import SportsCard from '../../components/sports/SportsCard';
import { sportsApi } from '../../config/sportsApi';
import { IconBack, IconSports } from '../../components/sports/SportsIcons';

const SportsCategory = () => {
  const { sport } = useParams();
  const navigate = useNavigate();
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = `${sport.toUpperCase()} - CineWish Sports`;
    const fetchMatches = async () => {
      setLoading(true);
      try {
        let data;
        if (sport === 'live') {
          data = await sportsApi.getLiveMatches();
        } else if (sport === 'today') {
          data = await sportsApi.getTodayMatches();
        } else if (sport === 'popular') {
          data = await sportsApi.getAllPopularMatches();
        } else {
          data = await sportsApi.getMatchesBySport(sport);
        }
        setMatches(data || []);
      } catch (error) {
        console.error(`Error fetching matches for ${sport}:`, error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchMatches();
  }, [sport]);

  return (
    <div className="min-h-screen bg-black text-white pb-20 md:pb-0">
      <Header />
      <div className="max-w-8xl mx-auto px-4 py-6 md:py-8 relative">
        <div className="flex items-center gap-4 mb-6">
          <button 
            onClick={() => navigate(-1)}
            className="bg-gray-800 hover:bg-gray-700 text-white p-2 rounded-full transition flex items-center justify-center border border-gray-700 cursor-pointer"
          >
            <IconBack className="w-5 h-5 pointer-events-none" />
          </button>
          <h1 className="text-2xl md:text-3xl font-bold capitalize text-teal-400 m-0">
            {sport} Matches
          </h1>
        </div>

        {loading ? (
           <div className="flex justify-center items-center h-64">
             <div className="w-10 h-10 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
           </div>
        ) : matches.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8 gap-4 md:gap-6">
            {matches.map(match => (
              <div key={match?.id || Math.random()} className="w-full">
                <SportsCard match={match} layout="grid" />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-gray-900 rounded-xl border border-gray-800">
            <IconSports className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-400">No Matches Found</h2>
            <p className="text-gray-500 mt-2">There are currently no {sport} matches available.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SportsCategory;
