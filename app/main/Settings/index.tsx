import Button from '@/components/Button';
import CategoriesScreen from '@/components/CategoriesScreen';
import TripsScreen from '@/components/TripsScreen';
import Colors from '@/constants/Colors';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SafeAreaView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { TabBar, TabView } from 'react-native-tab-view';

export default function SettingsScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    router.replace('/auth');
  };
  const layout = useWindowDimensions();
  const [index, setIndex] = useState(0);

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

  const routes = [
    { key: 'categories', title: t('tabs.categories') },
    { key: 'trips', title: t('tabs.trips') },
  ];

  return (
    <SafeAreaView style={styles.safe}>
      <Text style={styles.title}>{t('tabs.settings')}</Text>

      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: layout.width }}
        style={styles.tabView}
        renderTabBar={(props) => (
          <TabBar
            {...props}
            activeColor={Colors.light.tint}
            inactiveColor="#888"
            indicatorStyle={{ backgroundColor: Colors.light.tint }}
            style={styles.tabBar}
          />
        )}
      />

      <View style={styles.buttonContainer}>
        <Button title={t('actions.logout')} onPress={handleLogout} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    padding: 16,
  },
  buttonContainer: {
    marginTop: 16,
  },
  tabView: {
    flex: 1,
  },
  tabBar: {
    backgroundColor: '#fff',
    elevation: 0,
    shadowOpacity: 0,
  },
  tabLabel: {
    fontWeight: '600',
    fontSize: 14,
  },
});
