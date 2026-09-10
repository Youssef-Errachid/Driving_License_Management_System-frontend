import api from "../axios";

const authService = {
  login: (email, password) => {
    return api.post("/auth/login", { email, password });
  },
};

export default authService;
