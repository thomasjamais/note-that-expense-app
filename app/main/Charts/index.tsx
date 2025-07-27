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
import { SceneMap, TabBar, TabView } from 'react-native-tab-view';

// Définition des onglets
const routes = [
  { key: 'pie', title: 'Répartition' },
  { key: 'line', title: 'Évolution' },
];

export default function ChartsScreen() {
  const layout = useWindowDimensions();
  const [index, setIndex] = useState(0);

  // Filtres de période
  const [range, setRange] = useState<PeriodRange>('total');
  const [customStart, setCustomStart] = useState<string>();
  const [customEnd, setCustomEnd] = useState<string>();
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  // Sélection catégories
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const toggleCategory = (name: string) => {
    setSelectedCategories((prev) =>
      prev.includes(name) ? prev.filter((cat) => cat !== name) : [...prev, name],
    );
  };

  // Tab Répartition
  const renderPie = () => (
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
  );

  // Tab Évolution
  const renderLine = () => (
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
  );

  const renderScene = SceneMap({ pie: renderPie, line: renderLine });

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

      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: layout.width }}
        renderTabBar={(props) => (
          <TabBar
            {...props}
            indicatorStyle={{ backgroundColor: primary }}
            style={styles.tabBar}
            // labelStyle={styles.tabLabel}
          />
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff' },
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
  tabBar: { backgroundColor: '#fff' },
  tabLabel: { color: Colors.light.text, fontWeight: '600' },
  chartContainer: { flex: 1, padding: 16 },
});

// import Line from '@/components/Line';
// import Pie from '@/components/Pie';
// import Colors from '@/constants/Colors';
// import { PeriodRange } from '@/hooks/useGetPieChartForTripId';
// import DateTimePicker from '@react-native-community/datetimepicker';
// import React, { useState } from 'react';
// import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

// export default function Charts() {
//   const [range, setRange] = useState<PeriodRange>('total');
//   const [customStart, setCustomStart] = useState<string | undefined>(undefined);
//   const [customEnd, setCustomEnd] = useState<string | undefined>(undefined);
//   const [showStartPicker, setShowStartPicker] = useState(false);
//   const [showEndPicker, setShowEndPicker] = useState(false);

//   const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

//   const toggleCategory = (name: string) => {
//     setSelectedCategories((prev) =>
//       prev.includes(name) ? prev.filter((cat) => cat !== name) : [...prev, name],
//     );
//   };

//   const primaryColor = Colors.light.tint;

//   return (
//     <ScrollView contentContainerStyle={{ paddingVertical: 16 }}>
//       <View style={{ paddingHorizontal: 16, marginBottom: 16 }}>
//         <Text style={{ fontWeight: 'bold', fontSize: 18, textAlign: 'center' }}>
//           Filtres de période
//         </Text>
//         <View style={{ flexDirection: 'row', justifyContent: 'center', marginVertical: 10 }}>
//           {['total', 'week', 'month', 'custom'].map((r) => (
//             <TouchableOpacity
//               key={r}
//               onPress={() => setRange(r as PeriodRange)}
//               style={{
//                 padding: 6,
//                 marginHorizontal: 4,
//                 borderRadius: 6,
//                 backgroundColor: range === r ? primaryColor : '#ccc',
//               }}
//             >
//               <Text style={{ color: '#fff' }}>{r.toUpperCase()}</Text>
//             </TouchableOpacity>
//           ))}
//         </View>

//         {range === 'custom' && (
//           <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginBottom: 10 }}>
//             <TouchableOpacity
//               onPress={() => setShowStartPicker(true)}
//               style={{
//                 padding: 8,
//                 borderRadius: 6,
//                 backgroundColor: primaryColor,
//                 width: 150,
//               }}
//             >
//               <Text style={{ color: '#fff', textAlign: 'center' }}>
//                 {customStart ? `Début: ${customStart}` : 'Choisir début'}
//               </Text>
//             </TouchableOpacity>

//             <TouchableOpacity
//               onPress={() => setShowEndPicker(true)}
//               style={{
//                 padding: 8,
//                 borderRadius: 6,
//                 backgroundColor: primaryColor,
//                 width: 150,
//               }}
//             >
//               <Text style={{ color: '#fff', textAlign: 'center' }}>
//                 {customEnd ? `Fin: ${customEnd}` : 'Choisir fin'}
//               </Text>
//             </TouchableOpacity>

//             {showStartPicker && (
//               <DateTimePicker
//                 mode="date"
//                 value={customStart ? new Date(customStart) : new Date()}
//                 onChange={(_, date) => {
//                   setShowStartPicker(false);
//                   if (date) setCustomStart(date.toISOString().split('T')[0]);
//                 }}
//               />
//             )}

//             {showEndPicker && (
//               <DateTimePicker
//                 mode="date"
//                 value={customEnd ? new Date(customEnd) : new Date()}
//                 onChange={(_, date) => {
//                   setShowEndPicker(false);
//                   if (date) setCustomEnd(date.toISOString().split('T')[0]);
//                 }}
//               />
//             )}
//           </View>
//         )}
//       </View>

//       <Pie
//         range={range}
//         customStart={customStart}
//         customEnd={customEnd}
//         selectedCategories={selectedCategories}
//         toggleCategory={toggleCategory}
//         setSelectedCategories={setSelectedCategories}
//       />
//       <Line
//         range={range}
//         customStart={customStart}
//         customEnd={customEnd}
//         selectedCategories={selectedCategories}
//         toggleCategory={toggleCategory}
//         setSelectedCategories={setSelectedCategories}
//       />
//     </ScrollView>
//   );
// }
