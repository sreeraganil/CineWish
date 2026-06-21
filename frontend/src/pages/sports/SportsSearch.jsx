import React, { useEffect, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import SportsCard from '../../components/sports/SportsCard';
import useSportsSearchStore from '../../store/sportsSearchStore';
import { IconBack, IconSearch, IconClose, IconSearchOff, IconSports } from '../../components/sports/SportsIcons';

const SportsSearch = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const initialQuery = searchParams.get('q') || '';
  
  const { query, results, loading, error, setQuery, search, clearSearch } = useSportsSearchStore();

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (query) {
        setSearchParams({ q: query }, { replace: true });
        search(query);
      } else {
        setSearchParams({});
        clearSearch();
      }
    }, 500); // 500ms debounce

    return () => clearTimeout(timer);
  }, [query, search, clearSearch, setSearchParams]);

  // Initial load from URL
  useEffect(() => {
    if (initialQuery && initialQuery !== query) {
      setQuery(initialQuery);
    }
  }, []);

  return (
    <div className="min-h-screen bg-black text-white pb-20 md:pb-0">
      <Header />
      
      <div className="max-w-8xl mx-auto px-4 py-6 md:py-8">
        
        {/* Search Bar */}
        <div className="relative mb-8 max-w-2xl mx-auto flex items-center gap-3">
          <button 
            onClick={() => navigate(-1)}
            className="bg-gray-800 hover:bg-gray-700 text-white p-2 rounded-full transition flex items-center justify-center border border-gray-700 flex-shrink-0 cursor-pointer"
          >
            <IconBack className="w-5 h-5 pointer-events-none" />
          </button>
          
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <IconSearch className="w-4 h-4 text-gray-400" />
            </div>
            <input
              type="text"
              className="w-full bg-gray-900 border border-gray-700 text-white rounded-full py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-base shadow-lg"
              placeholder="Search teams, sports, or matches..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            {query && (
              <button 
                onClick={() => setQuery('')}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-white"
              >
                <IconClose className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Results */}
        {loading ? (
           <div className="flex justify-center py-20">
              <div className="w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
           </div>
        ) : error ? (
           <div className="text-center text-red-500 py-10">{error}</div>
        ) : query && results.length === 0 ? (
           <div className="text-center py-16 bg-gray-900 rounded-2xl border border-gray-800 flex flex-col items-center">
             <IconSearchOff className="w-12 h-12 text-gray-600 mb-4" />
             <h2 className="text-xl font-bold text-gray-400">No matches found for "{query}"</h2>
             <p className="text-gray-500 mt-2 text-sm">Try searching for a different team or sport.</p>
           </div>
        ) : results.length > 0 ? (
           <div>
             <h2 className="text-lg font-bold mb-4 text-gray-300">Search Results ({results.length})</h2>
             <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8 gap-4 md:gap-6">
               {results.map(match => (
                 <div key={match?.id || Math.random()} className="w-full">
                   <SportsCard match={match} layout="grid" />
                 </div>
               ))}
             </div>
           </div>
        ) : (
           <div className="text-center py-20 opacity-50 flex flex-col items-center">
              <IconSports className="w-12 h-12 mb-4 text-gray-500" />
              <p className="text-lg">Discover live sports and upcoming matches</p>
           </div>
        )}

      </div>
    </div>
  );
};

export default SportsSearch;
