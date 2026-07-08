import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../theme/colors';
import type { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onPress: () => void;
  onToggleWishlist?: () => void;
  isWishlisted?: boolean;
  layout?: 'grid' | 'list';
}

// Kartu produk reusable — dipakai di katalog (grid) maupun wishlist (list).
export default function ProductCard({
  product,
  onPress,
  onToggleWishlist,
  isWishlisted,
  layout = 'grid',
}: ProductCardProps) {
  const discountedPrice =
    product.discountPercentage > 0
      ? (product.price * (1 - product.discountPercentage / 100)).toFixed(2)
      : null;

  return (
    <TouchableOpacity
      style={[styles.card, layout === 'list' && styles.cardList]}
      onPress={onPress}
      activeOpacity={0.85}
    >
      <View style={[styles.imageWrapper, layout === 'list' && styles.imageWrapperList]}>
        <Image source={{ uri: product.thumbnail }} style={styles.image} resizeMode="cover" />
        {onToggleWishlist ? (
          <TouchableOpacity style={styles.wishlistBtn} onPress={onToggleWishlist} hitSlop={8}>
            <Ionicons
              name={isWishlisted ? 'heart' : 'heart-outline'}
              size={18}
              color={isWishlisted ? colors.danger : colors.primary}
            />
          </TouchableOpacity>
        ) : null}
      </View>

      <View style={styles.info}>
        <Text style={styles.category}>{product.category}</Text>
        <Text style={styles.title} numberOfLines={2}>
          {product.title}
        </Text>
        <View style={styles.priceRow}>
          <Text style={styles.price}>${discountedPrice ?? product.price}</Text>
          {discountedPrice ? <Text style={styles.oldPrice}>${product.price}</Text> : null}
        </View>
        <View style={styles.ratingRow}>
          <Ionicons name="star" size={13} color={colors.accent} />
          <Text style={styles.ratingText}>{product.rating}</Text>
          <Text style={styles.stockText}>
            {product.stock > 0 ? `Stok ${product.stock}` : 'Habis'}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 16,
    margin: 6,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  cardList: {
    flexDirection: 'row',
    margin: 6,
  },
  imageWrapper: {
    width: '100%',
    height: 120,
    backgroundColor: colors.background,
  },
  imageWrapperList: {
    width: 100,
    height: 100,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  wishlistBtn: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 6,
  },
  info: {
    flex: 1,
    padding: 10,
  },
  category: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.accentDark,
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  title: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textDark,
    marginBottom: 6,
    minHeight: 34,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  price: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.primary,
  },
  oldPrice: {
    fontSize: 12,
    color: colors.textMuted,
    textDecorationLine: 'line-through',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 12,
    color: colors.textMuted,
    marginRight: 8,
  },
  stockText: {
    fontSize: 11,
    color: colors.textMuted,
  },
});
