import type { Product, RegisterFields } from '../types';

const BASE_URL = 'https://dummyjson.com';

interface FetchOptions {
  signal?: AbortSignal;
}

interface ProductsResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}

interface CategoryObject {
  slug: string;
  name: string;
  url: string;
}

export interface LoginResponse {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  gender: string;
  image: string;
  token?: string;
  accessToken?: string;
  refreshToken?: string;
}

export interface RegisterResponse {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    throw new Error(`Request gagal dengan status ${response.status}`);
  }
  return response.json() as Promise<T>;
}

// Ambil seluruh produk (limit besar supaya katalog cukup ramai)
export async function fetchProducts({ signal }: FetchOptions = {}): Promise<Product[]> {
  const response = await fetch(`${BASE_URL}/products?limit=100`, { signal });
  const data = await handleResponse<ProductsResponse>(response);
  return data.products ?? [];
}

// Ambil daftar kategori untuk filter
export async function fetchCategories({ signal }: FetchOptions = {}): Promise<string[]> {
  const response = await fetch(`${BASE_URL}/products/categories`, { signal });
  const data = await handleResponse<Array<string | CategoryObject>>(response);
  return Array.isArray(data)
    ? data.map((item) => (typeof item === 'string' ? item : item.slug))
    : [];
}

// Ambil detail satu produk berdasarkan id
export async function fetchProductById(id: number, { signal }: FetchOptions = {}): Promise<Product> {
  const response = await fetch(`${BASE_URL}/products/${id}`, { signal });
  return handleResponse<Product>(response);
}

// Simulasi login menggunakan endpoint auth bawaan DummyJSON
export async function loginRequest(username: string, password: string): Promise<LoginResponse> {
  const response = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password, expiresInMins: 60 }),
  });

  if (!response.ok) {
    throw new Error('Username atau password salah.');
  }
  return response.json();
}

// Simulasi pendaftaran akun baru (DummyJSON tidak benar-benar menyimpan
// data secara permanen, endpoint ini hanya mengembalikan objek user baru
// untuk keperluan simulasi pada MVP ini).
export async function registerRequest(fields: RegisterFields): Promise<RegisterResponse> {
  const response = await fetch(`${BASE_URL}/users/add`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(fields),
  });

  if (!response.ok) {
    throw new Error('Pendaftaran gagal, silakan coba lagi.');
  }
  return response.json();
}
