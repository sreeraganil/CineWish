export const formatTime = (seconds = 0) => {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
};

export const progressPercent = (p = 0, d = 0) =>
  d ? Math.min(100, Math.floor((p / d) * 100)) : 0;
