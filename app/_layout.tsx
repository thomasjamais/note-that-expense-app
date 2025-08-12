import 'react-native-gesture-handler';

import * as SplashScreen from 'expo-splash-screen';
import '../i18n';
SplashScreen.preventAutoHideAsync();

import {
  PlusJakartaSans_400Regular,
  PlusJakartaSans_600SemiBold,
  PlusJakartaSans_700Bold,
  useFonts,
} from '@expo-google-fonts/plus-jakarta-sans';

import FontAwesome from '@expo/vector-icons/FontAwesome';
// import { useFonts } from 'expo-font';
import { Slot } from 'expo-router';
import { useEffect } from 'react';
import 'react-native-reanimated';

import OfflineBanner from '@/components/OfflineBanner';
import { AuthProvider } from '@/contexts/AuthContext';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { SnackbarProvider } from '@/contexts/SnackbarContext';
import { ThemeProviderCustom } from '@/contexts/ThemeContext';
import NetInfo from '@react-native-community/netinfo';
import { QueryClientProvider } from '@tanstack/react-query';
import { flushExpenses } from '../lib/offlineQueue';
import { queryClient } from '../lib/queryClient';

export { ErrorBoundary } from 'expo-router';

export const unstable_settings = {
  initialRouteName: 'SplashScreen',
};

export default function RootLayout() {
  const [loaded, error] = useFonts({
    PlusJakartaSans_400Regular,
    PlusJakartaSans_600SemiBold,
    PlusJakartaSans_700Bold,
    ...FontAwesome.font,
  });

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      if (state.isConnected) {
        flushExpenses();
        queryClient.invalidateQueries();
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  return (
    <QueryClientProvider client={queryClient}>
      <OfflineBanner />
      <SnackbarProvider>
        <AuthProvider>
          <LanguageProvider>
            <ThemeProviderCustom>
              <Slot />
            </ThemeProviderCustom>
          </LanguageProvider>
        </AuthProvider>
      </SnackbarProvider>
    </QueryClientProvider>
  );
}
