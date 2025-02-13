'use client';

import { createContext, useContext, ReactNode } from 'react';

interface User {
  username: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

// Sabit kullanıcı verisi
const defaultUser: User = {
  username: 'Demo Kullanıcı',
  email: 'demo@upcyman.com',
  role: 'admin'
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  // Basitleştirilmiş auth fonksiyonları
  const login = async (email: string, password: string) => {
    // Otomatik giriş, hiçbir kontrol yapmadan
    console.log('Giriş yapıldı:', { email, password });
  };

  const logout = () => {
    // Çıkış işlemi şimdilik sadece console'a log basacak
    console.log('Çıkış yapıldı');
  };

  const value = {
    user: defaultUser, // Her zaman giriş yapmış olarak göster
    login,
    logout,
    isAuthenticated: true // Her zaman true
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 