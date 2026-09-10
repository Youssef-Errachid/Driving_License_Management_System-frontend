import { createContext, useContext, useState } from "react";
import authService from "../api/services/authService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem("user");

      return storedUser ? JSON.parse(storedUser) : null;
    } catch {
      localStorage.removeItem("user");
      return null;
    }
  });

  const login = async (email, password) => {
    const response = await authService.login(email, password);

    const { token, email: userEmail, role, fullName } = response.data.data;

    const userData = {
      email: userEmail,
      role,
      fullName,
    };

    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));

    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
