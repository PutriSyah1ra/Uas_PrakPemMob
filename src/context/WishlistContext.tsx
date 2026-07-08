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
import type { Product } from '../types';

const STORAGE_KEY = '@kampusmarket_wishlist';

interface WishlistContextValue {
  items: Product[];
  isReady: boolean;
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: number) => void;
  isInWishlist: (productId: number) => boolean;
  toggleWishlist: (product: Product) => void;
}

const WishlistContext = createContext<WishlistContextValue | null>(null);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<Product[]>([]);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (mounted && stored) setItems(JSON.parse(stored) as Product[]);
      } catch (err) {
        // abaikan jika storage kosong/corrupt
      } finally {
        if (mounted) setIsReady(true);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const persist = useCallback(async (next: Product[]) => {
    setItems(next);
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch (err) {
      // gagal simpan tidak menghentikan aplikasi
    }
  }, []);

  const addToWishlist = useCallback(
    (product: Product) => {
      setItems((prev) => {
        if (prev.some((p) => p.id === product.id)) return prev;
        const next = [...prev, product];
        persist(next);
        return next;
      });
    },
    [persist]
  );

  const removeFromWishlist = useCallback(
    (productId: number) => {
      setItems((prev) => {
        const next = prev.filter((p) => p.id !== productId);
        persist(next);
        return next;
      });
    },
    [persist]
  );

  const isInWishlist = useCallback(
    (productId: number) => items.some((p) => p.id === productId),
    [items]
  );

  const toggleWishlist = useCallback(
    (product: Product) => {
      if (isInWishlist(product.id)) {
        removeFromWishlist(product.id);
      } else {
        addToWishlist(product);
      }
    },
    [isInWishlist, addToWishlist, removeFromWishlist]
  );

  const value = useMemo<WishlistContextValue>(
    () => ({ items, isReady, addToWishlist, removeFromWishlist, isInWishlist, toggleWishlist }),
    [items, isReady, addToWishlist, removeFromWishlist, isInWishlist, toggleWishlist]
  );

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist(): WishlistContextValue {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error('useWishlist harus dipakai di dalam WishlistProvider');
  return ctx;
}
