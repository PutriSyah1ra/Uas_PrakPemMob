import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import colors from '../theme/colors';
import InputField from '../components/InputField';
import Button from '../components/Button';
import { useAuth } from '../context/AuthContext';
import type { AuthStackParamList } from '../types';

type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>;

interface FormErrors {
  username?: string;
  password?: string;
}

export default function LoginScreen({ navigation }: Props) {
  const { login, isSubmitting } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [formError, setFormError] = useState('');

  const validate = (): boolean => {
    const nextErrors: FormErrors = {};
    if (!username.trim()) nextErrors.username = 'Username wajib diisi.';
    if (!password) nextErrors.password = 'Password wajib diisi.';
    else if (password.length < 4) nextErrors.password = 'Password minimal 4 karakter.';
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleLogin = async () => {
    setFormError('');
    if (!validate()) return;
    try {
      await login(username.trim(), password);
    } catch (err) {
      setFormError('Login gagal. Periksa kembali username dan password Anda.');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <View style={styles.logoCircle}>
            <Ionicons name="storefront" size={34} color={colors.white} />
          </View>
          <Text style={styles.title}>KampusMarket</Text>
          <Text style={styles.subtitle}>Jual-beli barang bekas antar mahasiswa</Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.formTitle}>Masuk ke Akun</Text>

          <InputField
            label="Username"
            placeholder="mis. cirasahira"
            value={username}
            onChangeText={setUsername}
            error={errors.username}
            leftIcon={<Ionicons name="person-outline" size={18} color={colors.textMuted} />}
          />
          <InputField
            label="Password"
            placeholder="Masukkan password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            error={errors.password}
            leftIcon={<Ionicons name="lock-closed-outline" size={18} color={colors.textMuted} />}
          />

          {formError ? <Text style={styles.formError}>{formError}</Text> : null}

          <Button title="Masuk" onPress={handleLogin} loading={isSubmitting} style={styles.loginBtn} />

          <View style={styles.hintBox}>
            <Ionicons name="information-circle-outline" size={16} color={colors.textMuted} />
            <Text style={styles.hintText}>
              Demo akun: username{' '}
              <Text style={styles.hintBold}>cirasahira</Text> · password{' '}
              <Text style={styles.hintBold}>12345678</Text>
            </Text>
          </View>

          <View style={styles.footerRow}>
            <Text style={styles.footerText}>Belum punya akun? </Text>
            <Text style={styles.footerLink} onPress={() => navigation.navigate('Register')}>
              Daftar di sini
            </Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.primary },
  scrollContent: { flexGrow: 1 },
  header: {
    alignItems: 'center',
    paddingTop: 70,
    paddingBottom: 40,
    paddingHorizontal: 24,
  },
  logoCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
    borderWidth: 2,
    borderColor: colors.accent,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: colors.white,
  },
  subtitle: {
    fontSize: 13,
    color: '#C7D2E8',
    marginTop: 6,
    textAlign: 'center',
  },
  form: {
    flex: 1,
    backgroundColor: colors.background,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 24,
    paddingTop: 32,
  },
  formTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textDark,
    marginBottom: 20,
  },
  loginBtn: {
    marginTop: 4,
  },
  formError: {
    color: colors.danger,
    fontSize: 13,
    marginBottom: 12,
  },
  hintBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
    backgroundColor: '#EEF2FA',
    borderRadius: 10,
    padding: 12,
    marginTop: 18,
  },
  hintText: {
    flex: 1,
    fontSize: 12,
    color: colors.textMuted,
    lineHeight: 17,
  },
  hintBold: {
    fontWeight: '700',
    color: colors.textDark,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 28,
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
