import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => sessionStorage.getItem("token") || "");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Validate existing token on load
  useEffect(() => {
    const verifySession = async () => {
      const storedToken = sessionStorage.getItem("token");
      if (!storedToken) {
        setLoading(false);
        return;
      }

      try {
        const response = await api.get("/api/auth/me");
        if (response.data.success) {
          setUser(response.data.user);
          setToken(storedToken);
        } else {
          sessionStorage.removeItem("token");
          setToken("");
          setUser(null);
        }
      } catch (err) {
        console.warn("Session verification failed:", err.message);
        // If server is not responding or token expired, clear session
        sessionStorage.removeItem("token");
        setToken("");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    verifySession();
  }, []);

  const login = async (email, password) => {
    setError(null);
    try {
      const res = await api.post("/api/auth/login", { email, password });
      if (res.data.success && res.data.token) {
        // Store JWT token in session
        sessionStorage.setItem("token", res.data.token);
        setToken(res.data.token);
        setUser(res.data.user);
        return { success: true };
      }
      return { success: false, message: res.data.message || "Login failed" };
    } catch (err) {
      const msg = err.response?.data?.message || "Invalid credentials. Please try again.";
      setError(msg);
      return { success: false, message: msg };
    }
  };

  const register = async (name, email, password) => {
    setError(null);
    try {
      const res = await api.post("/api/auth/register", { name, email, password });
      if (res.data.success && res.data.token) {
        // Store JWT token in session
        sessionStorage.setItem("token", res.data.token);
        setToken(res.data.token);
        setUser(res.data.user);
        return { success: true };
      }
      return { success: false, message: res.data.message || "Registration failed" };
    } catch (err) {
      const msg = err.response?.data?.message || "Registration failed. Try again.";
      setError(msg);
      return { success: false, message: msg };
    }
  };

  const demoLogin = async () => {
    setError(null);
    try {
      const res = await api.post("/api/auth/demo");
      if (res.data.success && res.data.token) {
        sessionStorage.setItem("token", res.data.token);
        setToken(res.data.token);
        setUser(res.data.user);
        return { success: true };
      }
      return { success: false, message: "Demo login failed" };
    } catch (err) {
      const msg = err.response?.data?.message || "Could not connect to backend server. Make sure backend is running.";
      setError(msg);
      return { success: false, message: msg };
    }
  };

  const logout = () => {
    sessionStorage.removeItem("token");
    setToken("");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token && !!user,
        loading,
        error,
        login,
        register,
        demoLogin,
        logout,
        setError
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

