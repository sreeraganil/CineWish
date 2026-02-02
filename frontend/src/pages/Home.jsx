import { Suspense, lazy, useEffect } from "react";
import Header from "../components/Header";
import HeroSection from "../components/HeroSection";
import GenreRow from "../components/GenreRow";
import StudiosGrid from "../components/StudiosGrid";
import NetWorkGrid from "../components/NetWorkGrid";
import StatsSection from "../components/StatsSection";
import Watching from "../components/watch/Watching";
import RecommendationSection from "../components/RecommendationSection";
import DiscoverRow from "../components/DiscoverRow";
import useHomeRowStore from "../store/homeRowStore";

// Lazy load ONLY below-the-fold sections
const TrendingSection = lazy(() => import("../components/TrendingSection"));
const UpcomingSection = lazy(() => import("../components/UpcomingSection"));
const OTTSection = lazy(() => import("../components/OTTSection"));
const NowPlaying = lazy(() => import("../components/NowPlaying"));

const SectionLoader = () => (
  <div className="h-40 w-full flex items-center justify-center bg-gray-900/50 animate-pulse rounded-xl">
    <div className="w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
  </div>
);

const Home = () => {
  const { clearLastRowScroll, getLastRowScroll } = useHomeRowStore();

  useEffect(() => {
    const last = getLastRowScroll();

    if (last?.top) {
      window.scrollTo({ top: last.top, behavior: "instant" });
      clearLastRowScroll();
    }
  }, []);

  useEffect(() => {
    document.title = "CineWish – Your Personal Movie & Series Tracker";
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-black text-white pb-20 md:pb-0">
      <Header />
      <HeroSection />

      {/* Likely above-the-fold — keep eager */}
      <StatsSection />
      <Watching />
      <RecommendationSection />

      {/* Below-the-fold */}
      <Suspense fallback={<SectionLoader />}>
        <TrendingSection />
        <UpcomingSection />
        <StudiosGrid />
        <OTTSection />
        <NowPlaying />
        <GenreRow />
        <NetWorkGrid />
        <DiscoverRow
          title="Top Indian Movies"
          rowKey="topIndian"
          media="movie"
          params={{
            with_origin_country: "IN",
            sort_by: "popularity.desc",
            vote_count_gte: 200,
          }}
        />

        {/* Top Rated */}
        <DiscoverRow
          title="Top Rated"
          rowKey="topRated"
          media="movie"
          params={{
            sort_by: "vote_average.desc",
            vote_count_gte: 500,
          }}
        />

        <DiscoverRow
          title="Top Rated TV"
          rowKey="topRatedTv"
          media="tv"
          params={{
            sort_by: "vote_average.desc",
            vote_count_gte: 200,
          }}
        />

        {/* Mood / Genre */}
        <DiscoverRow
          title="Feel Good"
          rowKey="feelGood"
          media="movie"
          params={{
            with_genres: "35,10751",
            sort_by: "popularity.desc",
            vote_count_gte: 200,
          }}
        />

        <DiscoverRow
          title="Edge of Your Seat"
          rowKey="edgeOfSeat"
          media="movie"
          params={{
            with_genres: "53,80",
            sort_by: "popularity.desc",
            vote_count_gte: 200,
          }}
        />

        <DiscoverRow
          title="Escape Reality"
          rowKey="escapeReality"
          media="movie"
          params={{
            with_genres: "878,14,12",
            sort_by: "popularity.desc",
            vote_count_gte: 200,
          }}
        />

        <DiscoverRow
          title="Keep You Up at Night"
          rowKey="keepUpAtNight"
          media="movie"
          params={{
            with_genres: "27,53",
            sort_by: "popularity.desc",
            vote_count_gte: 100,
          }}
        />

        <DiscoverRow
          title="Laugh Out Loud"
          rowKey="laughOutLoud"
          media="movie"
          params={{
            with_genres: 35,
            sort_by: "vote_average.desc",
            vote_count_gte: 200,
          }}
        />

        <DiscoverRow
          title="Based on True Stories"
          rowKey="trueStories"
          media="movie"
          params={{
            with_genres: "36,18",
            sort_by: "popularity.desc",
            vote_count_gte: 200,
          }}
        />

        <DiscoverRow
          title="Family Time"
          rowKey="familyTime"
          media="movie"
          params={{
            with_genres: "10751,16,12",
            sort_by: "popularity.desc",
            vote_count_gte: 100,
          }}
        />

        <DiscoverRow
          title="Mind Benders"
          rowKey="mindBenders"
          media="movie"
          params={{
            with_genres: "878,53,878",
            sort_by: "vote_average.desc",
            vote_count_gte: 200,
          }}
        />

        {/* Regional */}
        <DiscoverRow
          title="Malayalam Hits"
          rowKey="malayalam"
          media="movie"
          params={{
            with_original_language: "ml",
            sort_by: "popularity.desc",
          }}
        />

        <DiscoverRow
          title="Tamil Blockbusters"
          rowKey="tamil"
          media="movie"
          params={{
            with_original_language: "ta",
            with_origin_country: "IN",
          }}
        />

        <DiscoverRow
          title="Bollywood Hits"
          rowKey="bollywood"
          media="movie"
          params={{
            with_original_language: "hi",
            with_origin_country: "IN",
          }}
        />

        <DiscoverRow
          title="Telugu Hits"
          rowKey="telugu"
          media="movie"
          params={{
            with_original_language: "te",
            with_origin_country: "IN",
          }}
        />

        {/* Streaming */}
        <DiscoverRow
          title="Netflix"
          rowKey="netflix"
          params={{
            with_watch_providers: 8,
            watch_region: "IN",
          }}
        />

        <DiscoverRow
          title="Amazon Prime"
          rowKey="prime"
          params={{
            with_watch_providers: 119,
            watch_region: "IN",
          }}
        />
      </Suspense>
    </div>
  );
};

export default Home;
