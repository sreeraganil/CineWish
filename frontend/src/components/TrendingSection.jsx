import { useRef } from 'react';
import TrendingCard from './TrendingCard';
import userStore from '../store/userStore';
import { useEffect } from 'react';


const TrendingSection = () => {
  const scrollRef = useRef(null);
  const { trending, fetchTrending } = userStore();

  useEffect(() => {
    trending?.length == 0 && fetchTrending();
  }, []);

  const scroll = (direction) => {
    const { current } = scrollRef;
    if (current) {
      const scrollAmount = direction * current.offsetWidth - 250;
      current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  if(trending?.length == 0)
    return null

  return (
    <section className="bg-gray-950 py-8 px-4 text-white relative">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold mb-4 text-teal-400">Trending Now</h2>

        <div className="relative">
          <button
            onClick={() => scroll(-1)}
            className="hidden absolute sm:flex justify-center items-center left-0 top-1/2 transform -translate-y-1/2 z-10 bg-teal-500 bg-opacity-75 hover:bg-opacity-100 hover:scale-105 transition p-2 rounded-full"
          >
            <span className="material-symbols-outlined">chevron_left</span>
          </button>

          <button
            onClick={() => scroll(1)}
            className="hidden absolute sm:flex justify-center items-center right-0 top-1/2 transform -translate-y-1/2 z-10 bg-teal-500 bg-opacity-75 hover:bg-opacity-100 hover:scale-105 transition p-2 rounded-full"
          >
            <span className="material-symbols-outlined">chevron_right</span>
          </button>

          <div
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth px-2 md:px-5"
          >
            {trending?.map((item) => (
              <TrendingCard key={item.id} {...item} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrendingSection;
