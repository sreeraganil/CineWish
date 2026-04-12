import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import userStore from "../store/userStore";
import toast from "react-hot-toast";

const Login = () => {
  const [loginData, setLoginData] = useState({
    email: "",
    password: ""
  })
  const [loading, setLoading] = useState(false);
  const { loginUser } = userStore()
  const navigate = useNavigate();

   useEffect(() => {
      document.title = "CineWish – Login";
    }, []);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const res = await loginUser(loginData);
      if(res.success){
        toast.success(res.message)
        navigate("/")
      } else {
        toast.error(res.message)
      }
      await handleEnableNotifications();
    } catch (err) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  const handleEnableNotifications = async () => {
  try {
    // 1. Check if Service Workers are supported
    if (!('serviceWorker' in navigator)) {
       toast.error("Browser does not support service workers.");
       return;
    }

    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      toast.error("Notifications blocked by browser.");
      return;
    }

    // 2. Wait for registration
    const registration = await navigator.serviceWorker.ready;
    
    // 3. Ensure the pushManager exists
    if (!registration.pushManager) {
      // toast.error("Push messaging is not supported in this browser.");
      return;
    }

    // 4. Proceed with subscription
    let subscription = await registration.pushManager.getSubscription();

    if (!subscription) {
      subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array("BBGhZLprpWwS596bo9Jdj0Uvr5mHPT3wIuSjO6xFpf8gppnu1vJQ_1zyPv31zs_tN9nob01zLpmoN3jTZUYV61c"),
      });
    }

    await API.post("/push/subscribe", subscription);
    // toast.success("Push notifications enabled!");
    
  } catch (err) {
    console.error("FULL ERROR:", err); // Look at this in F12!
    // toast.error(`Failed: ${err.message}`);
  } 
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-950 to-black text-white px-4">
      <div className="w-full max-w-md bg-gray-900 p-8 rounded-2xl shadow-2xl border border-gray-800">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold">CineWish</h1>
          <p className="text-sm text-gray-400 mt-1">Manage and track all your favorite movies & TV shows</p>
        </div>
        <form className="flex flex-col space-y-5">
          <div>
            <label className="block text-sm mb-1 text-gray-300">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
              required
              value={loginData.email}
              onChange={(e)=> setLoginData({...loginData, email: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm mb-1 text-gray-300">Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
              required
              value={loginData.password}
              onChange={(e)=> setLoginData({...loginData, password: e.target.value})}
            />
          </div>
          <button
            type="submit"
            onClick={handleLogin}
            disabled={loading}
            className="w-full flex justify-center items-center bg-teal-500 hover:bg-teal-600 text-white font-semibold py-3 rounded-md transition duration-200"
          >
            {loading ? <div className="h-4 w-4 border-2 rounded-full border-white border-t-[transparent] animate-spin"></div> : "Login"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-400">
            Don’t have an account?{' '}
            <Link to="/register" className="text-teal-400 hover:underline">
              Register
            </Link>
          </p>
        </div>

        <div className="mt-4 text-center">
          <Link to="" className="text-xs text-gray-500 hover:text-teal-400">
            Forgot Password?
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
