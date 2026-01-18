import axios from "axios";
import useUserStore from '../store/userStore';

// Setup your API instance
const API = axios.create({
  // baseURL: "https://cinewish-web.onrender.com/api",
  baseURL: "http://localhost:5000/api",
  withCredentials: true
});

// Add a response interceptor
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

