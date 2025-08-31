import TripOverview from '@/components/TripOverview';
import MonthOverview from '@/components/MonthOverview';
import DayOverview from '@/components/DayOverview';
import AppHeader from '@/components/ui/AppHeader';
import { Screen } from '@/components/ui/Screen';
import { theme } from '@/theme';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SafeAreaView, useWindowDimensions } from 'react-native';
import { TabBar, TabView } from 'react-native-tab-view';

export default function ChartsScreen() {
  const { t } = useTranslation();
  const layout = useWindowDimensions();
  const [index, setIndex] = useState(0);

  const routes = [
    { key: 'trip', title: t('tabs.trips') },
    { key: 'month', title: t('tabs.month') },
    { key: 'day', title: t('tabs.daily') },
  ];

  const renderScene = ({ route }: { route: { key: string } }) => {
    switch (route.key) {
      case 'trip':
        return <TripOverview />;
      case 'month':
        return <MonthOverview />;
      case 'day':
        return <DayOverview />;
      default:
        return null;
    }
  };

  return (
    <Screen>
      <AppHeader title={t('tabs.chart')} variant="large" elevated />
      <SafeAreaView style={{ flex: 1 }}>
        <TabView
          style={{ flex: 1 }}
          navigationState={{ index, routes }}
          renderScene={renderScene}
          onIndexChange={setIndex}
          initialLayout={{ width: layout.width }}
          renderTabBar={(props) => (
            <TabBar
              {...props}
              indicatorStyle={{
                backgroundColor: theme.colors.success[900],
                height: 3,
                borderRadius: 99,
              }}
              activeColor={theme.colors.text.primary}
              inactiveColor={theme.colors.text.secondary}
              style={{ backgroundColor: theme.colors.background, elevation: 0, shadowOpacity: 0 }}
            />
          )}
        />
      </SafeAreaView>
    </Screen>
  );
}
