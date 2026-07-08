import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../theme/colors';
import Button from './Button';
import type { FetchStatus } from '../types';

interface StatusViewProps {
  status: FetchStatus;
  errorMessage?: string;
  onRetry?: () => void;
  emptyText?: string;
}

// Komponen reusable untuk menampilkan status pengambilan data dari API:
// loading (sedang memuat), error (gagal, dengan tombol coba lagi), atau
// empty (data kosong). Dipakai di halaman Katalog & Detail Produk.
export default function StatusView({
  status,
  errorMessage,
  onRetry,
  emptyText = 'Data tidak ditemukan.',
}: StatusViewProps) {
  if (status === 'loading') {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.message}>Sedang memuat data...</Text>
      </View>
    );
  }

  if (status === 'error') {
    return (
      <View style={styles.center}>
        <Ionicons name="cloud-offline-outline" size={40} color={colors.danger} />
        <Text style={styles.message}>
          {errorMessage || 'Gagal memuat data. Periksa koneksi internet Anda.'}
        </Text>
        {onRetry ? (
          <Button title="Coba Lagi" onPress={onRetry} variant="outline" style={styles.retryBtn} />
        ) : null}
      </View>
    );
  }

  if (status === 'empty') {
    return (
      <View style={styles.center}>
        <Ionicons name="search-outline" size={40} color={colors.textMuted} />
        <Text style={styles.message}>{emptyText}</Text>
      </View>
    );
  }

  return null;
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingVertical: 60,
  },
  message: {
    marginTop: 12,
    fontSize: 14,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 20,
  },
  retryBtn: {
    marginTop: 16,
    minWidth: 140,
  },
});
