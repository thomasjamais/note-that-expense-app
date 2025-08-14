import DailyStats from '@/components/DailyStats';
import LineV2 from '@/components/LineV2';
import Pie from '@/components/Pie';
import TimeRange from '@/components/TimeRange';
import TripStats from '@/components/TripStats';
import AppHeader from '@/components/ui/AppHeader';
import IconButton from '@/components/ui/IconButton';
import { Screen } from '@/components/ui/Screen';
import { PeriodRange } from '@/hooks/useGetPieChartForTripId';
import { theme } from '@/theme';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SafeAreaView, ScrollView, useWindowDimensions } from 'react-native';
import { TabBar, TabView } from 'react-native-tab-view';

export default function ChartsScreen() {
  const { t } = useTranslation();
  const layout = useWindowDimensions();
  const [index, setIndex] = useState(0);

  const [range, setRange] = useState<PeriodRange>('total');
  const [customStart, setCustomStart] = useState<string>();
  const [customEnd, setCustomEnd] = useState<string>();
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const toggleCategory = (name: string) => {
    setSelectedCategories((prev) =>
      prev.includes(name) ? prev.filter((c) => c !== name) : [...prev, name],
    );
  };

  const routes = [
    { key: 'tripStats', title: t('tabs.trips') },
    { key: 'dailyStats', title: t('tabs.daily') },
    { key: 'pie', title: t('tabs.pie') },
    { key: 'line', title: t('tabs.line') },
  ];

  const renderScene = ({ route }: { route: { key: string } }) => {
    switch (route.key) {
      case 'pie':
        return (
          <ScrollView contentContainerStyle={{ padding: theme.spacing.lg }}>
            <TimeRange
              range={range}
              customStart={customStart}
              customEnd={customEnd}
              setRange={setRange}
              showStartPicker={showStartPicker}
              setShowStartPicker={setShowStartPicker}
              showEndPicker={showEndPicker}
              setShowEndPicker={setShowEndPicker}
              setCustomStart={setCustomStart}
              setCustomEnd={setCustomEnd}
            />
            <Pie
              range={range}
              customStart={customStart}
              customEnd={customEnd}
              selectedCategories={selectedCategories}
              toggleCategory={toggleCategory}
              setSelectedCategories={setSelectedCategories}
            />
          </ScrollView>
        );
      case 'line':
        return (
          <ScrollView contentContainerStyle={{ padding: theme.spacing.lg }}>
            <TimeRange
              range={range}
              customStart={customStart}
              customEnd={customEnd}
              setRange={setRange}
              showStartPicker={showStartPicker}
              setShowStartPicker={setShowStartPicker}
              showEndPicker={showEndPicker}
              setShowEndPicker={setShowEndPicker}
              setCustomStart={setCustomStart}
              setCustomEnd={setCustomEnd}
            />
            <LineV2
              range={range}
              customStart={customStart}
              customEnd={customEnd}
              selectedCategories={selectedCategories}
              toggleCategory={toggleCategory}
              setSelectedCategories={setSelectedCategories}
            />
          </ScrollView>
        );
      case 'dailyStats':
        return (
          <ScrollView contentContainerStyle={{ padding: theme.spacing.lg }}>
            <DailyStats />
          </ScrollView>
        );
      case 'tripStats':
        return (
          <ScrollView contentContainerStyle={{ padding: theme.spacing.lg }}>
            <TripStats />
          </ScrollView>
        );
      default:
        return null;
    }
  };

  return (
    <Screen>
      <AppHeader
        title={t('tabs.chart')}
        right={
          <>
            <IconButton onPress={() => setIndex(2)}>
              <FontAwesome name="pie-chart" size={16} color={theme.colors.text.primary} />
            </IconButton>
            <IconButton onPress={() => setIndex(3)}>
              <FontAwesome name="line-chart" size={16} color={theme.colors.text.primary} />
            </IconButton>
          </>
        }
        variant="large"
        elevated
      />
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
