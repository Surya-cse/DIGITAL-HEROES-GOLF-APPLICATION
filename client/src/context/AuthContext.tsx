import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext<any>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  // Persistence: Read from localStorage on startup
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('hero_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [isLoading, setIsLoading] = useState(false);

  const login = (token: string, userData: any) => {
    localStorage.setItem('hero_token', token);
    localStorage.setItem('hero_user', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('hero_token');
    localStorage.removeItem('hero_user');
    setUser(null);
    window.location.href = '/'; // Clean redirect
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);