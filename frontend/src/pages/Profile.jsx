import { useEffect } from "react";
import wishlistStore from "../store/wishlistStore";
import { useNavigate } from "react-router-dom";
import userStore from "../store/userStore";

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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-black text-white pt-10">
      <div className="max-w-xl mx-auto p-6 bg-gray-900 rounded-xl shadow-md border border-gray-800">
        <h2 className="text-2xl font-bold mb-4">👤 Profile</h2>

        <div className="space-y-3">
          <p><span className="text-gray-400">Name:</span> {user.username || "N/A"}</p>
          <p><span className="text-gray-400">Email:</span> {user.email}</p>
          <p><span className="text-gray-400">Wishlist Items:</span> {wishlist.length}</p>
        </div>

        <button
          onClick={handleLogout}
          className="mt-6 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Profile;
