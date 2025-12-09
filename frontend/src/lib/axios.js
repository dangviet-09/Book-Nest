import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "http://localhost:3000/api",
  withCredentials: true,
});

// Add request interceptor to use simple requests (avoid preflight)
axiosInstance.interceptors.request.use(
  (config) => {
    // Use simple content types to avoid preflight
    if (config.method === "post" || config.method === "put") {
      // Use form-encoded data instead of JSON to avoid preflight
      if (config.data && typeof config.data === "object") {
        const formData = new URLSearchParams();
        Object.keys(config.data).forEach((key) => {
          formData.append(key, config.data[key]);
        });
        config.data = formData;
        config.headers["Content-Type"] = "application/x-www-form-urlencoded";
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
export default axiosInstance;
