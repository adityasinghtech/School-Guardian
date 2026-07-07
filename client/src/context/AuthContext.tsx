import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import api from '../services/api';

interface User {
  _id?: string;
  id?: string;
  name: string;
  email: string;
  role: string;
  profileImage?: string;
  schoolId?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<any>;
  register: (userData: any) => Promise<any>;
  logout: () => void;
  isAuthenticated: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  // Check auth status on mount
  useEffect(() => {
    const checkAuth = async () => {
      if (token) {
        try {
          const { data } = await api.get('/auth/profile');
          setUser(data.data);
          localStorage.setItem('user', JSON.stringify(data.data));
        } catch (error) {
          console.error('Auth verification failed', error);
          logout();
        }
      }
      setLoading(false);
    };
    checkAuth();
  }, [token]);

  const login = async (email: string, password: string) => {
    const { data } = await api.post('/auth/login', { email, password });
    const userData = data.data;
    
    // We expect the token to be inside userData.token
    setToken(userData.token);
    setUser(userData);
    
    localStorage.setItem('token', userData.token);
    localStorage.setItem('user', JSON.stringify(userData));
    return userData;
  };

  const registerUser = async (userData: any) => {
    const { data } = await api.post('/auth/register', userData);
    const newUserData = data.data;
    
    setToken(newUserData.token);
    setUser(newUserData);
    
    localStorage.setItem('token', newUserData.token);
    localStorage.setItem('user', JSON.stringify(newUserData));
    return newUserData;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  const value = {
    user,
    token,
    login,
    register: registerUser,
    logout,
    isAuthenticated: !!user,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
