import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, FlatList, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import colors from '../theme/colors';
import StatusView from '../components/StatusView';
import Button from '../components/Button';
import { fetchProductById } from '../api/productApi';
import { useWishlist } from '../context/WishlistContext';
import type { HomeStackParamList, Product, FetchStatus } from '../types';

const { width } = Dimensions.get('window');

type Props = NativeStackScreenProps<HomeStackParamList, 'ProductDetail'>;

export default function ProductDetailScreen({ route, navigation }: Props) {
  const { productId } = route.params;
  const { toggleWishlist, isInWishlist } = useWishlist();

  const [product, setProduct] = useState<Product | null>(null);
  const [status, setStatus] = useState<FetchStatus>('loading');
  const [errorMessage, setErrorMessage] = useState('');

  const loadDetail = useCallback(async () => {
    setStatus('loading');
    try {
      const data = await fetchProductById(productId);
      setProduct(data);
      setStatus('success');
    } catch (err) {
      setErrorMessage('Gagal memuat detail produk.');
      setStatus('error');
    }
  }, [productId]);

  useEffect(() => {
    loadDetail();
  }, [loadDetail]);

  useEffect(() => {
    if (product) {
      navigation.setOptions({ title: product.title });
    }
  }, [product, navigation]);

  if (status !== 'success' || !product) {
    return (
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <StatusView status={status} errorMessage={errorMessage} onRetry={loadDetail} />
      </SafeAreaView>
    );
  }

  const discountedPrice =
    product.discountPercentage > 0
      ? (product.price * (1 - product.discountPercentage / 100)).toFixed(2)
      : null;
  const wishlisted = isInWishlist(product.id);
  const galleryImages = product.images?.length ? product.images : [product.thumbnail];

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <FlatList
          data={galleryImages}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item, index) => `${item}-${index}`}
          renderItem={({ item }) => (
            <Image source={{ uri: item }} style={styles.heroImage} resizeMode="cover" />
          )}
        />

        <View style={styles.body}>
          <View style={styles.badgeRow}>
            <Text style={styles.categoryBadge}>{product.category}</Text>
            <Text style={styles.brandText}>{product.brand ?? 'Tanpa merek'}</Text>
          </View>

          <Text style={styles.title}>{product.title}</Text>

          <View style={styles.ratingRow}>
            <Ionicons name="star" size={16} color={colors.accent} />
            <Text style={styles.ratingText}>{product.rating} rating</Text>
            <Text style={styles.dot}>•</Text>
            <Text style={styles.stockText}>
              {product.stock > 0 ? `Stok tersedia: ${product.stock}` : 'Stok habis'}
            </Text>
          </View>

          <View style={styles.priceRow}>
            <Text style={styles.price}>${discountedPrice ?? product.price}</Text>
            {discountedPrice ? (
              <>
                <Text style={styles.oldPrice}>${product.price}</Text>
                <View style={styles.discountBadge}>
                  <Text style={styles.discountText}>
                    -{Math.round(product.discountPercentage)}%
                  </Text>
                </View>
              </>
            ) : null}
          </View>

          <Text style={styles.sectionTitle}>Deskripsi</Text>
          <Text style={styles.description}>{product.description}</Text>

          {product.warrantyInformation || product.shippingInformation ? (
            <View style={styles.infoBox}>
              {product.warrantyInformation ? (
                <View style={styles.infoRow}>
                  <Ionicons name="shield-checkmark-outline" size={16} color={colors.primary} />
                  <Text style={styles.infoText}>{product.warrantyInformation}</Text>
                </View>
              ) : null}
              {product.shippingInformation ? (
                <View style={styles.infoRow}>
                  <Ionicons name="cube-outline" size={16} color={colors.primary} />
                  <Text style={styles.infoText}>{product.shippingInformation}</Text>
                </View>
              ) : null}
            </View>
          ) : null}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          title={wishlisted ? 'Hapus dari Wishlist' : 'Tambah ke Wishlist'}
          onPress={() => toggleWishlist(product)}
          variant={wishlisted ? 'outline' : 'primary'}
          icon={
            <Ionicons
              name={wishlisted ? 'heart' : 'heart-outline'}
              size={18}
              color={wishlisted ? colors.primary : colors.white}
            />
          }
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingBottom: 16,
  },
  heroImage: {
    width,
    height: 280,
    backgroundColor: colors.primaryLight,
  },
  body: {
    padding: 20,
  },
  badgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryBadge: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.accentDark,
    textTransform: 'uppercase',
  },
  brandText: {
    fontSize: 12,
    color: colors.textMuted,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.textDark,
    marginBottom: 8,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 14,
  },
  ratingText: {
    fontSize: 13,
    color: colors.textMuted,
  },
  dot: {
    color: colors.textMuted,
    marginHorizontal: 4,
  },
  stockText: {
    fontSize: 13,
    color: colors.textMuted,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 20,
  },
  price: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.primary,
  },
  oldPrice: {
    fontSize: 14,
    color: colors.textMuted,
    textDecorationLine: 'line-through',
  },
  discountBadge: {
    backgroundColor: colors.danger,
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  discountText: {
    color: colors.white,
    fontSize: 11,
    fontWeight: '700',
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textDark,
    marginBottom: 6,
  },
  description: {
    fontSize: 14,
    color: colors.textMuted,
    lineHeight: 21,
    marginBottom: 16,
  },
  infoBox: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 14,
    gap: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  infoText: {
    flex: 1,
    fontSize: 12,
    color: colors.textMuted,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.surface,
  },
});
