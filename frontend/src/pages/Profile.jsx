import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import userStore from "../store/userStore";
import API from "../config/axios";
import BackHeader from "../components/BackHeader";
import DeleteConfirmModal from "../components/DeleteConfirmModal";
import toast from "react-hot-toast";

/* ---------------- UTIL ---------------- */
const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

// Helper to convert VAPID string to Uint8Array for the browser
const urlBase64ToUint8Array = (base64String) => {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)));
};

/* ---------------- ICONS ---------------- */
const Icons = {
  Verified: () => (
    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 12L11 14L15 10M12 3L13.9101 4.87147L16.5 4.20577L17.2184 6.78155L19.7942 7.5L19.1285 10.0899L21 12L19.1285 13.9101L19.7942 16.5L17.2184 17.2184L16.5 19.7942L13.9101 19.1285L12 21L10.0899 19.1285L7.5 19.7942L6.78155 17.2184L4.20577 16.5L4.87147 13.9101L3 12L4.87147 10.0899L4.20577 7.5L6.78155 6.78155L7.5 4.20577L10.0899 4.87147L12 3Z"/>
    </svg>
  ),
  Bookmark: () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 21L12 16L5 21V5C5 4.46957 5.21071 3.96086 5.58579 3.58579C5.96086 3.21071 6.46957 3 7 3H17C17.5304 3 18.0391 3.21071 18.4142 3.58579C18.7893 3.96086 19 4.46957 19 5V21Z"/>
    </svg>
  ),
  Check: () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12C21.9988 14.1564 21.3005 16.2547 20.0093 17.9818C18.7182 19.7088 16.9033 20.9725 14.8354 21.5839C12.7674 22.1953 10.5573 22.1219 8.53447 21.3746C6.51168 20.6273 4.78465 19.2461 3.61096 17.4371C2.43727 15.628 1.87979 13.4881 2.02168 11.3363C2.16356 9.18455 2.99721 7.13631 4.39828 5.49706C5.79935 3.85781 7.69279 2.71537 9.79619 2.24013C11.8996 1.7649 14.1003 1.98232 16.07 2.85999M22 4L12 14.01L9 11.01"/>
    </svg>
  ),
  Clock: () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 8V12L15 15M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"/>
    </svg>
  ),
  Bell: () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  ),
  Logout: () => (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9M16 17L21 12M21 12L16 7M21 12H9"/>
    </svg>
  ),
  Trash: () => (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 6H5H21M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z"/>
    </svg>
  ),
  Arrow: () => (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12H19M19 12L12 5M19 12L12 19"/>
    </svg>
  ),
};

/* ================= PAGE ================= */
const Profile = () => {
  const { user, logoutUser, deleteUser } = userStore();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSubscribing, setIsSubscribing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "CineWish — Profile";
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

  /* ── NOTIFICATION HANDLER ── */
  const handleEnableNotifications = async () => {
    setIsSubscribing(true);
    try {
      const permission = await Notification.requestPermission();

      if (permission !== "granted") {
        toast.error("Notifications are blocked by your browser. Please enable them in your site settings.");
        return;
      }

      // 1. Get Service Worker
      const registration = await navigator.serviceWorker.ready;

      // 2. Check for existing subscription
      let subscription = await registration.pushManager.getSubscription();

      // 3. If no subscription, create one
      if (!subscription) {
        subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(
            "BBGhZLprpWwS596bo9Jdj0Uvr5mHPT3wIuSjO6xFpf8gppnu1vJQ_1zyPv31zs_tN9nob01zLpmoN3jTZUYV61c"
          ),
        });
      }

      // 4. Send to backend
      await API.post("/push/subscribe", subscription);
      toast.success("Push notifications enabled!");
      
    } catch (err) {
      console.error("Subscription failed:", err);
      toast.error("Failed to enable notifications. Is your Service Worker registered?");
    } finally {
      setIsSubscribing(false);
    }
  };

  useEffect(() => {
    if (!user && !loading) navigate("/login");
  }, [user, loading, navigate]);

  const watched = profileData?.watchedCount || {};
  const wishlist = profileData?.wishlistCount || {};

  return (
    <div className="min-h-screen bg-[#080808] text-gray-100" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Serif+Display&display=swap');
        .stat-number { font-family: 'DM Serif Display', serif; }
        .shimmer { background: linear-gradient(90deg, #1a1a1a 25%, #222 50%, #1a1a1a 75%); background-size: 200% 100%; animation: shimmer 1.5s infinite; }
        @keyframes shimmer { 0% { background-position: -200% 0 } 100% { background-position: 200% 0 } }
        .bar-fill { transition: width 0.8s cubic-bezier(0.4,0,0.2,1); }
      `}</style>

      <BackHeader title="Profile" />

      <main className="min-h-[100vh-112px] max-w-2xl mx-auto px-4 sm:px-6 py-5 space-y-6">

        {/* ── USER CARD ── */}
        <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-6 flex items-center gap-5">
          <div className="shrink-0 w-14 h-14 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center text-2xl font-bold text-white shadow-lg shadow-teal-900/40">
            {loading ? "" : user?.username?.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            {loading ? (
              <>
                <div className="shimmer h-5 w-36 rounded-md mb-2" />
                <div className="shimmer h-3.5 w-52 rounded-md" />
              </>
            ) : (
              <>
                <h2 className="text-lg font-semibold text-white truncate leading-tight">
                  {profileData?.user?.username}
                </h2>
                <p className="text-sm text-gray-500 truncate mt-0.5">{profileData?.user?.email}</p>
              </>
            )}
          </div>
          {!loading && (
            <div className="shrink-0 hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/20 text-[10px] font-semibold text-teal-400 uppercase tracking-wider whitespace-nowrap">
              <Icons.Verified />
              {formatDate(profileData?.user?.createdAt)}
            </div>
          )}
        </div>

        {/* ── STATS ROW ── */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Total", value: (watched.totalCount || 0) + (wishlist.totalCount || 0), accent: "text-white" },
            { label: "Watched", value: watched.totalCount || 0, accent: "text-emerald-400" },
            { label: "Wishlist", value: wishlist.totalCount || 0, accent: "text-amber-400" },
          ].map(({ label, value, accent }) => (
            <div key={label} className="rounded-2xl border border-white/8 bg-white/[0.03] p-4 flex flex-col items-center justify-center gap-1 text-center">
              {loading
                ? <div className="shimmer h-8 w-10 rounded-md mx-auto" />
                : <span className={`stat-number text-3xl font-bold ${accent}`}>{value}</span>
              }
              <span className="text-[10px] uppercase tracking-widest text-gray-600 font-medium">{label}</span>
            </div>
          ))}
        </div>

        {/* ── BREAKDOWNS ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <BreakdownCard title="Watched" data={watched} color="emerald" loading={loading} />
          <BreakdownCard title="Wishlist" data={wishlist} color="amber" loading={loading} />
        </div>

        {/* ── NAVIGATION ── */}
        <div>
          <p className="text-[10px] uppercase tracking-[0.25em] text-gray-600 font-semibold mb-3 px-1">Library & Alerts</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <NavTile title="Wishlist" path="/wishlist" icon={<Icons.Bookmark />} accent="hover:border-amber-500/40 hover:bg-amber-500/5 hover:text-amber-400" />
            <NavTile title="Watched" path="/watched" icon={<Icons.Check />} accent="hover:border-emerald-500/40 hover:bg-emerald-500/5 hover:text-emerald-400" />
            <NavTile title="History" path="/watch/history" icon={<Icons.Clock />} accent="hover:border-purple-500/40 hover:bg-purple-500/5 hover:text-purple-400" />
            
            {/* Notification Button Tile */}
            <button
              onClick={handleEnableNotifications}
              disabled={isSubscribing}
              className={`group flex flex-col items-center gap-2.5 py-5 px-3 rounded-2xl border border-white/8 bg-white/[0.03] text-gray-500 transition-all duration-200 hover:border-blue-500/40 hover:bg-blue-500/5 hover:text-blue-400 active:scale-[0.97] ${isSubscribing ? 'opacity-50' : ''}`}
            >
              <div className="transition-colors duration-200">
                <Icons.Bell />
              </div>
              <div className="flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider">
                <span>{isSubscribing ? "Wait..." : "Alerts"}</span>
                <Icons.Arrow />
              </div>
            </button>
          </div>
        </div>

        {/* ── DANGER ZONE ── */}
        <div>
          <p className="text-[10px] uppercase tracking-[0.25em] text-red-500/40 font-semibold mb-3 px-1">Danger Zone</p>
          <div className="flex flex-col sm:flex-row gap-2">
            <button
              onClick={() => setShowLogoutModal(true)}
              className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-white/8 bg-white/[0.03] text-gray-400 text-sm font-medium hover:bg-white/[0.07] hover:text-white transition-all active:scale-[0.98]"
            >
              <Icons.Logout />
              Sign Out
            </button>
            <button
              onClick={() => setShowDeleteModal(true)}
              className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-red-500/15 bg-red-500/5 text-red-500/80 text-sm font-medium hover:bg-red-500/10 hover:text-red-400 transition-all active:scale-[0.98]"
            >
              <Icons.Trash />
              Delete Account
            </button>
          </div>
        </div>
      </main>

      <DeleteConfirmModal isOpen={showLogoutModal} onClose={() => setShowLogoutModal(false)} onConfirm={handleLogout} msg="Logout" description="Are you sure you want to log out of CineWish?" />
      <DeleteConfirmModal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)} onConfirm={handleDeleteAccount} msg="Delete Account" description="This action is permanent and will delete all your library data." />
    </div>
  );
};

/* ── BREAKDOWN CARD ── */
const BreakdownCard = ({ title, data, color, loading }) => {
  const total = data?.totalCount || 0;
  const movies = data?.movieCount || 0;
  const shows = data?.showCount || 0;
  const moviePct = total ? Math.round((movies / total) * 100) : 0;
  const showPct  = total ? Math.round((shows  / total) * 100) : 0;

  const bar  = color === "emerald" ? "bg-emerald-500" : "bg-amber-500";
  const text = color === "emerald" ? "text-emerald-400" : "text-amber-400";

  return (
    <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-5 space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-gray-300">{title}</span>
        <span className="text-[10px] font-bold text-gray-600 uppercase tracking-wider">{total} total</span>
      </div>
      <div className="space-y-3">
        {[
          { label: "Movies", count: movies, pct: moviePct },
          { label: "TV Shows", count: shows, pct: showPct },
        ].map(({ label, count, pct }) => (
          <div key={label} className="space-y-1.5">
            <div className="flex justify-between text-[11px] font-medium">
              <span className="text-gray-500">{label}</span>
              {loading
                ? <div className="shimmer h-3 w-14 rounded" />
                : <span className={text}>{count} · {pct}%</span>
              }
            </div>
            <div className="h-1 bg-white/5 rounded-full overflow-hidden">
              <div className={`h-full ${bar} bar-fill rounded-full`} style={{ width: `${loading ? 0 : pct}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ── NAV TILE ── */
const NavTile = ({ title, path, icon, accent }) => {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => navigate(path)}
      className={`group flex flex-col items-center gap-2.5 py-5 px-3 rounded-2xl border border-white/8 bg-white/[0.03] text-gray-500 transition-all duration-200 ${accent} active:scale-[0.97]`}
    >
      <div className="transition-colors duration-200">{icon}</div>
      <div className="flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider">
        <span>{title}</span>
        <Icons.Arrow />
      </div>
    </button>
  );
};

export default Profile;