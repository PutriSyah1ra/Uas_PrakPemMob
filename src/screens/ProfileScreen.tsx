import React from 'react';
import { View, Text, StyleSheet, Image, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import colors from '../theme/colors';
import Button from '../components/Button';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const { items } = useWishlist();

  const handleLogout = () => {
    Alert.alert('Keluar Akun', 'Apakah Anda yakin ingin logout?', [
      { text: 'Batal', style: 'cancel' },
      { text: 'Keluar', style: 'destructive', onPress: logout },
    ]);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.container}>
        <View style={styles.hero}>
          <Image source={{ uri: user?.image }} style={styles.avatar} />
          <Text style={styles.name}>
            {user?.firstName} {user?.lastName}
          </Text>
          <Text style={styles.email}>{user?.email}</Text>
        </View>

        <View style={styles.body}>
          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{items.length}</Text>
              <Text style={styles.statLabel}>Wishlist</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{user?.username}</Text>
              <Text style={styles.statLabel}>Username</Text>
            </View>
          </View>

          <View style={styles.menu}>
            <View style={styles.menuItem}>
              <View style={styles.menuIconCircle}>
                <Ionicons name="person-outline" size={18} color={colors.primary} />
              </View>
              <Text style={styles.menuText}>Data akun disinkronkan dari API DummyJSON</Text>
            </View>
            <View style={styles.menuItem}>
              <View style={styles.menuIconCircle}>
                <Ionicons name="shield-checkmark-outline" size={18} color={colors.primary} />
              </View>
              <Text style={styles.menuText}>Transaksi aman antar sesama mahasiswa</Text>
            </View>
          </View>

          <Button
            title="Logout"
            onPress={handleLogout}
            variant="outline"
            icon={<Ionicons name="log-out-outline" size={18} color={colors.primary} />}
            style={styles.logoutBtn}
          />
        </View>
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
  hero: {
    backgroundColor: colors.primary,
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 44,
    borderBottomLeftRadius: 26,
    borderBottomRightRadius: 26,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 3,
    borderColor: colors.accent,
    marginBottom: 12,
  },
  name: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.textOnPrimary,
  },
  email: {
    fontSize: 13,
    color: colors.textOnPrimaryMuted,
    marginTop: 2,
  },
  body: {
    flex: 1,
    paddingHorizontal: 20,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: -28,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: colors.primaryDark,
    shadowOpacity: 0.12,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  statNumber: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.primary,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 4,
  },
  menu: {
    gap: 12,
    marginBottom: 24,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
  },
  menuIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(11,30,63,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuText: {
    flex: 1,
    fontSize: 13,
    color: colors.textMuted,
  },
  logoutBtn: {
    marginTop: 'auto',
    marginBottom: 8,
  },
});
