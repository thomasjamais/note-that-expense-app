import 'react-native-gesture-handler';

import * as SplashScreen from 'expo-splash-screen';
import '../i18n';
SplashScreen.preventAutoHideAsync();

import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { useEffect } from 'react';
import 'react-native-reanimated';

import OfflineBanner from '@/components/OfflineBanner';
import { useColorScheme } from '@/components/useColorScheme';
import { AuthProvider } from '@/contexts/AuthContext';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { SnackbarProvider } from '@/contexts/SnackbarContext';
import NetInfo from '@react-native-community/netinfo';
import { QueryClientProvider } from '@tanstack/react-query';
import { PaperProvider } from 'react-native-paper';
import { flushExpenses } from '../lib/offlineQueue';
import { queryClient } from '../lib/queryClient';

export { ErrorBoundary } from 'expo-router';

export const unstable_settings = {
  initialRouteName: 'SplashScreen',
};

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
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
  const colorScheme = useColorScheme();

  return (
    <QueryClientProvider client={queryClient}>
      <OfflineBanner />
      <PaperProvider>
        <SnackbarProvider>
          <AuthProvider>
            <LanguageProvider>
              <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
                <Stack initialRouteName="SplashScreen">
                  <Stack.Screen name="SplashScreen" options={{ headerShown: false }} />
                  <Stack.Screen name="main" options={{ headerShown: false }} />
                </Stack>
              </ThemeProvider>
            </LanguageProvider>
          </AuthProvider>
        </SnackbarProvider>
      </PaperProvider>
    </QueryClientProvider>
  );
}
