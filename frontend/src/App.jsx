import { Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import WishList from "./pages/WishList";
import Watched from "./pages/Watched";
import Search from "./pages/Search";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import GuestRoute from "./components/GuestRoute";
import Details from "./pages/Details";
import Profile from "./pages/Profile";
import { Toaster } from "react-hot-toast"
import Watch from "./pages/Watch";
import WatchOverviewPage from "./pages/WatchOverviewPage";
import GenrePage from "./pages/GenrePage";

const App = () => {
  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
              <Home />
          }
        />
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
        <Route
          path="/search"
          element={
              <Search />
          }
        />
        <Route
          path="/details/:media/:id"
          element={
              <Details />
          }
        />
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
        <Route
          path="/genre/:id"
          element={
            <GenrePage />
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster position="top-center" reverseOrder={false} />
    </>
  );
};

export default App;
