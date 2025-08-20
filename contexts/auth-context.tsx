"use client";

import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import type { AuthContextType, User } from "@/types/auth";
import { setAccessToken, injectAuthService, api } from "@/lib/api";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const authService = {
  logout: () => {},
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const login = useCallback(async (accessToken: string) => {
    try {
      // Set the token for future API calls
      setAccessToken(accessToken);

      // Fetch the full user data
      const response = await api('/api/auth/session');
      if (!response.ok) {
        throw new Error('Failed to fetch user session');
      }
      const userData = await response.json();
      setUser(userData);
    } catch (error) {
      console.error("Login process failed:", error);
      // Clear out everything if session fetch fails
      setAccessToken(null);
      setUser(null);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await api('/api/auth/logout', { method: 'POST' });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setAccessToken(null);
      setUser(null);
    }
  }, []);

  useEffect(() => {
    injectAuthService({ logout });

    const initializeAuth = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/api/auth/refresh', { method: 'POST' });
        if (response.ok) {
          const { accessToken } = await response.json();
          await login(accessToken); // Use the login flow to set user
        } else {
          setAccessToken(null);
          setUser(null);
        }
      } catch (error) {
        console.error('Initial auth error:', error);
        setAccessToken(null);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, [login, logout]);

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
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
