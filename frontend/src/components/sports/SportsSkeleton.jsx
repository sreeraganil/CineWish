import React from 'react';

export const CardSkeleton = () => (
  <div className="flex-none w-[200px] sm:w-[240px] md:w-[280px] lg:w-[320px] aspect-video bg-gray-800 rounded-xl overflow-hidden animate-pulse relative">
    {/* Badges */}
    <div className="absolute top-2 left-2 w-12 h-4 bg-gray-700 rounded"></div>
    <div className="absolute top-2 right-2 w-16 h-4 bg-gray-700 rounded"></div>
    
    {/* Bottom Content */}
    <div className="absolute bottom-3 left-3 right-3 space-y-3">
      {/* Teams vs */}
      <div className="flex items-center justify-between">
        <div className="w-8 h-8 rounded-full bg-gray-700"></div>
        <div className="w-6 h-4 bg-gray-700 rounded"></div>
        <div className="w-8 h-8 rounded-full bg-gray-700"></div>
      </div>
      {/* Title */}
      <div className="w-3/4 h-4 bg-gray-700 rounded"></div>
    </div>
  </div>
);

export const RowSkeleton = ({ title }) => (
  <section className="bg-gray-950 p-2 sm:p-4 text-white">
    <div className="max-w-8xl mx-auto">
      <div className="w-48 h-6 sm:h-8 bg-gray-800 rounded mb-3 sm:mb-4 animate-pulse"></div>
      <div className="flex gap-2 sm:gap-3 md:gap-4 overflow-hidden px-2 sm:px-3 md:px-5 -mx-2 sm:mx-0">
        {[1, 2, 3, 4, 5].map((n) => (
          <CardSkeleton key={n} />
        ))}
      </div>
    </div>
  </section>
);

export const DetailsSkeleton = () => (
  <div className="min-h-screen bg-gray-950 pt-20 animate-pulse">
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="w-full aspect-[21/9] md:aspect-[21/7] bg-gray-800 rounded-2xl mb-8"></div>
      
      {/* Content */}
      <div className="flex flex-col md:flex-row gap-8">
        {/* Left Col - Poster */}
        <div className="w-48 md:w-64 aspect-[2/3] bg-gray-800 rounded-xl hidden md:block"></div>
        
        {/* Right Col - Info */}
        <div className="flex-1 space-y-6">
          <div className="w-3/4 h-10 bg-gray-800 rounded"></div>
          <div className="w-1/4 h-6 bg-gray-800 rounded"></div>
          
          <div className="flex gap-4">
             <div className="w-12 h-12 rounded-full bg-gray-800"></div>
             <div className="w-12 h-12 rounded-full bg-gray-800"></div>
          </div>
          
          <div className="w-40 h-12 bg-gray-800 rounded-lg"></div>
        </div>
      </div>
    </div>
  </div>
);
