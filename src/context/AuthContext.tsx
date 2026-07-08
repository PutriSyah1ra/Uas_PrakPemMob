import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useCallback,
  type ReactNode,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { loginRequest, registerRequest } from '../api/productApi';
import type { AuthUser, RegisterFields } from '../types';

const STORAGE_KEY = '@kampusmarket_user';

// Akun demo lokal — supaya bisa dipakai login tanpa bergantung pada akun
// yang terdaftar di API DummyJSON (yang tidak mengenal username custom).
const DEMO_USERNAME = 'cirasahira';
const DEMO_PASSWORD = '12345678';
const DEMO_USER: AuthUser = {
  id: 0,
  username: DEMO_USERNAME,
  firstName: 'Cira',
  lastName: 'Sahira',
  email: 'cirasahira@kampusmarket.app',
  image: 'https://api.dicebear.com/7.x/initials/png?seed=Cira%20Sahira',
  token: 'demo-local-token',
};

interface AuthContextValue {
  user: AuthUser | null;
  isRestoring: boolean;
  isSubmitting: boolean;
  login: (username: string, password: string) => Promise<AuthUser>;
  register: (fields: RegisterFields) => Promise<unknown>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isRestoring, setIsRestoring] = useState(true); // cek sesi tersimpan saat app dibuka
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Coba pulihkan sesi login dari penyimpanan lokal
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (mounted && stored) {
          setUser(JSON.parse(stored) as AuthUser);
        }
      } catch (err) {
        // gagal membaca storage tidak fatal, cukup abaikan
      } finally {
        if (mounted) setIsRestoring(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const login = useCallback(async (username: string, password: string) => {
    setIsSubmitting(true);
    try {
      if (username === DEMO_USERNAME && password === DEMO_PASSWORD) {
        setUser(DEMO_USER);
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(DEMO_USER));
        return DEMO_USER;
      }
      const result = await loginRequest(username, password);
      const userData: AuthUser = {
        id: result.id,
        username: result.username,
        firstName: result.firstName,
        lastName: result.lastName,
        email: result.email,
        image: result.image,
        token: result.accessToken || result.token,
      };
      setUser(userData);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
      return userData;
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  const register = useCallback(async (fields: RegisterFields) => {
    setIsSubmitting(true);
    try {
      return await registerRequest(fields);
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setUser(null);
    await AsyncStorage.removeItem(STORAGE_KEY);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({ user, isRestoring, isSubmitting, login, register, logout }),
    [user, isRestoring, isSubmitting, login, register, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth harus dipakai di dalam AuthProvider');
  return ctx;
}
