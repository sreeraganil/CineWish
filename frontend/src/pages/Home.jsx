import { Suspense, lazy, useEffect } from "react";
import Header from "../components/Header";
import HeroSection from "../components/HeroSection";
import GenreRow from "../components/GenreRow";
import StudiosGrid from "../components/StudiosGrid";
import NetWorkGrid from "../components/NetWorkGrid";
// import StatsSection from "../components/StatsSection";
import Watching from "../components/watch/Watching";
import RecommendationSection from "../components/RecommendationSection";
import DiscoverRow from "../components/DiscoverRow";
import useHomeRowStore from "../store/homeRowStore";
import discoverRows from "../utilities/discoverRows.config";

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

      {/* <StatsSection /> */}
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
        {discoverRows.map((row) => (
          <DiscoverRow
            key={row.rowKey}
            title={row.title}
            rowKey={row.rowKey}
            media={row.media}
            params={row.params}
          />
        ))}
      </Suspense>
    </div>
  );
};

export default Home;
