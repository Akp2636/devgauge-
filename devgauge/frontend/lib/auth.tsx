'use client';
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { api, setToken, removeToken } from './api';

interface User {
  _id: string;
  fullName: string;
  email: string;
  role: 'candidate' | 'recruiter';
  rating: { score: number; rank: string };
  skills: string[];
  bio: string;
  github: string;
  company: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: object) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = async () => {
    try {
      const data = await api.me();
      setUser(data.user);
    } catch {
      setUser(null);
      removeToken();
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('dg_token');
    if (token) {
      refreshUser().finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    const data = await api.login({ email, password });
    setToken(data.token);
    setUser(data.user);
  };

  const register = async (formData: object) => {
    const data = await api.register(formData);
    setToken(data.token);
    setUser(data.user);
  };

  const logout = () => {
    removeToken();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
