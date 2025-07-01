import { useRef } from 'react';
import UpcomingCard from './UpcomingCard';
import userStore from '../store/userStore';
import { useEffect } from 'react';

const upcomingData = [
  {
    title: 'Superman',
    releaseDate: '2025-07-11',
    poster: 'https://m.media-amazon.com/images/M/MV5BMDI0ZjJiNGEtNmRhZS00ODQ4LTk4Y2ItOGNiYjQxMTNlNjNlXkEyXkFqcGc@._V1_.jpg',
  },
  {
    title: 'M3GAN 2.0',
    releaseDate: '2025-06-27',
    poster: 'https://m.media-amazon.com/images/M/MV5BOWM0NjdkYTUtZTc3Yy00ZmFmLWEwOTQtYTBlM2QzZTE3ODIxXkEyXkFqcGc@._V1_.jpg',
  },
  {
    title: 'Jurassic World: New Era',
    releaseDate: '2025-07-02',
    poster: 'https://m.media-amazon.com/images/M/MV5BNDU2ODUzZWItMGNhMS00YjAxLWE5ZGMtYWU1Nzk1MjMzZjlmXkEyXkFqcGc@._V1_.jpg',
  },
  {
    title: 'The Fantastic Four',
    releaseDate: '2025-07-25',
    poster: 'https://m.media-amazon.com/images/M/MV5BY2U5MjM2MWEtYTU2ZC00YjkyLWE2ZTctYzI1ZDI3Y2IzNGVkXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg',
  },
  {
    title: 'Elio',
    releaseDate: '2025-06-13',
    poster: 'https://m.media-amazon.com/images/M/MV5BOWE5ZDMyMWEtOTZjMi00YzFhLWE4OTEtNDc3MDMzZjFmMmIzXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg',
  },
  {
    title: 'The Bad Guys 2',
    releaseDate: '2025-08-01',
    poster: 'https://m.media-amazon.com/images/M/MV5BY2YwODhmODctMjE2OS00Y2EyLWEyZTEtOGU3ODk5MGIzYmU1XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg',
  },
  {
    title: '28 Years Later',
    releaseDate: '2025-06-20',
    poster: 'https://m.media-amazon.com/images/M/MV5BN2FjMjU2YjMtZjAyNS00YzM1LWE0MmMtMWE0OGY4MjVkMWYyXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg',
  },
  {
    title: 'How to Train Your Dragon',
    releaseDate: '2025-06-13',
    poster: 'https://m.media-amazon.com/images/M/MV5BMjA5NDQyMjc2NF5BMl5BanBnXkFtZTcwMjg5ODcyMw@@._V1_.jpg',
  }
];

const UpcomingSection = () => {
  const scrollRef = useRef(null);
  const { upcoming, fetchUpcoming } = userStore();

  useEffect(()=>{
    upcoming?.length == 0 && fetchUpcoming();
  },[])

  const scroll = (direction) => {
    const { current } = scrollRef;
    if (current) {
      const scrollAmount = direction * current.offsetWidth - 250;
      current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section className="bg-gray-950 py-8 px-4 text-white relative">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold mb-4 text-teal-400">Upcoming Releases</h2>
        
        <div className="relative">
          <button
            onClick={() => scroll(-1)}
            className="hidden absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-teal-500 bg-opacity-75 hover:bg-opacity-100 hover:scale-105 transition p-2 rounded-full sm:flex items-center justify-center"
          >
            <span className="material-symbols-outlined">chevron_left</span>
          </button>

          <button
            onClick={() => scroll(1)}
            className="hidden absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-teal-500 bg-opacity-75 hover:bg-opacity-100 hover:scale-105 transition p-2 rounded-full sm:flex items-center justify-center"
          >
           <span className="material-symbols-outlined">chevron_right</span>
          </button>

          <div
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth px-2 md:px-5"
          >
            {upcoming?.map((item) => (
              <UpcomingCard key={item.id} {...item} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default UpcomingSection;
