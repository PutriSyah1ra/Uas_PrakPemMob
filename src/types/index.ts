import type { NavigatorScreenParams } from '@react-navigation/native';

// Bentuk data produk sesuai respons DummyJSON (https://dummyjson.com/products)
export interface Product {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand?: string;
  thumbnail: string;
  images: string[];
  warrantyInformation?: string;
  shippingInformation?: string;
}

// Bentuk data user hasil simulasi login DummyJSON (/auth/login)
export interface AuthUser {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  image: string;
  token?: string;
}

export type RegisterFields = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};

// Status pengambilan data dari API, dipakai StatusView & screens
export type FetchStatus = 'loading' | 'success' | 'error' | 'empty';

// ---------- Navigation Param Lists ----------

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

export type HomeStackParamList = {
  Home: undefined;
  ProductDetail: { productId: number };
};

export type MainTabParamList = {
  HomeTab: NavigatorScreenParams<HomeStackParamList>;
  WishlistTab: undefined;
  ProfileTab: undefined;
};
