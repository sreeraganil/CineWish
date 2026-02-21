export function getNextEpisode(meta, season, episode) {
  if (!meta?.seasons?.length) return null;
  if (season == null || episode == null) return null;

  // Normalize + sort seasons once
  const seasons = [...meta.seasons].sort((a, b) => a.season - b.season);

  const currentIndex = seasons.findIndex(s => s.season === season);
  if (currentIndex === -1) return null;

  const current = seasons[currentIndex];

  // Same season next episode
  if (episode < current.episodeCount) {
    return { season, episode: episode + 1 };
  }

  // Next available season (not season+1 assumption)
  const nextSeason = seasons[currentIndex + 1];
  if (nextSeason) {
    return { season: nextSeason.season, episode: 1 };
  }

  return null;
}