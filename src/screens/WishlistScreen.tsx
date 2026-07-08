import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import colors from '../theme/colors';
import ProductCard from '../components/ProductCard';
import StatusView from '../components/StatusView';
import { useWishlist } from '../context/WishlistContext';
import type { MainTabParamList } from '../types';

type WishlistNavProp = BottomTabNavigationProp<MainTabParamList, 'WishlistTab'>;

export default function WishlistScreen() {
  const { items, removeFromWishlist } = useWishlist();
  const navigation = useNavigation<WishlistNavProp>();

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerRow}>
            <View style={styles.headerIconCircle}>
              <Ionicons name="heart" size={20} color={colors.accent} />
            </View>
            <View>
              <Text style={styles.title}>Wishlist Saya</Text>
              <Text style={styles.subtitle}>{items.length} barang tersimpan</Text>
            </View>
          </View>
        </View>

        <FlatList
          data={items}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <StatusView status="empty" emptyText="Belum ada produk di wishlist. Yuk jelajahi katalog!" />
          }
          renderItem={({ item }) => (
            <ProductCard
              product={item}
              layout="list"
              onPress={() =>
                navigation.navigate('HomeTab', {
                  screen: 'ProductDetail',
                  params: { productId: item.id },
                })
              }
              onToggleWishlist={() => removeFromWishlist(item.id)}
              isWishlisted
            />
          )}
        />
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
  header: {
    backgroundColor: colors.primary,
    borderBottomLeftRadius: 26,
    borderBottomRightRadius: 26,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 22,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerIconCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(244,183,64,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.textOnPrimary,
  },
  subtitle: {
    fontSize: 12,
    color: colors.textOnPrimaryMuted,
    marginTop: 2,
  },
  listContent: {
    paddingHorizontal: 10,
    paddingTop: 14,
    paddingBottom: 24,
  },
});
