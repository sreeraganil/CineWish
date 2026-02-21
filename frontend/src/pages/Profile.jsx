import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import userStore from "../store/userStore";
import API from "../config/axios";
import BackHeader from "../components/Backheader";
import DeleteConfirmModal from "../components/DeleteConfirmModal";

/* ---------------- UTIL ---------------- */
const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  const options = { year: "numeric", month: "long", day: "numeric" };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

/* ---------------- SVG ICONS ---------------- */
const Icons = {
  Verified: () => (
    <svg className="w-3 h-3 sm:w-4 sm:h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12L11 14L15 10M12 3L13.9101 4.87147L16.5 4.20577L17.2184 6.78155L19.7942 7.5L19.1285 10.0899L21 12L19.1285 13.9101L19.7942 16.5L17.2184 17.2184L16.5 19.7942L13.9101 19.1285L12 21L10.0899 19.1285L7.5 19.7942L6.78155 17.2184L4.20577 16.5L4.87147 13.9101L3 12L4.87147 10.0899L4.20577 7.5L6.78155 6.78155L7.5 4.20577L10.0899 4.87147L12 3Z"/></svg>
  ),
  Analytics: () => (
    <svg className="w-5 h-5 sm:w-7 sm:h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 11L12 14L22 4M21 12V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H16"/></svg>
  ),
  Movie: () => (
    <svg className="w-5 h-5 sm:w-7 sm:h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19.82 2H4.18C2.97602 2 2 2.97602 2 4.18V19.82C2 21.024 2.97602 22 4.18 22H19.82C21.024 22 22 21.024 22 19.82V4.18C22 2.97602 21.024 2 19.82 2Z"/><path d="M7 2V22M17 2V22M2 12H22M2 7H7M2 17H7M17 17H22M17 7H22"/></svg>
  ),
  Bookmarks: () => (
    <svg className="w-5 h-5 sm:w-7 sm:h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21L12 16L5 21V5C5 4.46957 5.21071 3.96086 5.58579 3.58579C5.96086 3.21071 6.46957 3 7 3H17C17.5304 3 18.0391 3.21071 18.4142 3.58579C18.7893 3.96086 19 4.46957 19 5V21Z"/></svg>
  ),
  Logout: () => (
    <svg className="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9M16 17L21 12M21 12L16 7M21 12H9"/></svg>
  ),
  Delete: () => (
    <svg className="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6H5H21M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z"/></svg>
  ),
  Sparkles: ({ className }) => (
    <svg className={className || "w-3 h-3 sm:w-4 sm:h-4"} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3L14.12 8.88L20 11L14.12 13.12L12 19L9.88 13.12L4 11L9.88 8.88L12 3Z"/><path d="M20 5L21 7L23 8L21 9L20 11L19 9L17 8L19 7L20 5Z"/></svg>
  ),
  ArrowRight: () => (
    <svg className="w-3.5 h-3.5 sm:w-5 sm:h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12H19M19 12L12 5M19 12L12 19"/></svg>
  ),
  MovieSmall: () => (
    <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19.82 2H4.18C2.97602 2 2 2.97602 2 4.18V19.82C2 21.024 2.97602 22 4.18 22H19.82C21.024 22 22 21.024 22 19.82V4.18C22 2.97602 21.024 2 19.82 2Z"/><path d="M7 2V22M17 2V22"/></svg>
  ),
  TV: () => (
    <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 7H4C2.89543 7 2 7.89543 2 9V20C2 21.1046 2.89543 22 4 22H20C21.1046 22 22 21.1046 22 20V9C22 7.89543 21.1046 7 20 7Z"/><path d="M17 2L12 7L7 2"/></svg>
  ),
  Bookmark: () => (
    <svg className="w-4 h-4 sm:w-6 sm:h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21L12 16L5 21V5C5 4.46957 5.21071 3.96086 5.58579 3.58579C5.96086 3.21071 6.46957 3 7 3H17C17.5304 3 18.0391 3.21071 18.4142 3.58579C18.7893 3.96086 19 4.46957 19 5V21Z"/></svg>
  ),
  CheckCircle: () => (
    <svg className="w-4 h-4 sm:w-6 sm:h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12C21.9988 14.1564 21.3005 16.2547 20.0093 17.9818C18.7182 19.7088 16.9033 20.9725 14.8354 21.5839C12.7674 22.1953 10.5573 22.1219 8.53447 21.3746C6.51168 20.6273 4.78465 19.2461 3.61096 17.4371C2.43727 15.628 1.87979 13.4881 2.02168 11.3363C2.16356 9.18455 2.99721 7.13631 4.39828 5.49706C5.79935 3.85781 7.69279 2.71537 9.79619 2.24013C11.8996 1.7649 14.1003 1.98232 16.07 2.85999M22 4L12 14.01L9 11.01"/></svg>
  ),
  History: () => (
    <svg className="w-4 h-4 sm:w-6 sm:h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 8V12L15 15M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"/></svg>
  )
};

/* ================= PAGE ================= */
const Profile = () => {
  const { user, logoutUser, deleteUser } = userStore();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "CineWish - Profile";

    const fetchProfileData = async () => {
      try {
        const { data } = await API.get("/user/profile");
        setProfileData(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
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
    if (!user && !loading) navigate("/login");
  }, [user, loading, navigate]);

  return (
    <div className="min-h-screen bg-[#050505] text-gray-100 font-sans selection:bg-teal-500/30 pb-16">
      <BackHeader title="Account Settings" />

      <main className="max-w-5xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8 space-y-4 sm:space-y-8">
        
        {/* ================= USER CARD ================= */}
        <section className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-teal-500/20 to-emerald-500/20 rounded-2xl sm:rounded-[2rem] blur opacity-30"></div>
          <div className="relative overflow-hidden rounded-2xl sm:rounded-[2rem] bg-gray-900/40 border border-white/5 backdrop-blur-xl p-4 sm:p-10 shadow-2xl">
            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-8">
              {/* Avatar */}
              <div className="relative shrink-0">
                <div className="absolute inset-0 bg-teal-400/20 rounded-full blur-xl animate-pulse"></div>
                <div className="relative w-16 h-16 sm:w-28 sm:h-28 rounded-full bg-gray-950 border-2 border-teal-500/30 flex items-center justify-center text-2xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-teal-400 to-emerald-400">
                  {loading ? <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-800 rounded-full animate-pulse" /> : user?.username?.charAt(0).toUpperCase()}
                </div>
              </div>

              {/* Info */}
              <div className="flex-1 text-center sm:text-left space-y-2 sm:space-y-3">
                <div>
                  <h2 className="text-xl sm:text-3xl font-bold text-white flex items-center justify-center sm:justify-start gap-2 sm:gap-3">
                    {loading ? <div className="h-6 sm:h-8 w-32 sm:w-48 bg-gray-800 rounded animate-pulse" /> : (
                      <>
                        {profileData?.user?.username}
                        <Icons.Sparkles className="text-teal-400 w-4 h-4 sm:w-5 sm:h-5" />
                      </>
                    )}
                  </h2>
                  <p className="text-xs sm:text-base text-gray-400 mt-1 font-medium">
                    {loading ? <div className="h-4 sm:h-5 w-48 sm:w-64 bg-gray-800 rounded animate-pulse mt-2" /> : profileData?.user?.email}
                  </p>
                </div>
                
                <div className="inline-flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full bg-teal-500/10 border border-teal-500/20 text-[9px] sm:text-[10px] font-bold text-teal-400 uppercase tracking-widest">
                  <Icons.Verified />
                  <span>Member since {loading ? "..." : formatDate(profileData?.user?.createdAt)}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================= STATS GRID ================= */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-6">
          <HeroStat 
            label="Total Activity" 
            value={loading ? 0 : (profileData?.watchedCount?.totalCount || 0) + (profileData?.wishlistCount?.totalCount || 0)}
            icon={<Icons.Analytics />}
            color="teal"
            loading={loading}
          />
          <HeroStat 
            label="Watched Library" 
            value={loading ? 0 : profileData?.watchedCount?.totalCount || 0}
            icon={<Icons.Movie />}
            color="emerald"
            loading={loading}
          />
          <HeroStat 
            label="Wishlist Items" 
            value={loading ? 0 : profileData?.wishlistCount?.totalCount || 0}
            icon={<Icons.Bookmarks />}
            color="amber"
            loading={loading}
          />
        </div>

        {/* ================= ANALYSIS ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-6">
          <BreakdownCard 
            title="Watched Breakdown"
            total={profileData?.watchedCount?.totalCount}
            movieCount={profileData?.watchedCount?.movieCount}
            showCount={profileData?.watchedCount?.showCount}
            color="emerald"
            loading={loading}
          />
          <BreakdownCard 
            title="Wishlist Breakdown"
            total={profileData?.wishlistCount?.totalCount}
            movieCount={profileData?.wishlistCount?.movieCount}
            showCount={profileData?.wishlistCount?.showCount}
            color="amber"
            loading={loading}
          />
        </div>

        {/* ================= NAVIGATION ================= */}
        <div className="space-y-4 sm:space-y-6 pt-2 sm:pt-4 border-t border-white/5">
          <h3 className="text-gray-500 text-[9px] sm:text-[10px] font-black uppercase tracking-[0.3em] ml-1 flex items-center gap-3">
            Quick Navigation
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
            <NavTile title="Wishlist" path="/wishlist" icon={<Icons.Bookmark />} color="amber" />
            <NavTile title="Watched" path="/watched" icon={<Icons.CheckCircle />} color="emerald" />
            <NavTile title="History" path="/watch/history" icon={<Icons.History />} color="purple" />
          </div>
        </div>

        {/* ================= ACCOUNT ACTIONS ================= */}
        <div className="space-y-3 sm:space-y-4 pt-4 sm:pt-8">
          <h3 className="text-red-500/50 text-[9px] sm:text-[10px] font-black uppercase tracking-[0.3em] ml-1">
            Danger Zone
          </h3>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
             <button
                onClick={() => setShowLogoutModal(true)}
                className="flex-1 flex items-center justify-center gap-2 sm:gap-3 px-4 sm:px-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl bg-gray-900 border border-white/5 text-gray-300 hover:bg-gray-800 hover:text-white transition-all active:scale-[0.98]"
              >
                <Icons.Logout />
                <span className="font-semibold text-xs sm:text-sm">Sign Out</span>
              </button>
              <button
                onClick={() => setShowDeleteModal(true)}
                className="flex-1 flex items-center justify-center gap-2 sm:gap-3 px-4 sm:px-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl bg-red-500/5 border border-red-500/10 text-red-500 hover:bg-red-500/10 transition-all active:scale-[0.98]"
              >
                <Icons.Delete />
                <span className="font-semibold text-xs sm:text-sm">Delete Account</span>
              </button>
          </div>
        </div>

      </main>

      <DeleteConfirmModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleLogout}
        msg="Logout"
        description="Are you sure you want to log out of CineWish?"
      />

      <DeleteConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteAccount}
        msg="Delete Account"
        description="This action is permanent and will delete all your library data."
      />
    </div>
  );
};

/* ================= SUB-COMPONENTS ================= */

const HeroStat = ({ label, value, icon, color, loading }) => {
  const themes = {
    teal: "text-teal-400 bg-teal-500/5 border-teal-500/20",
    emerald: "text-emerald-400 bg-emerald-500/5 border-emerald-500/20",
    amber: "text-amber-400 bg-amber-500/5 border-amber-500/20",
  };

  return (
    <div className={`relative overflow-hidden p-4 sm:p-6 rounded-xl sm:rounded-[1.5rem] bg-gray-900/60 border border-white/5 backdrop-blur-sm transition-all hover:border-white/10 group`}>
      <div className="relative flex justify-between items-start">
        <div className="space-y-1 sm:space-y-2">
          <p className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-gray-500 group-hover:text-gray-400 transition-colors">
            {label}
          </p>
          {loading ? (
            <div className="h-8 sm:h-10 w-12 sm:w-16 bg-gray-800 rounded animate-pulse" />
          ) : (
            <p className="text-2xl sm:text-4xl font-black text-white">{value}</p>
          )}
        </div>
        <div className={`${themes[color]} p-2 sm:p-3 rounded-xl sm:rounded-2xl`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

const BreakdownCard = ({ title, total, movieCount, showCount, color, loading }) => {
  const safeTotal = total || 1;
  const moviePercent = Math.round(((movieCount || 0) / safeTotal) * 100);
  const showPercent = Math.round(((showCount || 0) / safeTotal) * 100);

  const barColor = color === 'emerald' ? 'bg-emerald-500' : 'bg-amber-500';
  const textColor = color === 'emerald' ? 'text-emerald-400' : 'text-amber-400';

  return (
    <div className="bg-gray-900/40 border border-white/5 rounded-xl sm:rounded-[1.5rem] p-4 sm:p-6 hover:bg-gray-900/60 transition-all">
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <h3 className="text-xs sm:text-sm font-bold text-gray-200 flex items-center gap-1.5 sm:gap-2">
          <span className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${barColor}`}></span>
          {title}
        </h3>
        <span className="text-[9px] sm:text-[10px] font-black bg-white/5 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded text-gray-400">
          TOTAL: {total || 0}
        </span>
      </div>

      <div className="space-y-3 sm:space-y-5">
        <ProgressBar label="Movies" count={movieCount} percent={moviePercent} icon={<Icons.MovieSmall />} colorClass={barColor} textColor={textColor} loading={loading} />
        <ProgressBar label="TV Shows" count={showCount} percent={showPercent} icon={<Icons.TV />} colorClass={barColor} textColor={textColor} loading={loading} opacity="opacity-60" />
      </div>
    </div>
  );
};

const ProgressBar = ({ label, count, percent, icon, colorClass, textColor, loading, opacity = "" }) => (
  <div className="space-y-1.5 sm:space-y-2">
    <div className="flex justify-between text-[10px] sm:text-[11px] font-bold uppercase tracking-wider">
      <span className="text-gray-500 flex items-center gap-1.5 sm:gap-2">{icon} {label}</span>
      {loading ? <div className="h-3 w-10 sm:w-12 bg-gray-800 rounded" /> : <span className={textColor}>{count || 0} ({percent}%)</span>}
    </div>
    <div className="h-1.5 sm:h-2 bg-white/5 rounded-full overflow-hidden">
      <div className={`h-full ${colorClass} ${opacity} transition-all duration-700 ease-out`} style={{ width: `${loading ? 0 : percent}%` }} />
    </div>
  </div>
);

const NavTile = ({ title, path, icon, color }) => {
  const navigate = useNavigate();
  const themes = {
    amber: "hover:text-amber-400 hover:bg-amber-500/10 hover:border-amber-500/30",
    emerald: "hover:text-emerald-400 hover:bg-emerald-500/10 hover:border-emerald-500/30",
    purple: "hover:text-purple-400 hover:bg-purple-500/10 hover:border-purple-500/30",
  };

  return (
    <button 
      onClick={() => navigate(path)}
      className={`group flex flex-col items-center justify-center gap-2 sm:gap-3 p-3 sm:p-5 rounded-xl sm:rounded-2xl bg-gray-900/80 border border-white/5 transition-all duration-300 hover:-translate-y-1 ${themes[color]}`}
    >
      <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-white/5 flex items-center justify-center text-gray-400 group-hover:text-inherit transition-colors">
        {icon}
      </div>
      <div className="flex items-center gap-1.5 sm:gap-2">
        <span className="font-bold text-[11px] sm:text-xs text-gray-400 group-hover:text-white transition-colors">{title}</span>
        <Icons.ArrowRight />
      </div>
    </button>
  );
};

export default Profile;