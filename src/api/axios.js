import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/api",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    switch (status) {
      case 400:
        console.error("Bad Request: invalid data");
        break;

      case 401:
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        break;

      case 403:
        console.error("Forbidden");
        break;

      case 404:
        console.error("Not Found");
        break;

      case 500:
        console.error("Internal Server Error");
        break;

      default:
        console.error("API Error:", error);
    }

    return Promise.reject(error);
  },
);

export default api;
