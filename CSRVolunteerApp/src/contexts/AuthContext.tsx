import React, {createContext, useContext, useEffect, useState, ReactNode} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {User, LoginRequest} from '../types';
import ApiService from '../services/api';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => Promise<void>;
  register: (userData: {
    username: string;
    email: string;
    password: string;
    role: string;
  }) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({children}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const isAuth = await ApiService.isAuthenticated();
      if (isAuth) {
        const userData = await ApiService.getProfile();
        setUser(userData);
      }
    } catch (error) {
      console.log('Auth check failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (credentials: LoginRequest) => {
    try {
      const response = await ApiService.login(credentials);
      await AsyncStorage.setItem('auth_token', response.token);
      await AsyncStorage.setItem('user_data', JSON.stringify(response.user));
      setUser(response.user);
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await ApiService.logout();
      setUser(null);
    } catch (error) {
      console.log('Logout error:', error);
    }
  };

  const register = async (userData: {
    username: string;
    email: string;
    password: string;
    role: string;
  }) => {
    try {
      console.log('AuthContext: Attempting registration...');
      const newUser = await ApiService.register(userData);
      console.log('AuthContext: Registration successful:', newUser);
      // After registration, user needs to login
      return newUser;
    } catch (error) {
      console.log('AuthContext: Registration error:', error);
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout,
    register,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
