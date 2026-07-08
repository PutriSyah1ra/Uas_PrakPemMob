# KampusMarket 🛍️

MVP aplikasi marketplace jual-beli barang bekas mahasiswa, dibangun dengan
**Expo (React Native) + TypeScript** dan data dari API publik **DummyJSON**
(`https://dummyjson.com`). Tema visual: **Navy + Gold**.

## Cara Menjalankan

```bash
npm install
npx expo start
```

Lalu scan QR code dengan aplikasi **Expo Go** (Android/iOS), atau tekan `a`
untuk membuka emulator Android / `i` untuk simulator iOS.

## Akun Demo (Login)

Login menggunakan akun demo lokal berikut (tidak bergantung pada database
DummyJSON, jadi selalu bisa dipakai):

| Username    | Password    |
|-------------|-------------|
| cirasahira  | 12345678    |

Halaman **Daftar Akun** tetap berfungsi penuh (validasi nama, format email,
panjang password) dan mengirim data ke endpoint simulasi `POST /users/add`,
namun karena DummyJSON adalah API publik tanpa database sungguhan, akun baru
tidak bisa dipakai untuk login — silakan gunakan akun demo di atas.

## Struktur Folder

```
KampusMarket/
├── App.tsx                          # Entry point, bungkus provider & navigator
├── tsconfig.json                    # Konfigurasi TypeScript
├── src/
│   ├── types/index.ts               # Semua tipe: Product, AuthUser, Navigation ParamList
│   ├── api/productApi.ts            # Semua pemanggilan ke DummyJSON (typed)
│   ├── components/                  # Komponen reusable
│   │   ├── Button.tsx
│   │   ├── InputField.tsx
│   │   ├── ProductCard.tsx
│   │   ├── CategoryChip.tsx
│   │   └── StatusView.tsx
│   ├── context/
│   │   ├── AuthContext.tsx          # State login, simulasi, AsyncStorage
│   │   └── WishlistContext.tsx      # State wishlist/keranjang
│   ├── hooks/useDebouncedValue.ts   # Hook debounce generic untuk search
│   ├── navigation/
│   │   ├── RootNavigator.tsx        # Auth flow vs Main flow
│   │   ├── AuthNavigator.tsx        # Login, Register
│   │   ├── MainTabNavigator.tsx     # Tab: Home, Wishlist, Profil
│   │   └── HomeStackNavigator.tsx   # Home -> Detail Produk
│   ├── screens/
│   │   ├── LoginScreen.tsx
│   │   ├── RegisterScreen.tsx
│   │   ├── HomeScreen.tsx           # Katalog + search + filter
│   │   ├── ProductDetailScreen.tsx
│   │   ├── WishlistScreen.tsx
│   │   └── ProfileScreen.tsx
│   └── theme/colors.ts              # Palet warna navy + gold
```

Seluruh project sudah divalidasi dengan `npx tsc --noEmit` tanpa error, termasuk
tipe navigasi (params antar layar dicek otomatis oleh TypeScript) dan tipe data
`Product`/`AuthUser` sesuai struktur respons DummyJSON.

## Pemetaan Ketentuan Tugas

| # | Ketentuan | Implementasi |
|---|-----------|---------------|
| 1 | Layout (Flexbox) | Seluruh `StyleSheet` memakai Flexbox (`flex`, `flexDirection`, dsb) sehingga responsif di berbagai ukuran layar HP. Halaman: Login, Katalog (Home), Detail Produk. |
| 2 | Komponen reusable | `Button`, `InputField`, `ProductCard`, `CategoryChip`, `StatusView` (5 komponen, melebihi minimum 3). |
| 3 | Lists | `FlatList` dipakai di Katalog (grid 2 kolom + `RefreshControl`), Wishlist, filter kategori horizontal, dan gambar produk di Detail. Dioptimalkan dengan `initialNumToRender`, `windowSize`, `removeClippedSubviews`. |
| 4 | State & Hooks | `useState`, `useEffect`, `useMemo`, `useCallback`, custom hook `useDebouncedValue` untuk pencarian real-time tanpa lag, filter kategori dengan state terpisah. |
| 5 | Form | `LoginScreen` & `RegisterScreen` memvalidasi field kosong, format email (regex), dan panjang password sebelum submit, lengkap dengan pesan error inline. |
| 6 | Navigasi | Bottom Tab (`Home`, `Wishlist`, `Profil`) dari `@react-navigation/bottom-tabs`, Home berisi Stack Navigator ke Detail Produk. `RootNavigator` memaksa user login dulu (cek `AuthContext.user`) sebelum tab utama bisa diakses. |
| 7 | API | `src/api/productApi.js` mengambil data dari `dummyjson.com/products`. Status ditampilkan jelas via komponen `StatusView`: **loading** (spinner + teks), **success** (data tampil), **error** (pesan + tombol "Coba Lagi") — dibungkus try/catch agar aplikasi tidak crash. |

## Teknologi

- Expo SDK 51
- React Navigation (Native Stack + Bottom Tabs)
- Context API + AsyncStorage (persist sesi login & wishlist)
- Ionicons (`@expo/vector-icons`)
- DummyJSON REST API

## Catatan

- Data produk & kategori diambil real-time dari internet, pastikan perangkat
  terhubung ke internet saat menjalankan aplikasi.
- Wishlist dan sesi login disimpan lokal dengan `AsyncStorage` sehingga tetap
  ada walau aplikasi ditutup.
