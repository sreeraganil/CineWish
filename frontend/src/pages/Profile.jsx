import { useEffect } from "react";
import wishlistStore from "../store/wishlistStore";
import { useNavigate } from "react-router-dom";
import userStore from "../store/userStore";
import BackHeader from "../components/Backheader";

const Profile = () => {
  const { user, logoutUser } = userStore();
  const { wishlist, fetchWishlist } = wishlistStore();
  const navigate = useNavigate();

  useEffect(() => {
    fetchWishlist();
  }, []);

  const handleLogout = () => {
    logoutUser();
    navigate("/login");
  };

  return (
    <>
    <BackHeader title={"Profile"} />
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-black text-white pt-10">
        <div className="max-w-xl mx-3 md:mx-auto p-6 bg-gray-900 rounded-xl shadow-md border border-gray-800">
          <div className="space-y-3">
            <p>
              <span className="text-gray-400">Name:</span>{" "}
              {user.username || "N/A"}
            </p>
            <p>
              <span className="text-gray-400">Email:</span> {user.email}
            </p>
            <p>
              <span className="text-gray-400">Wishlist Items:</span>{" "}
              {wishlist.length}
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="mt-6 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded"
          >
            Logout
          </button>
        </div>
      </div>
    </>
  );
};

export default Profile;
