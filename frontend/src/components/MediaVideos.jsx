import React, { useMemo } from "react";

const MediaVideos = ({ data }) => {
  const videos = data?.videos?.results || [];

  const filteredVideos = useMemo(() => {
    if (!videos.length) return [];

    // Priority sorting
    const priority = { Trailer: 1, Teaser: 2 };

    return videos
      .filter((v) => v.site === "YouTube") // only playable
      .sort((a, b) => {
        const pa = priority[a.type] || 3;
        const pb = priority[b.type] || 3;
        return pa - pb;
      })
      .slice(0, 4); // limit (optional)
  }, [videos]);

  if (!filteredVideos.length) return null;

  return (
    <section className="px-4 max-w-8xl mx-auto">
      <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-teal-400">
        Videos
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredVideos.map((video) => (
          <div
            key={video.id}
            className="group relative rounded-2xl overflow-hidden bg-white/5 backdrop-blur-md border border-white/10 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
          >
            {/* Video */}
            <div className="aspect-video w-full overflow-hidden">
              <iframe
                src={`https://www.youtube.com/embed/${video.key}?controls=1&modestbranding=1&rel=0`}
                title={video.name}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>

            {/* Gradient overlay for readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent pointer-events-none"></div>

            {/* Title */}
            <div className="absolute bottom-0 p-4">
              <p className="text-sm font-medium text-white line-clamp-2">
                {video.name}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default MediaVideos;
