import { useRef } from 'react';
import { Link } from "react-router-dom";
import studios from '../utilities/studios.json';

const StudiosGrid = () => {
  const scrollRef = useRef(null);

  if (!studios?.length) return null;

  const scroll = (direction) => {
    const { current } = scrollRef;
    if (current) {
      const scrollAmount = direction * current.offsetWidth - 250;
      current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section className="bg-gray-950 text-white py-4 relative px-2">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-2xl font-bold text-teal-400">
            Studios
          </h2>
        </div>

        <div className="relative group/button px-2">
          {/* Left Arrow */}
          <button
            onClick={() => scroll(-1)}
            className="hidden absolute left-0 top-1/2 transform -translate-y-1/2 z-40 bg-teal-500 bg-opacity-75 hover:bg-opacity-100 hover:scale-105 transition p-2 rounded-full sm:flex items-center justify-center opacity-0 group-hover/button:opacity-100"
          >
            <span className="material-symbols-outlined">chevron_left</span>
          </button>

          {/* Right Arrow */}
          <button
            onClick={() => scroll(1)}
            className="hidden absolute right-0 top-1/2 transform -translate-y-1/2 z-40 bg-teal-500 bg-opacity-75 hover:bg-opacity-100 hover:scale-105 transition p-2 rounded-full sm:flex items-center justify-center opacity-0 group-hover/button:opacity-100"
          >
            <span className="material-symbols-outlined">chevron_right</span>
          </button>

          {/* Studios Slider */}
          <div
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth px-2 md:px-5 py-2"
          >
            {studios.map((studio) => (
              <Link
                key={studio.id}
                to={`/studio/${studio.id}`}
                className="group/card relative rounded-xl overflow-hidden shadow-md hover:shadow-xl hover:ring-1 hover:ring-teal-500 flex-shrink-0 w-[140px] md:w-[200px] aspect-video transition-all duration-300"
              >
                {/* Gradient Background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${studio.gradient}`} />
                
                {/* Studio Logo */}
                <div className="absolute inset-0 flex items-center justify-center p-4">
                  <img
                    src={studio.card_image}
                    alt={studio.name}
                    className="max-w-full max-h-full object-contain drop-shadow-2xl group-hover/card:scale-110 transition-transform duration-500"
                    loading="lazy"
                  />
                </div>

                {/* Dark Overlay on Hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-300" />

                {/* Studio Name */}
                <div className="relative z-10 h-full flex flex-col justify-end p-4">
                  <h3 className="font-bold text-lg text-white drop-shadow-lg transform translate-y-10 opacity-0 group-hover/card:translate-y-0 group-hover/card:opacity-100 transition-all duration-300 truncate">
                    {studio.name}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default StudiosGrid;