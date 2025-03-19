import React, { createContext, useContext, useEffect, useState } from "react";

interface User {
  id: number;
  username: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  loginUser: (userData: User) => Promise<void>;
  logoutUser: () => void;
  setUser: (user: User | null) => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    try {
      const storedUser = sessionStorage.getItem("user");
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error("Error parsing stored user:", error);
      sessionStorage.removeItem("user");
      setIsAuthenticated(false);
    }
  }, []);

  const loginUser = async (userData: User) => {
    try {
      setUser(userData);
      setIsAuthenticated(true);
      sessionStorage.setItem("user", JSON.stringify(userData));
    } catch (error) {
      console.error("Error during login:", error);
      setIsAuthenticated(false);
      throw error;
    }
  };

  const logoutUser = () => {
    setUser(null);
    setIsAuthenticated(false);
    sessionStorage.removeItem("user");
  };

  const value = {
    user,
    loginUser,
    logoutUser,
    isAuthenticated,
    setUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}