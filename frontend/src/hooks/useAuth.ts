import { useState, useCallback } from "react";
import { authAPI } from "../services/api";

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const checkAuth = useCallback(async () => {
    try {
      await authAPI.checkAuth();
      setIsAuthenticated(true);
    } catch {
      setIsAuthenticated(false);
    }
  }, []);

  const login = useCallback(async () => {
    try {
      await authAPI.login(username, password);
      setIsAuthenticated(true);
      return true;
    } catch {
      alert("Invalid credentials");
      return false;
    }
  }, [username, password]);

  const register = useCallback(async () => {
    try {
      await authAPI.register(username, password);
      await login();
      return true;
    } catch {
      alert("Registration failed");
      return false;
    }
  }, [username, password, login]);

  const logout = useCallback(async () => {
    try {
      await authAPI.logout();
      setIsAuthenticated(false);
      setUsername("");
      setPassword("");
      return true;
    } catch {
      alert("Logout failed");
      return false;
    }
  }, []);

  return {
    isAuthenticated,
    setIsAuthenticated,
    username,
    setUsername,
    password,
    setPassword,
    checkAuth,
    login,
    register,
    logout,
  };
};
