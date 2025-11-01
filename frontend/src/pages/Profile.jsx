import { useEffect, useState } from "react";
import wishlistStore from "../store/wishlistStore";
import userStore from "../store/userStore";
import BackHeader from "../components/Backheader";
import DeleteConfirmModal from "../components/DeleteConfirmModal";
import { useNavigate } from "react-router-dom";
import API from "../config/axios";

const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  const options = { year: "numeric", month: "long" };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

const Profile = () => {

  const { user, logoutUser, deleteUser } = userStore();
    
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false); 
  const [profileData, setProfileData] = useState(null);
  const [loading, setIsLoading] = useState(true);
  const navigate = useNavigate();

useEffect(() => {
    const fetchProfileData = async () => {
      setIsLoading(true);
      try {
        const { data } = await API.get("/user/profile");
        setProfileData(data);
      } catch (err) {
        console.error(err)
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  const handleLogout = async () => {
    const success = await logoutUser();
    if (success) {
      navigate("/login");
    }
  };


  const handleDeleteAccount = async () => {
    const success = await deleteUser();
    if (success) {
      navigate("/login");
    }
  
    setShowDeleteModal(false);
  };

  useEffect(() => {
    if (!user) {
      handleLogout();
    }
  }, [user]);


  const handleNavigate = (path) => {
    navigate(path);
  };


  const NavLink = ({ title, path, emoji }) => (
    <button
      onClick={() => handleNavigate(path)}
      className="flex items-center justify-between w-full px-4 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors duration-200"
    >
      <span className="flex items-center gap-3">
        <span className="text-lg">{emoji}</span>
        <span>{title}</span>
      </span>
      <span className="text-gray-500">›</span>
    </button>
  );

  return (
    <>
      <BackHeader title="Profile" />
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-black text-white pt-10 pb-20">
        <div className="max-w-xl mx-3 sm:mx-auto p-6 bg-gray-900 rounded-xl shadow-md border border-gray-800 ">
          
          {/* --- User Info Section --- */}
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-teal-600 text-white rounded-full flex items-center justify-center text-2xl font-bold uppercase shrink-0">
              {user?.username?.charAt(0)}
            </div>
            <div>
              <h2 className="text-xl font-semibold">{profileData?.user?.username}</h2>
              <p className="text-gray-400 text-sm">{profileData?.user?.email}</p>
              {/* NEW: Member Since Date */}
              <p className="text-gray-500 text-xs mt-1">
                Member since {formatDate(profileData?.user?.createdAt)}
              </p>
            </div>
          </div>

          {/* --- Stats Section (Expanded) --- */}
          <div className="mt-8 pt-6 border-t border-gray-700">
            <h3 className="text-lg font-semibold text-gray-200 mb-4">
              Your Stats
            </h3>
            <div className="space-y-3 text-sm sm:text-base">
              <div className="flex justify-between text-gray-300 font-bold">
                <span>🎯 Total Items:</span>
                <span>
                  {profileData?.watchedCount.totalCount + profileData?.wishlistCount.totalCount || 0}
                </span>
              </div>
              
              <hr className="border-gray-700"/>

              {/* Watched Stats */}
              <div className="flex justify-between text-teal-400">
                <span>✅ Watched (Total):</span>
                <span>{profileData?.watchedCount.totalCount || 0}</span>
              </div>
              <div className="flex justify-between text-gray-400 pl-4 text-sm">
                <span>- Movies:</span>
                <span>{profileData?.watchedCount.movieCount || 0}</span>
              </div>
              <div className="flex justify-between text-gray-400 pl-4 text-sm">
                <span>- Shows:</span>
                <span>{profileData?.watchedCount.showCount || 0}</span>
              </div>
              
              <hr className="border-gray-700"/>

              {/* Wishlist Stats */}
              <div className="flex justify-between text-yellow-400">
                <span>📌 To Watch (Total):</span>
                <span>{profileData?.wishlistCount.totalCount || 0}</span>
              </div>
              <div className="flex justify-between text-gray-400 pl-4 text-sm">
                <span>- Movies:</span>
                <span>{profileData?.wishlistCount.movieCount || 0}</span>
              </div>
              <div className="flex justify-between text-gray-400 pl-4 text-sm">
                <span>- Shows:</span>
                <span>{profileData?.wishlistCount.showCount || 0}</span>
              </div>
            </div>
          </div>

          {/* --- Navigation Links Section (NEW) --- */}
          <div className="mt-8 pt-6 border-t border-gray-700">
            <h3 className="text-lg font-semibold text-gray-200 mb-4">
              Manage
            </h3>
            <div className="space-y-3">
              <NavLink title="My Wishlist" path="/wishlist" emoji="📌" />
              <NavLink title="My Watched List" path="/watched" emoji="✅" />
              {/* <NavLink title="Edit Profile" path="/settings" emoji="⚙️" /> */}
            </div>
          </div>

          {/* --- Account Actions Section --- */}
          <div className="mt-8 pt-6 border-t border-gray-700 space-y-3">
            <button
              onClick={() => setShowLogoutModal(true)}
              className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200 font-medium"
            >
              Logout
            </button>
            {/* NEW: Delete Account Button */}
            {/* <button
              onClick={() => setShowDeleteModal(true)}
              className="w-full px-4 py-2 text-red-500 hover:bg-red-900/20 rounded-lg transition-colors duration-200 text-sm"
            >
              Delete Account
            </button> */}
          </div>
        </div>
      </div>

      {/* --- Modals --- */}
      <DeleteConfirmModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleLogout}
        msg={"Logout"}
        description="Are you sure you want to log out?"
      />

      {/* NEW: Delete Account Modal */}
      <DeleteConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteAccount}
        msg={"Delete Account"}
        description="This action is permanent and cannot be undone. All your data will be lost."
      />
    </>
  );
};

export default Profile;