import { Route, Routes } from "react-router-dom";
import { Suspense, lazy, useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";

import ProtectedRoute from "./components/ProtectedRoute";
import GuestRoute from "./components/GuestRoute";
import PageLoader from "./components/PageLoader";
import Footer from "./components/Footer";

/* ---------- Lazy Pages ---------- */
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const Home = lazy(() => import("./pages/Home"));
const WishList = lazy(() => import("./pages/WishList"));
const Watched = lazy(() => import("./pages/Watched"));
const Search = lazy(() => import("./pages/Search"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Details = lazy(() => import("./pages/Details"));
const Profile = lazy(() => import("./pages/Profile"));
const Watch = lazy(() => import("./pages/Watch"));
const WatchOverviewPage = lazy(() => import("./pages/WatchOverviewPage"));
const GenrePage = lazy(() => import("./pages/GenrePage"));
const Collection = lazy(() => import("./pages/Collection"));
const Studio = lazy(() => import("./pages/Studio"));
const Network = lazy(() => import("./pages/Network"));
const Provider = lazy(() => import("./pages/Provider"));
const Person = lazy(() => import("./pages/Person"));
const EpisodeRatingsPage = lazy(() => import("./pages/EpisodeRatingsPage"));

const FallbackLoader = () => (
  <div className="flex items-center justify-center min-h-screen bg-black">
    <div className="w-6 h-6 border-2 border-teal-400 border-t-transparent rounded-full animate-spin" />
  </div>
);

export default function App() {
  const [showIntro, setShowIntro] = useState(() => {
    return !sessionStorage.getItem("cw_intro_seen");
  });

  useEffect(() => {
    if (!showIntro) return;

    // Match exactly: CSS loaderOut fires at 3.4s, fade is 0.6s → total 4s
    // We unmount at the same time so there's zero gap between states
    const t = setTimeout(() => {
      sessionStorage.setItem("cw_intro_seen", "1");
      setShowIntro(false);
    }, 3000);

    return () => clearTimeout(t);
  }, [showIntro]);

  useEffect(()=>{
    if(showIntro) document.documentElement.style.overflow = 'hidden';
    else document.documentElement.style.overflow = 'auto';
  },[showIntro])

  return (
    <>
      <Suspense fallback={showIntro ? null : <FallbackLoader />}>
        {showIntro && <PageLoader />}

        {/* Always render routes so lazy imports resolve in the background */}
        <div style={{ visibility: showIntro ? "hidden" : "visible"}}>
          <Routes>
            <Route path="/" element={<Home />} />

            <Route
              path="/login"
              element={
                <GuestRoute>
                  <Login />
                </GuestRoute>
              }
            />

            <Route
              path="/register"
              element={
                <GuestRoute>
                  <Register />
                </GuestRoute>
              }
            />

            <Route
              path="/wishlist"
              element={
                <ProtectedRoute>
                  <WishList />
                </ProtectedRoute>
              }
            />

            <Route
              path="/watched"
              element={
                <ProtectedRoute>
                  <Watched />
                </ProtectedRoute>
              }
            />

            <Route path="/search" element={<Search />} />
            <Route path="/details/:media/:id" element={<Details />} />

            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />

            <Route
              path="/watch/:media/:id/:s?/:e?"
              element={
                <ProtectedRoute>
                  <Watch />
                </ProtectedRoute>
              }
            />

            <Route
              path="/watch/history"
              element={
                <ProtectedRoute>
                  <WatchOverviewPage />
                </ProtectedRoute>
              }
            />

            <Route path="/genre/:id" element={<GenrePage />} />
            <Route path="/collection/:id" element={<Collection />} />
            <Route path="/studio/:id" element={<Studio />} />
            <Route path="/network/:id" element={<Network />} />
            <Route path="/provider/:id" element={<Provider />} />
            <Route path="/people/:id" element={<Person />} />
            <Route path="/ratings/:imdbId" element={<EpisodeRatingsPage />} />

            <Route path="*" element={<NotFound />} />
          </Routes>
          {/* <Footer /> */}
        </div>
      </Suspense>

      <Toaster position="top-center" />
    </>
  );
}