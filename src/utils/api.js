import axios from "axios";

const api = axios.create({
  baseURL: "https://dev.waveplusit.com/api", // Set your base URL
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor
api.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem("user")); // Parse the user object from localStorage
    if (user && user.authorization && user.authorization.token) {
      // Check if the token exists
      config.headers.Authorization = `Bearer ${user.authorization.token}`; // Set the Bearer token
    }
    return config; // Return the modified config
  },
  (error) => {
    return Promise.reject(error); // Handle the error
  }
);

export default api;
