const discoverRows = [
  // ===========================
  // 🇮🇳 Indian
  // ===========================
  {
    title: "Top Indian Movies",
    rowKey: "topIndian",
    media: "movie",
    params: {
      with_origin_country: "IN",
      "vote_count.gte": 300,
      "vote_average.gte": 6.8,
      sort_by: "popularity.desc",
    },
  },

  // ===========================
  // ⭐ Top Rated
  // ===========================
  {
    title: "Top Rated",
    rowKey: "topRated",
    media: "movie",
    params: {
      "vote_count.gte": 1000,
      "vote_average.gte": 7.2,
      sort_by: "popularity.desc",
    },
  },

  {
    title: "Top Rated TV",
    rowKey: "topRatedTv",
    media: "tv",
    params: {
      "vote_count.gte": 800,
      "vote_average.gte": 7.0,
      sort_by: "popularity.desc",
    },
  },

  // ===========================
  // 🎭 Mood / Genre
  // ===========================
  {
    title: "Feel Good",
    rowKey: "feelGood",
    media: "movie",
    params: {
      with_genres: "35,10751",
      "vote_count.gte": 300,
      "vote_average.gte": 6.5,
      sort_by: "popularity.desc",
    },
  },

  {
    title: "Edge of Your Seat",
    rowKey: "edgeOfSeat",
    media: "movie",
    params: {
      with_genres: "53,80",
      "vote_count.gte": 300,
      "vote_average.gte": 6.5,
      sort_by: "popularity.desc",
    },
  },

  {
    title: "Escape Reality",
    rowKey: "escapeReality",
    media: "movie",
    params: {
      with_genres: "878,14,12",
      "vote_count.gte": 300,
      "vote_average.gte": 6.5,
      sort_by: "popularity.desc",
    },
  },

  {
    title: "Keep You Up at Night",
    rowKey: "keepUpAtNight",
    media: "movie",
    params: {
      with_genres: "27,53",
      "vote_count.gte": 200,
      "vote_average.gte": 6.3,
      sort_by: "popularity.desc",
    },
  },

  {
    title: "Laugh Out Loud",
    rowKey: "laughOutLoud",
    media: "movie",
    params: {
      with_genres: "35",
      "vote_count.gte": 500,
      "vote_average.gte": 6.8,
      sort_by: "popularity.desc",
    },
  },

  {
    title: "Based on True Stories",
    rowKey: "trueStories",
    media: "movie",
    params: {
      with_genres: "36,18",
      "vote_count.gte": 300,
      "vote_average.gte": 6.8,
      sort_by: "popularity.desc",
    },
  },

  {
    title: "Family Time",
    rowKey: "familyTime",
    media: "movie",
    params: {
      with_genres: "10751,12",
      without_genres: "16",
      "vote_count.gte": 200,
      "vote_average.gte": 6.3,
      sort_by: "popularity.desc",
    },
  },

  {
    title: "Mind Benders",
    rowKey: "mindBenders",
    media: "movie",
    params: {
      with_genres: "878,53",
      "vote_count.gte": 500,
      "vote_average.gte": 7.0,
      sort_by: "popularity.desc",
    },
  },

  // ===========================
  // 🌍 Regional
  // ===========================
  {
    title: "Malayalam Hits",
    rowKey: "malayalam",
    media: "movie",
    params: {
      with_original_language: "ml",
      with_origin_country: "IN",
      "vote_count.gte": 80,
      "vote_average.gte": 6.5,
      sort_by: "popularity.desc",
    },
  },

  {
    title: "Tamil Blockbusters",
    rowKey: "tamil",
    media: "movie",
    params: {
      with_original_language: "ta",
      with_origin_country: "IN",
      "vote_count.gte": 80,
      "vote_average.gte": 6.5,
      sort_by: "popularity.desc",
    },
  },

  {
    title: "Bollywood Hits",
    rowKey: "bollywood",
    media: "movie",
    params: {
      with_original_language: "hi",
      with_origin_country: "IN",
      "vote_count.gte": 80,
      "vote_average.gte": 6.5,
      sort_by: "popularity.desc",
    },
  },

  {
    title: "Telugu Hits",
    rowKey: "telugu",
    media: "movie",
    params: {
      with_original_language: "te",
      with_origin_country: "IN",
      "vote_count.gte": 80,
      "vote_average.gte": 6.5,
      sort_by: "popularity.desc",
    },
  },

  // ===========================
  // 📺 Streaming
  // ===========================
  {
    title: "Netflix",
    rowKey: "netflix",
    media: "movie",
    params: {
      with_watch_providers: 8,
      watch_region: "IN",
      "vote_count.gte": 200,
      "vote_average.gte": 6.5,
      sort_by: "popularity.desc",
    },
  },

  {
    title: "Amazon Prime",
    rowKey: "prime",
    media: "movie",
    params: {
      with_watch_providers: 119,
      watch_region: "IN",
      "vote_count.gte": 200,
      "vote_average.gte": 6.5,
      sort_by: "popularity.desc",
    },
  },
  {
    title: "Critics Love These",
    rowKey: "criticsLove",
    media: "movie",
    params: {
      "vote_average.gte": 7.5,
      "vote_count.gte": 800,
      sort_by: "vote_average.desc",
    },
  },
  {
    title: "Hidden Gems",
    rowKey: "hiddenGems",
    media: "movie",
    params: {
      "vote_average.gte": 7.2,
      "vote_count.gte": 150,
      sort_by: "popularity.asc",
    },
  },

  {
    title: "Global Hits",
    rowKey: "globalHits",
    media: "movie",
    params: {
      without_original_language: "en",
      "vote_count.gte": 300,
      "vote_average.gte": 7.0,
      sort_by: "popularity.desc",
    },
  },

  {
    title: "Kids Picks",
    rowKey: "kids",
    media: "movie",
    params: {
      with_genres: "10751",
      without_genres: "27,53",
      "vote_count.gte": 100,
      sort_by: "popularity.desc",
    },
  },

  {
    title: "Binge-Worthy Series",
    rowKey: "bingeTv",
    media: "tv",
    params: {
      "vote_average.gte": 7.2,
      "vote_count.gte": 500,
      sort_by: "popularity.desc",
    },
  },

  {
    title: "Scariest Right Now",
    rowKey: "scary",
    media: "movie",
    params: {
      with_genres: "27",
      "vote_count.gte": 300,
      "vote_average.gte": 6.5,
      sort_by: "popularity.desc",
    },
  },

  {
    title: "Award Winners",
    rowKey: "awardWinners",
    media: "movie",
    params: {
      "vote_average.gte": 7.4,
      "vote_count.gte": 600,
      sort_by: "popularity.desc",
    },
  },

  {
    title: "Crime Series",
    rowKey: "crimeTv",
    media: "tv",
    params: {
      with_genres: "80",
      "vote_count.gte": 300,
      sort_by: "popularity.desc",
    },
  },
];

export default discoverRows;
