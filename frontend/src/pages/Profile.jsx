import { useEffect, useState } from "react";
import userStore from "../store/userStore";
import BackHeader from "../components/Backheader";
import DeleteConfirmModal from "../components/DeleteConfirmModal";
import { useNavigate } from "react-router-dom";
import API from "../config/axios";

/* ---------------- UTIL ---------------- */

const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  const options = { year: "numeric", month: "long" };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

/* ================= PAGE ================= */

const Profile = () => {
  const { user, logoutUser, deleteUser } = userStore();

  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [profileData, setProfileData] = useState(null);

  const navigate = useNavigate();

  // Always reset scroll
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const { data } = await API.get("/user/profile");
        setProfileData(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchProfileData();
  }, []);

  const handleLogout = async () => {
    const success = await logoutUser();
    if (success) navigate("/login");
  };

  const handleDeleteAccount = async () => {
    const success = await deleteUser();
    if (success) navigate("/login");
    setShowDeleteModal(false);
  };

  useEffect(() => {
    if (!user) handleLogout();
  }, [user]);

  return (
    <>
      <BackHeader title="Profile" />

      <div className="min-h-[calc(100%-72px)] bg-gradient-to-br from-black via-gray-950 to-gray-900 text-white pt-3 md:pt-8 pb-16 md:pb-20">
        <div className="max-w-4xl mx-auto px-3 md:px-4 space-y-5 md:space-y-8">
          {/* ===== PROFILE CARD ===== */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-900/90 via-gray-900/50 to-gray-900/90 border border-gray-800/50 shadow-2xl p-4 md:p-6 backdrop-blur-sm">
            <div className="absolute inset-0 bg-gradient-to-br from-teal-500/5 via-transparent to-emerald-500/5 pointer-events-none" />

            <div className="relative flex items-center gap-3 md:gap-5">
              <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-gradient-to-br from-teal-500 via-teal-400 to-emerald-500 flex items-center justify-center text-xl md:text-2xl font-bold shadow-lg shadow-teal-500/20 ring-2 ring-teal-400/20 shrink-0">
                {user?.username?.charAt(0)}
              </div>

              <div className="min-w-0 flex-1">
                <h2 className="text-lg md:text-2xl font-bold text-white truncate">
                  {profileData?.user?.username}
                </h2>

                <p className="text-xs md:text-sm text-gray-400 mt-0.5 truncate">
                  {profileData?.user?.email}
                </p>

                <p className="text-[10px] md:text-xs text-gray-500 mt-1 md:mt-1.5 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-xs">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      width="16"
                      height="16"
                      fill="currentColor"
                    >
                      <path d="M20 3h-1V1h-2v2H7V1H5v2H4c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 18H4V8h16v13z" />
                    </svg>
                  </span>
                  <span className="truncate">
                    Member since {formatDate(profileData?.user?.createdAt)}
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* ===== STATS ===== */}

          {/* Big numbers */}
          <div className="grid grid-cols-3 gap-2 md:gap-4">
            <BigStat
              label="Total"
              value={
                (profileData?.watchedCount?.totalCount || 0) +
                (profileData?.wishlistCount?.totalCount || 0)
              }
              color="teal"
            />

            <BigStat
              label="Watched"
              value={profileData?.watchedCount?.totalCount || 0}
              color="emerald"
            />

            <BigStat
              label="Wishlist"
              value={profileData?.wishlistCount?.totalCount || 0}
              color="yellow"
            />
          </div>

          {/* Breakdown - Compact on mobile */}
          <div className="grid grid-cols-2 gap-3 md:gap-5">
            <GroupCard title="Watched">
              <MiniStat
                label="Movies"
                value={profileData?.watchedCount?.movieCount || 0}
              />
              <MiniStat
                label="Shows"
                value={profileData?.watchedCount?.showCount || 0}
              />
            </GroupCard>

            <GroupCard title="Wishlist">
              <MiniStat
                label="Movies"
                value={profileData?.wishlistCount?.movieCount || 0}
              />
              <MiniStat
                label="Shows"
                value={profileData?.wishlistCount?.showCount || 0}
              />
            </GroupCard>
          </div>

          {/* ===== MANAGE ===== */}
          <div>
            <h3 className="text-sm md:text-base font-semibold mb-3 md:mb-4 tracking-wide">
              Quick Access
            </h3>

            <div className="grid grid-cols-3 gap-2 md:gap-3">
              <NavButton
                title="Wishlist"
                path="/wishlist"
                icon={
                  <span className="material-symbols-outlined text-sm md:text-base">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      width="24"
                      height="24"
                      fill="currentColor"
                    >
                      <path d="M19 5v14H5V5h14m1.1-2H3.9c-.5 0-.9.4-.9.9v16.2c0 .4.4.9.9.9h16.2c.4 0 .9-.5.9-.9V3.9c0-.5-.5-.9-.9-.9zM11 7h6v2h-6V7zm0 4h6v2h-6v-2zm0 4h6v2h-6zM7 7h2v2H7zm0 4h2v2H7zm0 4h2v2H7z" />
                    </svg>
                  </span>
                }
              />

              <NavButton
                title="Watched"
                path="/watched"
                icon={
                  <span className="material-symbols-outlined text-sm md:text-base">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      width="24"
                      height="24"
                      fill="currentColor"
                    >
                      <path d="M22 5.18L10.59 16.6l-4.24-4.24 1.41-1.41 2.83 2.83 10-10L22 5.18zM12 20c-4.41 0-8-3.59-8-8s3.59-8 8-8c1.57 0 3.04.46 4.28 1.25l1.45-1.45C16.1 2.67 14.13 2 12 2 6.48 2 2 6.48 2 12s4.48 10 10 10c1.73 0 3.36-.44 4.78-1.22l-1.5-1.5c-1 .46-2.11.72-3.28.72z" />
                    </svg>
                  </span>
                }
              />

              <NavButton
                title="History"
                path="/watch/history"
                icon={
                  <span className="material-symbols-outlined text-sm md:text-base">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      width="24"
                      height="24"
                      fill="currentColor"
                    >
                      <path d="M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 19.99 10.51 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z" />
                    </svg>
                  </span>
                }
              />
            </div>
          </div>

          {/* ===== ACTIONS ===== */}
          <div className="pt-2 md:pt-4">
            <button
              onClick={() => setShowLogoutModal(true)}
              className="
                w-full py-2.5 md:py-3 rounded-xl font-medium text-sm md:text-base
                bg-gradient-to-r from-red-600 to-red-700
                hover:from-red-700 hover:to-red-800
                transition
              "
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* ===== MODALS ===== */}

      <DeleteConfirmModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleLogout}
        msg="Logout"
        description="Are you sure you want to log out?"
      />

      <DeleteConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteAccount}
        msg="Delete Account"
        description="This action is permanent and cannot be undone."
      />
    </>
  );
};

export default Profile;

/* ================= COMPONENTS ================= */

const BigStat = ({ label, value, color }) => {
  const colors = {
    teal: "from-teal-500/20 via-teal-500/10 to-transparent text-teal-300 border-teal-500/30 shadow-teal-500/20",
    emerald:
      "from-emerald-500/20 via-emerald-500/10 to-transparent text-emerald-300 border-emerald-500/30 shadow-emerald-500/20",
    yellow:
      "from-yellow-500/20 via-yellow-500/10 to-transparent text-yellow-300 border-yellow-500/30 shadow-yellow-500/20",
  };

  return (
    <div
      className={`
        relative overflow-hidden rounded-xl md:rounded-2xl border p-3 md:p-4
        bg-gradient-to-br ${colors[color]}
        shadow-lg hover:shadow-xl
        hover:scale-[1.02] transition-all duration-300
      `}
    >
      <div className="absolute top-0 right-0 w-16 md:w-24 h-16 md:h-24 bg-white/5 rounded-full blur-2xl -mr-8 md:-mr-12 -mt-8 md:-mt-12" />

      <p className="text-[10px] md:text-xs uppercase opacity-60 tracking-wider font-medium">
        {label}
      </p>

      <p className="text-2xl md:text-4xl font-bold mt-1 md:mt-2 relative z-10">
        {value}
      </p>
    </div>
  );
};

const GroupCard = ({ title, children }) => {
  return (
    <div className="relative rounded-xl md:rounded-2xl border border-gray-800/50 bg-gradient-to-br from-gray-900/80 to-gray-900/40 p-3 md:p-4 backdrop-blur-sm shadow-xl hover:border-gray-700/50 transition-all duration-300">
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent rounded-xl md:rounded-2xl pointer-events-none" />

      <h4 className="text-xs md:text-sm font-bold mb-2 md:mb-4 uppercase tracking-wider text-gray-200 flex items-center gap-2">
        <div className="w-0.5 md:w-1 h-3 md:h-4 bg-gradient-to-b from-teal-400 to-emerald-400 rounded-full" />
        {title}
      </h4>

      <div className="grid grid-cols-1 gap-2 md:gap-3 relative z-10">
        {children}
      </div>
    </div>
  );
};

const MiniStat = ({ label, value }) => {
  return (
    <div className="rounded-lg md:rounded-xl bg-gradient-to-br from-black/60 to-black/30 p-2.5 md:p-4 border border-gray-800/50 hover:border-gray-700/50 transition-all duration-300 group hover:shadow-lg">
      <p className="text-[10px] md:text-[11px] uppercase text-gray-400 tracking-wide font-medium group-hover:text-teal-400 transition-colors">
        {label}
      </p>

      <p className="text-lg md:text-xl font-bold mt-1  text-white">{value}</p>
    </div>
  );
};

const NavButton = ({ title, path, icon }) => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(path)}
      className="
        group w-full
        flex flex-col md:flex-row items-center md:justify-between
        gap-1.5 md:gap-0
        p-2.5 md:px-4 md:py-3
        rounded-xl
        bg-gray-900
        border border-gray-800
        hover:border-teal-500/50
        transition
      "
    >
      <div className="flex flex-col md:flex-row items-center gap-1.5 md:gap-3 w-full md:w-auto">
        <div className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-teal-500/15 text-teal-400 flex items-center justify-center shrink-0">
          {icon}
        </div>

        <span className="text-xs md:text-sm font-medium text-center md:text-left">
          {title}
        </span>
      </div>

      <span className="hidden md:block text-gray-500 group-hover:text-teal-400 transition">
        ›
      </span>
    </button>
  );
};
