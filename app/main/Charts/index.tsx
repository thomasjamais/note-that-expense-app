import { ErrorBoundary } from '@/components/Error';
import Line from '@/components/Line';
import Pie from '@/components/Pie';
import Colors from '@/constants/Colors';
import { PeriodRange } from '@/hooks/useGetPieChartForTripId';
import DateTimePicker from '@react-native-community/datetimepicker';
import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import 'react-native-gesture-handler';
import { TabBar, TabView } from 'react-native-tab-view';

const routes = [
  { key: 'pie', title: 'Répartition' },
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
          <ErrorBoundary>
            <ScrollView style={styles.chartContainer}>
              <Pie
                range={range}
                customStart={customStart}
                customEnd={customEnd}
                selectedCategories={selectedCategories}
                toggleCategory={toggleCategory}
                setSelectedCategories={setSelectedCategories}
              />
            </ScrollView>
          </ErrorBoundary>
        );
      case 'line':
        return (
          <ErrorBoundary>
            <ScrollView style={styles.chartContainer}>
              <Line
                range={range}
                customStart={customStart}
                customEnd={customEnd}
                selectedCategories={selectedCategories}
                toggleCategory={toggleCategory}
                setSelectedCategories={setSelectedCategories}
              />
            </ScrollView>
          </ErrorBoundary>
        );
      default:
        return null;
    }
  };

  const primary = Colors.light.tint;

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Statistiques</Text>
      </View>

      <View style={styles.filterBar}>
        {(['total', 'week', 'month', 'custom'] as PeriodRange[]).map((r) => (
          <Text
            key={r}
            onPress={() => setRange(r)}
            style={[styles.filterTab, range === r && { backgroundColor: primary, color: '#fff' }]}
          >
            {r.toUpperCase()}
          </Text>
        ))}
      </View>

      {range === 'custom' && (
        <View style={styles.dateRow}>
          <Text style={styles.dateButton} onPress={() => setShowStartPicker(true)}>
            {customStart ? `Début: ${customStart}` : 'Choisir début'}
          </Text>
          <Text style={styles.dateButton} onPress={() => setShowEndPicker(true)}>
            {customEnd ? `Fin: ${customEnd}` : 'Choisir fin'}
          </Text>
          {showStartPicker && (
            <DateTimePicker
              mode="date"
              value={customStart ? new Date(customStart) : new Date()}
              onChange={(_, d) => {
                setShowStartPicker(false);
                if (d) setCustomStart(d.toISOString().split('T')[0]);
              }}
            />
          )}
          {showEndPicker && (
            <DateTimePicker
              mode="date"
              value={customEnd ? new Date(customEnd) : new Date()}
              onChange={(_, d) => {
                setShowEndPicker(false);
                if (d) setCustomEnd(d.toISOString().split('T')[0]);
              }}
            />
          )}
        </View>
      )}

      <ErrorBoundary>
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
              style={styles.tabBar}
            />
          )}
        />
      </ErrorBoundary>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff' },
  tabView: {
    flex: 1,
  },
  headerContainer: { padding: 16 },
  header: { fontSize: 24, fontWeight: 'bold', textAlign: 'center' },
  filterBar: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginHorizontal: 16,
    marginBottom: 8,
  },
  filterTab: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: '#eee',
    color: Colors.light.text,
    fontSize: 12,
    fontWeight: '500',
  },
  dateRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginHorizontal: 16,
    marginBottom: 12,
  },
  dateButton: {
    flex: 1,
    marginHorizontal: 8,
    paddingVertical: 8,
    borderRadius: 6,
    backgroundColor: Colors.light.tint,
    color: '#fff',
    textAlign: 'center',
    fontSize: 14,
  },
  tabBar: { backgroundColor: '#fff', color: Colors.light.text, fontWeight: '600' },
  tabLabel: { color: Colors.light.text, fontWeight: '600' },
  chartContainer: { flex: 1, padding: 16 },
});
