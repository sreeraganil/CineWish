import { useEffect, useState } from "react";
import wishlistStore from "../store/wishlistStore";
import userStore from "../store/userStore";
import BackHeader from "../components/Backheader";
import DeleteConfirmModal from "../components/DeleteConfirmModal";

const Profile = () => {
  const { user, logoutUser } = userStore();
  const { wishlist, fetchWishlist, fetchWatched, watched } = wishlistStore();
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchWishlist();
    fetchWatched();
  }, []);

  return (
    <>
      <BackHeader title="Profile" />
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-black text-white pt-10">
        <div className="max-w-xl mx-3 sm:mx-auto p-6 bg-gray-900 rounded-xl shadow-md border border-gray-800 ">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-teal-600 text-white rounded-full flex items-center justify-center text-2xl font-bold uppercase">
              {user.username?.charAt(0)}
            </div>
            <div>
              <h2 className="text-xl font-semibold">{user.username}</h2>
              <p className="text-gray-400 text-sm">{user.email}</p>
            </div>
          </div>

          <div className="mt-6 space-y-2 text-sm sm:text-base">
            <div className="flex justify-between text-gray-300">
              <span>🎯 Total:</span>
              <span>{wishlist.length + watched.length || 0}</span>
            </div>
            <div className="flex justify-between text-teal-400">
              <span>✅ Watched:</span>
              <span>{watched.length || 0}</span>
            </div>
            <div className="flex justify-between text-yellow-400">
              <span>📌 To Watch:</span>
              <span>{wishlist.length || 0}</span>
            </div>
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="mt-8 w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded"
          >
            Logout
          </button>
        </div>
      </div>

      <DeleteConfirmModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={logoutUser}
      />
    </>
  );
};

export default Profile;
