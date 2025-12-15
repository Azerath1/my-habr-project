// frontend-next/src/contexts/AuthContext.tsx
"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface AuthContextType {
  isAuthenticated: boolean;
  username: string | null;
  setUser: (token: string, username: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const initialToken =
  typeof window !== "undefined" ? localStorage.getItem("token") : null;
const initialUsername =
  typeof window !== "undefined" ? localStorage.getItem("username") : null;

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(!!initialToken);
  const [username, setUsername] = useState<string | null>(initialUsername);

  const setUser = (token: string, user: string) => {
    localStorage.setItem("token", token);
    localStorage.setItem("username", user);
    setIsAuthenticated(true);
    setUsername(user);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    setIsAuthenticated(false);
    setUsername(null);
    window.location.href = "/";
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, username, setUser, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
