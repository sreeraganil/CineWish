import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import userStore from "../store/userStore";
import toast from "react-hot-toast";

const Register = () => {
  const [registerData, setRegisterData] = useState({
    username: "",
    email: "",
    password: ""
  });
  const [loading, setLoading] = useState(false);

  const { registerUser } = userStore();
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const res = await registerUser(registerData);
      if(res.success){
        toast.success(res.message)
        navigate("/login")
      } else {
        toast.error(res.message)
      }
    } catch (err) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-950 to-black text-white px-4">
      <div className="w-full max-w-md bg-gray-900 p-8 rounded-2xl shadow-2xl border border-gray-800">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold">CineWish</h1>
          <p className="text-sm text-gray-400 mt-1">
            Create your account to track movies & shows
          </p>
        </div>

        <form onSubmit={handleRegister} className="flex flex-col space-y-5">
          <div>
            <label className="block text-sm mb-1 text-gray-300">Name</label>
            <input
              type="text"
              placeholder="Enter your name"
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
              required
              value={registerData.username}
              onChange={(e) =>
                setRegisterData({ ...registerData, username: e.target.value })
              }
            />
          </div>

          <div>
            <label className="block text-sm mb-1 text-gray-300">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
              required
              value={registerData.email}
              onChange={(e) =>
                setRegisterData({ ...registerData, email: e.target.value })
              }
            />
          </div>

          <div>
            <label className="block text-sm mb-1 text-gray-300">Password</label>
            <input
              type="password"
              placeholder="Create a password"
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
              required
              value={registerData.password}
              onChange={(e) =>
                setRegisterData({ ...registerData, password: e.target.value })
              }
            />
          </div>

          <button
            type="submit"
            className="w-full flex justify-center items-center bg-teal-500 hover:bg-teal-600 text-white font-semibold py-3 rounded-md transition duration-200"
          >
            {loading ? <div className="h-4 w-4 border-2 rounded-full border-white border-t-[transparent] animate-spin"></div> : "Register"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-400">
            Already have an account?{" "}
            <Link to="/login" className="text-teal-400 hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
