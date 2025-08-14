import Header from "../components/Header"
import HeroSection from "../components/HeroSection"
import RecommendationSection from "../components/RecommendationSection"
import StatsSection from "../components/StatsSection"
import TrendingSection from "../components/TrendingSection"
import UpcomingSection from "../components/UpcomingSection"
import OTTSection from "../components/OTTSection"

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-black text-white pb-20 md:pb-0">
        <Header />
        <HeroSection />
        <StatsSection />
        <RecommendationSection />
        <TrendingSection /> 
        <UpcomingSection /> 
        <OTTSection />
    </div>
  )
}

export default Home