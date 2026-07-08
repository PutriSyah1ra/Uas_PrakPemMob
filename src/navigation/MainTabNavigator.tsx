import React from 'react';
import { StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import type { ComponentProps } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import colors from '../theme/colors';
import HomeStackNavigator from './HomeStackNavigator';
import WishlistScreen from '../screens/WishlistScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { useWishlist } from '../context/WishlistContext';
import type { MainTabParamList } from '../types';

const Tab = createBottomTabNavigator<MainTabParamList>();

type IoniconName = ComponentProps<typeof Ionicons>['name'];

const ICONS: Record<keyof MainTabParamList, { active: IoniconName; inactive: IoniconName }> = {
  HomeTab: { active: 'home', inactive: 'home-outline' },
  WishlistTab: { active: 'heart', inactive: 'heart-outline' },
  ProfileTab: { active: 'person', inactive: 'person-outline' },
};

// Menu utama berbentuk tab di bawah layar — hanya bisa diakses setelah login.
export default function MainTabNavigator() {
  const { items } = useWishlist();
  const insets = useSafeAreaInsets();
  // Jarak aman ke tombol/gesture bar bawaan HP (home indicator iOS, navigation
  // bar Android) supaya tab bar tidak terlalu mepet dan susah dipencet.
  const bottomInset = Math.max(insets.bottom, 12);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: [styles.tabBar, { height: 56 + bottomInset, paddingBottom: bottomInset }],
        tabBarLabelStyle: styles.tabLabel,
        tabBarIcon: ({ focused, color, size }) => {
          const iconSet = ICONS[route.name as keyof MainTabParamList];
          return (
            <Ionicons
              name={focused ? iconSet.active : iconSet.inactive}
              size={size ?? 22}
              color={color}
            />
          );
        },
      })}
    >
      <Tab.Screen name="HomeTab" component={HomeStackNavigator} options={{ title: 'Home' }} />
      <Tab.Screen
        name="WishlistTab"
        component={WishlistScreen}
        options={{
          title: 'Wishlist',
          tabBarBadge: items.length > 0 ? items.length : undefined,
        }}
      />
      <Tab.Screen name="ProfileTab" component={ProfileScreen} options={{ title: 'Profil' }} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    paddingTop: 6,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '600',
  },
});
