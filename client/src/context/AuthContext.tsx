import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { User } from "../types";
import axiosInstance from "../api/axiosInstance";

interface AuthContextType {
  user: User | null;
  login: (token: string, userData: User) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext =
  createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [user, setUser] =
    useState<User | null>(null);

  const [isLoading, setIsLoading] =
    useState(true);

  // Restore session after refresh
  useEffect(() => {
    try {
      const token =
        localStorage.getItem("hero_token");

      const savedUser =
        localStorage.getItem("hero_user");

      if (token && savedUser) {
        const parsedUser: User =
          JSON.parse(savedUser);

        setUser(parsedUser);

        axiosInstance.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${token}`;
      }
    } catch (error) {
      console.error(
        "Session restore failed:",
        error
      );

      localStorage.removeItem("hero_token");
      localStorage.removeItem("hero_user");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Login or automatic login after signup
  const login = (
    token: string,
    userData: User
  ) => {
    localStorage.setItem(
      "hero_token",
      token
    );

    localStorage.setItem(
      "hero_user",
      JSON.stringify(userData)
    );

    axiosInstance.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${token}`;

    setUser(userData);
  };

  // Logout
  const logout = () => {
    localStorage.removeItem("hero_token");
    localStorage.removeItem("hero_user");

    delete axiosInstance.defaults.headers.common[
      "Authorization"
    ];

    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used within AuthProvider"
    );
  }

  return context;
};