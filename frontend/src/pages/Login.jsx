import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import userStore from "../store/userStore";

const Login = () => {
  const [loginData, setLoginData] = useState({
    email: "",
    password: ""
  })
  const { loginUser } = userStore()
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await loginUser(loginData);
      alert(res.message)
      if(res.success) navigate("/")
    } catch (err) {
      alert(err);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-950 to-black text-white px-4">
      <div className="w-full max-w-md bg-gray-900 p-8 rounded-2xl shadow-2xl border border-gray-800">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold">CineWish</h1>
          <p className="text-sm text-gray-400 mt-1">Track your movies & shows wishlist</p>
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
            className="w-full bg-teal-500 hover:bg-teal-600 text-white font-semibold py-3 rounded-md transition duration-200"
          >
            Login
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
