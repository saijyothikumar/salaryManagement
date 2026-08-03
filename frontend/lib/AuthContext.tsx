'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { AuthUser } from './api';

type AuthContextType = {
  user: AuthUser | null;
  token: string | null;
  isHRManager: boolean;
  isLoginOpen: boolean;
  openLogin: () => void;
  closeLogin: () => void;
  loginSuccess: (user: AuthUser, token: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  isHRManager: false,
  isLoginOpen: false,
  openLogin: () => {},
  closeLogin: () => {},
  loginSuccess: () => {},
  logout: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  useEffect(() => {
    try {
      const storedToken = localStorage.getItem('acme_hr_token');
      const storedUser = localStorage.getItem('acme_hr_user');
      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      }
    } catch (e) {
      console.error('Failed to load session from localStorage:', e);
    }
  }, []);

  const loginSuccess = (authUser: AuthUser, authToken: string) => {
    setUser(authUser);
    setToken(authToken);
    setIsLoginOpen(false);
    try {
      localStorage.setItem('acme_hr_token', authToken);
      localStorage.setItem('acme_hr_user', JSON.stringify(authUser));
    } catch (e) {
      console.error('Failed to save session to localStorage:', e);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    try {
      localStorage.removeItem('acme_hr_token');
      localStorage.removeItem('acme_hr_user');
    } catch (e) {
      console.error('Failed to clear session from localStorage:', e);
    }
  };

  const isHRManager = user?.role === 'hr_manager';

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isHRManager,
        isLoginOpen,
        openLogin: () => setIsLoginOpen(true),
        closeLogin: () => setIsLoginOpen(false),
        loginSuccess,
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
