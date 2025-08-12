import axios from "axios";
import logoutUser from '../store/userStore';

// Setup your API instance
const API = axios.create({
  baseURL: "https://cinewish-web.onrender.com/api",
  withCredentials: true
});

// Add a response interceptor
API.interceptors.response.use(
  response => response, // ✅ Return the response normally if successful
  error => {
    if (error.response && error.response.status === 401) {
      logoutUser("Your token has been expired, Please login")
    }

    // For other errors, just reject
    return Promise.reject(error);
  }
);

export default API;

