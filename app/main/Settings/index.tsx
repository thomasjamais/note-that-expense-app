import CategoriesScreen from '@/components/CategoriesScreen';
import TripsScreen from '@/components/TripsScreen';
import AppHeader from '@/components/ui/AppHeader';
import IconButton from '@/components/ui/IconButton';
import { Screen } from '@/components/ui/Screen';
import { useAuth } from '@/contexts/AuthContext';
import { theme } from '@/theme';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SafeAreaView, StyleSheet, useWindowDimensions } from 'react-native';
import { TabBar, TabView } from 'react-native-tab-view';

export default function SettingsScreen() {
  const { focusTab } = useLocalSearchParams();

  const { t } = useTranslation();
  const { logout } = useAuth();
  const router = useRouter();
  const layout = useWindowDimensions();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (focusTab) {
      setIndex(Number(focusTab));
    }
  }, [focusTab]);

  const routes = [
    { key: 'categories', title: t('tabs.categories') },
    { key: 'trips', title: t('tabs.trips') },
  ];

  const renderScene = ({ route }: { route: { key: string } }) => {
    switch (route.key) {
      case 'categories':
        return <CategoriesScreen />;
      case 'trips':
        return <TripsScreen />;
      default:
        return null;
    }
  };

  const handleLogout = async () => {
    await logout();
    router.replace('/auth');
  };

  return (
    <Screen>
      <AppHeader
        title={t('tabs.settings')}
        right={
          <>
            <IconButton onPress={handleLogout}>
              <FontAwesome name="power-off" size={16} color="#E53935" />
            </IconButton>
          </>
        }
        variant="large"
        elevated
      />
      <SafeAreaView style={{ flex: 1 }}>
        <TabView
          navigationState={{ index, routes }}
          renderScene={renderScene}
          onIndexChange={setIndex}
          initialLayout={{ width: layout.width }}
          style={{ flex: 1 }}
          renderTabBar={(props) => (
            <TabBar
              {...props}
              indicatorStyle={{
                backgroundColor: theme.colors.primary[600],
                height: 3,
                borderRadius: 2,
              }}
              style={styles.tabBar}
              tabStyle={{ width: 'auto' }}
              activeColor={theme.colors.text.primary}
              inactiveColor={theme.colors.text.secondary}
            />
          )}
        />
      </SafeAreaView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: {
    ...theme.typography.title,
    marginBottom: theme.spacing.md,
  },
  tabBar: {
    backgroundColor: theme.colors.background,
    elevation: 0,
    shadowOpacity: 0,
    borderBottomWidth: 1,
    borderColor: theme.colors.border,
  },
});
