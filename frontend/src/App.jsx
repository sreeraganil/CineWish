import { Route, Routes } from "react-router-dom";
import { Suspense, lazy } from "react";
import { Toaster } from "react-hot-toast";

import ProtectedRoute from "./components/ProtectedRoute";
import GuestRoute from "./components/GuestRoute";
import Person from "./pages/Person";

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

const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-950 text-teal-400">
    <div className="flex gap-2">
      <div className="w-3 h-3 bg-teal-400 rounded-full animate-bounce" />
      <div
        className="w-3 h-3 bg-teal-400 rounded-full animate-bounce"
        style={{ animationDelay: "150ms" }}
      />
      <div
        className="w-3 h-3 bg-teal-400 rounded-full animate-bounce"
        style={{ animationDelay: "300ms" }}
      />
    </div>
  </div>
);

const App = () => {
  return (
    <>
      <Suspense fallback={<PageLoader />}>
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

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>

      <Toaster position="top-center" reverseOrder={false} />
    </>
  );
};

export default App;
