import DailyStats from '@/components/DailyStats';
import Line from '@/components/Line';
import Pie from '@/components/Pie';
import TimeRange from '@/components/TimeRange';
import TripStats from '@/components/TripStats';
import Colors from '@/constants/Colors';
import { PeriodRange } from '@/hooks/useGetPieChartForTripId';
import React, { useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, useWindowDimensions } from 'react-native';
import { TabBar, TabView } from 'react-native-tab-view';

const routes = [
  { key: 'tripStats', title: 'Voyage' },
  { key: 'dailyStats', title: 'Journée' },
  { key: 'pie', title: 'Types' },
  { key: 'line', title: 'Évolution' },
];

export default function ChartsScreen() {
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
      prev.includes(name) ? prev.filter((cat) => cat !== name) : [...prev, name],
    );
  };

  const renderScene = ({ route }: { route: { key: string } }) => {
    switch (route.key) {
      case 'pie':
        return (
          <ScrollView style={styles.chartContainer}>
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
          <ScrollView style={styles.chartContainer}>
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
            <Line
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
          <ScrollView style={styles.chartContainer}>
            <DailyStats />
          </ScrollView>
        );
      case 'tripStats':
        return (
          <ScrollView style={styles.chartContainer}>
            <TripStats />
          </ScrollView>
        );
      default:
        return null;
    }
  };

  const primary = Colors.light.tint;

  return (
    <SafeAreaView style={styles.safe}>
      <TabView
        style={styles.tabView}
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: layout.width }}
        renderTabBar={(props) => (
          <TabBar
            {...props}
            indicatorStyle={{ backgroundColor: primary }}
            activeColor={Colors.light.tint}
            inactiveColor="#888"
            style={styles.tabBar}
          />
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff' },
  tabView: {
    flex: 1,
  },
  tabBar: { backgroundColor: '#fff', color: Colors.light.text, fontWeight: '600' },
  chartContainer: { flex: 1, padding: 16 },
});
