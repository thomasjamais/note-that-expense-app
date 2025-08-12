// import CategoriesScreen from '@/components/CategoriesScreen';
// import TripsScreen from '@/components/TripsScreen';
// import Button from '@/components/ui/Button';
// import { Screen } from '@/components/ui/Screen';
// import { useAuth } from '@/contexts/AuthContext';
// import { theme } from '@/theme';
// import { useRouter } from 'expo-router';
// import React, { useState } from 'react';
// import { useTranslation } from 'react-i18next';
// import { SafeAreaView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
// import { TabBar, TabView } from 'react-native-tab-view';

// export default function SettingsScreen() {
//   const { t } = useTranslation();
//   const router = useRouter();
//   const { logout } = useAuth();

//   const handleLogout = async () => {
//     await logout();
//     router.replace('/auth');
//   };
//   const layout = useWindowDimensions();
//   const [index, setIndex] = useState(0);

//   const renderScene = ({ route }: { route: { key: string } }) => {
//     switch (route.key) {
//       case 'categories':
//         return <CategoriesScreen />;
//       case 'trips':
//         return <TripsScreen />;
//       default:
//         return null;
//     }
//   };

//   const routes = [
//     { key: 'categories', title: t('tabs.categories') },
//     { key: 'trips', title: t('tabs.trips') },
//   ];

//   return (
//     <Screen>
//       <SafeAreaView style={styles.safe}>
//         <Text style={styles.title}>{t('tabs.settings')}</Text>

//         <TabView
//           navigationState={{ index, routes }}
//           renderScene={renderScene}
//           onIndexChange={setIndex}
//           initialLayout={{ width: layout.width }}
//           style={styles.tabView}
//           renderTabBar={(props) => (
//             <TabBar
//               {...props}
//               indicatorStyle={{ backgroundColor: theme.colors.success[900] }}
//               activeColor={theme.colors.text.primary}
//               inactiveColor={theme.colors.text.secondary}
//               style={styles.tabBar}
//             />
//           )}
//         />

//         <View style={styles.buttonContainer}>
//           <Button label={t('actions.logout')} onPress={handleLogout} />
//         </View>
//       </SafeAreaView>
//     </Screen>
//   );
// }

// const styles = StyleSheet.create({
//   safe: {
//     flex: 1,
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: 'bold',
//   },
//   buttonContainer: {
//     marginTop: 16,
//   },
//   tabView: {
//     flex: 1,
//   },
//   tabBar: {
//     backgroundColor: theme.colors.background,
//     elevation: 0,
//     shadowOpacity: 0,
//   },
//   tabLabel: {
//     fontWeight: '600',
//     fontSize: 14,
//   },
// });

import CategoriesScreen from '@/components/CategoriesScreen';
import TripsScreen from '@/components/TripsScreen';
import AppHeader from '@/components/ui/AppHeader';
import IconButton from '@/components/ui/IconButton';
import { Screen } from '@/components/ui/Screen';
import { useAuth } from '@/contexts/AuthContext';
import { theme } from '@/theme';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SafeAreaView, StyleSheet, useWindowDimensions } from 'react-native';
import { TabBar, TabView } from 'react-native-tab-view';

export default function SettingsScreen() {
  const { t } = useTranslation();
  const { logout } = useAuth();
  const router = useRouter();
  const layout = useWindowDimensions();
  const [index, setIndex] = useState(0);

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
