import { useRef } from 'react';
import Card from './Card';
import userStore from '../store/userStore';
import { useEffect } from 'react';
import CardSkeleton from './CardSkeleton';
import SectionSkeleton from './SectionSkeleton';


const OTTSection = () => {
  const scrollRef = useRef(null);
  const { ott, fetchOtt } = userStore();

  useEffect(()=>{
    ott?.length == 0 && fetchOtt();
  },[])

  const scroll = (direction) => {
    const { current } = scrollRef;
    if (current) {
      const scrollAmount = direction * current.offsetWidth - 250;
      current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  if(ott?.length == 0)
    return <SectionSkeleton title='Latest OTT Releases' CardSkeleton={CardSkeleton} />

  return (
    <section className="bg-gray-950 p-4 text-white relative">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold mb-4 text-teal-400">Latest OTT Releases</h2>
        
        <div className="relative group/button">
          <button
            onClick={() => scroll(-1)}
            className="hidden absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-teal-500 bg-opacity-75 hover:bg-opacity-100 hover:scale-105 transition p-2 rounded-full sm:flex items-center justify-center opacity-0 group-hover/button:opacity-100"
          >
            <span className="material-symbols-outlined"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
  <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
</svg></span>
          </button>

          <button
            onClick={() => scroll(1)}
            className="hidden absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-teal-500 bg-opacity-75 hover:bg-opacity-100 hover:scale-105 transition p-2 rounded-full sm:flex items-center justify-center opacity-0 group-hover/button:opacity-100"
          >
           <span className="material-symbols-outlined"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
  <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
</svg></span>
          </button>

          <div
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth px-2 md:px-5"
          >
            {ott?.map((item) => (
              <Card key={item.id} {...item} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default OTTSection;
