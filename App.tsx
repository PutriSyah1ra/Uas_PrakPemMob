import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from './src/context/AuthContext';
import { WishlistProvider } from './src/context/WishlistContext';
import RootNavigator from './src/navigation/RootNavigator';

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <WishlistProvider>
          <StatusBar style="light" backgroundColor="#0B1E3F" />
          <RootNavigator />
        </WishlistProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
