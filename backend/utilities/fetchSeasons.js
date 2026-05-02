export const fetchSeasonsFromTMDB = async (mediaId) => {
  const res = await fetch(
    `https://api.themoviedb.org/3/tv/${mediaId}?api_key=${process.env.TMDB_KEY}`
  );

  if (!res.ok) throw new Error(`TMDB fetch failed for mediaId ${mediaId}: ${res.status}`);

  const data = await res.json();

  return data.seasons
    .filter((s) => s.season_number > 0)
    .map((s) => ({
      season: s.season_number,
      episodeCount: s.episode_count,
    }));
};