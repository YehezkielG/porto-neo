import { createContext, useContext, useState, useEffect, type PropsWithChildren } from 'react';
import { LogoutApi } from '../api/backendApi';
import type { AdminUser } from '../types';

interface AuthContextValue {
  token: string | null;
  user: AdminUser | null;
  login: (newToken: string, userData: AdminUser) => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: PropsWithChildren) => {
  // 1. Ambil token dari localStorage saat pertama kali dimuat
  const [token, setToken] = useState(() => {
    if (typeof window !== 'undefined' && localStorage.getItem('token')) {
      return localStorage.getItem('token');
    }
    return null;
  });

  // 2. Ambil data user dari localStorage
  const [user, setUser] = useState(() => {
    if (typeof window !== 'undefined' && localStorage.getItem('user')) {
      try {
        const storedUser = localStorage.getItem('user');
        return storedUser ? (JSON.parse(storedUser) as AdminUser) : null;
      } catch (e) {
        return null;
      }
    }
    return null;
  });

  // 3. Fungsi saat login berhasil
  const login = (newToken: string, userData: AdminUser) => {
    setToken(newToken);
    setUser(userData);
  };

  // 4. Fungsi saat logout
  const logout = async () => {
    try {
      await LogoutApi(token);
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Bersihkan data sesi dari browser
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setToken(null);
      setUser(null);
    }
  };

  // 5. Simpan perubahan token ke localStorage
  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
    }
  }, [token]);

  // 6. Simpan perubahan user ke localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    }
  }, [user]);

  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom Hook agar mudah dipanggil di komponen lain
export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside AuthProvider.');
  return context;
};
