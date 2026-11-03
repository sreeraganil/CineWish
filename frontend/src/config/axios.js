import axios from "axios";
import useUserStore from '../store/userStore';

// Setup your API instance
const API = axios.create({
  baseURL: "https://cinewish-new.onrender.com/api",
  // baseURL: "http://localhost:5000/api",
  withCredentials: true
});

// Add a response interceptor

// Add a request interceptor to include JWT token if stored
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

API.interceptors.response.use(
  response => response, // ✅ Return the response normally if successful
  error => {
    if (error.response && error.response.status === 401) {
      const { logoutUser } = useUserStore.getState();
      logoutUser("Token expired, please login again");
    }

    // For other errors, just reject
    return Promise.reject(error);
  }
);

export default API;

