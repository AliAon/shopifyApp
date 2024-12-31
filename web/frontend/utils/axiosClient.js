import axios from "axios";
import { baseUrl } from "./constants";

const axiosClient = axios.create({
  baseURL: baseUrl,
  headers: {
    "ngrok-skip-browser-warning": 1,
  },
});

axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      config.headers.set("x-auth-token", token);
    }
    return config;
  },
  (error) => {
    // eslint-disable-next-line no-undef
    return Promise.reject(error);
  }
);

export default axiosClient;
