import { Suspense, lazy } from "react";
import Header from "../components/Header";
import HeroSection from "../components/HeroSection";
import GenreRow from "../components/GenreRow";
import StudiosGrid from "../components/StudiosGrid";
import NetWorkGrid from "../components/NetWorkGrid";

// Lazy load sections that aren't immediately visible (below the fold)
const StatsSection = lazy(() => import("../components/StatsSection"));
const Watching = lazy(() => import("../components/watch/Watching"));
const RecommendationSection = lazy(
  () => import("../components/RecommendationSection"),
);
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
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-black text-white pb-20 md:pb-0">
      <Header />
      <HeroSection />

      <div>
        <StatsSection />
        <Watching />
        <RecommendationSection />
        <Suspense fallback={<SectionLoader />}>
          <TrendingSection />
          <UpcomingSection />
          <OTTSection />
          <NowPlaying />
        </Suspense>
        <GenreRow />
        <StudiosGrid />
        <NetWorkGrid />
      </div>
    </div>
  );
};

export default Home;
