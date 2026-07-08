import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import colors from '../theme/colors';
import InputField from '../components/InputField';
import Button from '../components/Button';
import { useAuth } from '../context/AuthContext';
import type { AuthStackParamList } from '../types';

type Props = NativeStackScreenProps<AuthStackParamList, 'Register'>;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface FormErrors {
  fullName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

export default function RegisterScreen({ navigation }: Props) {
  const { register, isSubmitting } = useAuth();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});

  const validate = (): boolean => {
    const nextErrors: FormErrors = {};
    if (!fullName.trim()) {
      nextErrors.fullName = 'Nama lengkap wajib diisi.';
    } else if (fullName.trim().length < 3) {
      nextErrors.fullName = 'Nama minimal 3 karakter.';
    }

    if (!email.trim()) {
      nextErrors.email = 'Email wajib diisi.';
    } else if (!EMAIL_REGEX.test(email.trim())) {
      nextErrors.email = 'Format email tidak valid.';
    }

    if (!password) {
      nextErrors.password = 'Password wajib diisi.';
    } else if (password.length < 6) {
      nextErrors.password = 'Password minimal 6 karakter.';
    }

    if (confirmPassword !== password) {
      nextErrors.confirmPassword = 'Konfirmasi password tidak sama.';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validate()) return;

    const [firstName, ...rest] = fullName.trim().split(' ');
    const lastName = rest.join(' ') || '-';

    try {
      await register({ firstName, lastName, email: email.trim(), password });
      Alert.alert(
        'Registrasi Berhasil',
        'Akun simulasi berhasil dibuat. Karena ini memakai API publik DummyJSON, silakan login memakai akun demo (cirasahira / 12345678) untuk mengakses aplikasi.',
        [{ text: 'Ke Halaman Login', onPress: () => navigation.navigate('Login') }]
      );
    } catch (err) {
      Alert.alert('Registrasi Gagal', 'Terjadi kesalahan, silakan coba lagi.');
    }
  };

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Text style={styles.title}>Buat Akun Baru</Text>
          <Text style={styles.subtitle}>Bergabung dengan komunitas jual-beli kampus</Text>
        </View>

        <View style={styles.form}>
          <InputField
            label="Nama Lengkap"
            placeholder="mis. Budi Santoso"
            value={fullName}
            onChangeText={setFullName}
            error={errors.fullName}
            leftIcon={<Ionicons name="person-outline" size={18} color={colors.textMuted} />}
          />
          <InputField
            label="Email"
            placeholder="mis. budi@kampus.ac.id"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            error={errors.email}
            leftIcon={<Ionicons name="mail-outline" size={18} color={colors.textMuted} />}
          />
          <InputField
            label="Password"
            placeholder="Minimal 6 karakter"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            error={errors.password}
            leftIcon={<Ionicons name="lock-closed-outline" size={18} color={colors.textMuted} />}
          />
          <InputField
            label="Konfirmasi Password"
            placeholder="Ulangi password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            error={errors.confirmPassword}
            leftIcon={<Ionicons name="lock-closed-outline" size={18} color={colors.textMuted} />}
          />

          <Button title="Daftar" onPress={handleRegister} loading={isSubmitting} style={styles.registerBtn} />

          <View style={styles.footerRow}>
            <Text style={styles.footerText}>Sudah punya akun? </Text>
            <Text style={styles.footerLink} onPress={() => navigation.navigate('Login')}>
              Masuk
            </Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.background },
  scrollContent: { flexGrow: 1 },
  header: {
    paddingTop: 70,
    paddingBottom: 24,
    paddingHorizontal: 24,
    backgroundColor: colors.primary,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.white,
  },
  subtitle: {
    fontSize: 13,
    color: '#C7D2E8',
    marginTop: 6,
  },
  form: {
    padding: 24,
    paddingTop: 28,
  },
  registerBtn: {
    marginTop: 8,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  footerText: {
    color: colors.textMuted,
    fontSize: 13,
  },
  footerLink: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: '700',
  },
});
