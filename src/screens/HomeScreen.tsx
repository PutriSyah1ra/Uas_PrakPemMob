import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { CompositeScreenProps } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import colors from '../theme/colors';
import InputField from '../components/InputField';
import ProductCard from '../components/ProductCard';
import CategoryChip from '../components/CategoryChip';
import StatusView from '../components/StatusView';
import { fetchProducts, fetchCategories } from '../api/productApi';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import useDebouncedValue from '../hooks/useDebouncedValue';
import type { HomeStackParamList, MainTabParamList, Product, FetchStatus } from '../types';

type Props = CompositeScreenProps<
  NativeStackScreenProps<HomeStackParamList, 'Home'>,
  BottomTabScreenProps<MainTabParamList>
>;

export default function HomeScreen({ navigation }: Props) {
  const { user } = useAuth();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [status, setStatus] = useState<FetchStatus>('loading');
  const [errorMessage, setErrorMessage] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const [searchText, setSearchText] = useState('');
  const debouncedSearch = useDebouncedValue(searchText, 300);
  const [selectedCategory, setSelectedCategory] = useState('all');

  const loadData = useCallback(async () => {
    setStatus('loading');
    setErrorMessage('');
    try {
      const [productList, categoryList] = await Promise.all([fetchProducts(), fetchCategories()]);
      setProducts(productList);
      setCategories(['all', ...categoryList]);
      setStatus('success');
    } catch (err) {
      setErrorMessage('Gagal mengambil data produk. Periksa koneksi internet Anda.');
      setStatus('error');
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  }, [loadData]);

  // Filtering memakai useMemo agar tidak menghitung ulang di setiap render
  // kecuali dependensi (produk, kata kunci, kategori) benar-benar berubah.
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch = product.title
        .toLowerCase()
        .includes(debouncedSearch.trim().toLowerCase());
      const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [products, debouncedSearch, selectedCategory]);

  const renderHeader = () => (
    <View>
      <View style={styles.heroSection}>
        <View style={styles.topBar}>
          <View>
            <Text style={styles.greeting}>
              Halo, {[user?.firstName, user?.lastName].filter(Boolean).join(' ') || 'Mahasiswa'} 👋
            </Text>
            <Text style={styles.subGreeting}>Cari barang bekas incaranmu di sini</Text>
          </View>
          <Image source={{ uri: user?.image }} style={styles.avatar} />
        </View>
      </View>

      <InputField
        placeholder="Cari produk, mis. laptop, buku..."
        value={searchText}
        onChangeText={setSearchText}
        leftIcon={<Ionicons name="search-outline" size={18} color={colors.textMuted} />}
        style={styles.searchInput}
      />

      {categories.length > 0 && (
        <FlatList
          data={categories}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item}
          contentContainerStyle={styles.categoryList}
          renderItem={({ item }) => (
            <CategoryChip
              label={item === 'all' ? 'Semua' : item}
              isActive={selectedCategory === item}
              onPress={() => setSelectedCategory(item)}
            />
          )}
        />
      )}

      <Text style={styles.resultCount}>{filteredProducts.length} produk ditemukan</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.container}>
        {status !== 'success' ? (
          <View style={styles.flex}>
            {renderHeader()}
            <StatusView status={status} errorMessage={errorMessage} onRetry={loadData} />
          </View>
        ) : (
          <FlatList
            data={filteredProducts}
            keyExtractor={(item) => String(item.id)}
            numColumns={2}
            ListHeaderComponent={renderHeader}
            contentContainerStyle={styles.listContent}
            columnWrapperStyle={styles.columnWrapper}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} colors={[colors.primary]} />
            }
            ListEmptyComponent={
              <StatusView status="empty" emptyText="Produk tidak ditemukan, coba kata kunci lain." />
            }
            renderItem={({ item }) => (
              <ProductCard
                product={item}
                onPress={() => navigation.navigate('ProductDetail', { productId: item.id })}
                onToggleWishlist={() => toggleWishlist(item)}
                isWishlisted={isInWishlist(item.id)}
              />
            )}
            initialNumToRender={8}
            maxToRenderPerBatch={8}
            windowSize={7}
            removeClippedSubviews
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  flex: { flex: 1 },
  listContent: {
    paddingHorizontal: 10,
    paddingBottom: 24,
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
  heroSection: {
    backgroundColor: colors.primary,
    borderBottomLeftRadius: 26,
    borderBottomRightRadius: 26,
    paddingBottom: 18,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  greeting: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.textOnPrimary,
  },
  subGreeting: {
    fontSize: 12,
    color: colors.textOnPrimaryMuted,
    marginTop: 2,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: colors.accent,
  },
  searchInput: {
    marginHorizontal: 16,
    marginTop: 16,
  },
  categoryList: {
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  resultCount: {
    fontSize: 12,
    color: colors.textMuted,
    paddingHorizontal: 16,
    marginBottom: 6,
  },
});
