import Header from "../components/Header"
import HeroSection from "../components/HeroSection"
import RecommendationSection from "../components/RecommendationSection"
import StatsSection from "../components/StatsSection"
import TrendingSection from "../components/TrendingSection"
import UpcomingSection from "../components/UpcomingSection"
import OTTSection from "../components/OTTSection"
import Watching from "../components/watch/Watching"
import NowPlaying from "../components/NowPlaying"

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-black text-white pb-20 md:pb-0">
        <Header />
        <HeroSection />
        <StatsSection />
        <Watching />
        <RecommendationSection />
        <TrendingSection /> 
        <UpcomingSection /> 
        <OTTSection />
        <NowPlaying />
    </div>
  )
}

export default Home