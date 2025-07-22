import Line from '@/components/Line';
import Pie from '@/components/Pie';
import Colors from '@/constants/Colors';
import { PeriodRange } from '@/hooks/useGetPieChartForTripId';
import DateTimePicker from '@react-native-community/datetimepicker';
import React, { useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

export default function Charts() {
  const [range, setRange] = useState<PeriodRange>('total');
  const [customStart, setCustomStart] = useState<string | undefined>(undefined);
  const [customEnd, setCustomEnd] = useState<string | undefined>(undefined);
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const toggleCategory = (name: string) => {
    setSelectedCategories((prev) =>
      prev.includes(name) ? prev.filter((cat) => cat !== name) : [...prev, name],
    );
  };

  const primaryColor = Colors.light.tint;

  return (
    <ScrollView contentContainerStyle={{ paddingVertical: 16 }}>
      <View style={{ paddingHorizontal: 16, marginBottom: 16 }}>
        <Text style={{ fontWeight: 'bold', fontSize: 18, textAlign: 'center' }}>
          Filtres de période
        </Text>
        <View style={{ flexDirection: 'row', justifyContent: 'center', marginVertical: 10 }}>
          {['total', 'week', 'month', 'custom'].map((r) => (
            <TouchableOpacity
              key={r}
              onPress={() => setRange(r as PeriodRange)}
              style={{
                padding: 6,
                marginHorizontal: 4,
                borderRadius: 6,
                backgroundColor: range === r ? primaryColor : '#ccc',
              }}
            >
              <Text style={{ color: '#fff' }}>{r.toUpperCase()}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {range === 'custom' && (
          <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginBottom: 10 }}>
            <TouchableOpacity
              onPress={() => setShowStartPicker(true)}
              style={{
                padding: 8,
                borderRadius: 6,
                backgroundColor: primaryColor,
                width: 150,
              }}
            >
              <Text style={{ color: '#fff', textAlign: 'center' }}>
                {customStart ? `Début: ${customStart}` : 'Choisir début'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setShowEndPicker(true)}
              style={{
                padding: 8,
                borderRadius: 6,
                backgroundColor: primaryColor,
                width: 150,
              }}
            >
              <Text style={{ color: '#fff', textAlign: 'center' }}>
                {customEnd ? `Fin: ${customEnd}` : 'Choisir fin'}
              </Text>
            </TouchableOpacity>

            {showStartPicker && (
              <DateTimePicker
                mode="date"
                value={customStart ? new Date(customStart) : new Date()}
                onChange={(_, date) => {
                  setShowStartPicker(false);
                  if (date) setCustomStart(date.toISOString().split('T')[0]);
                }}
              />
            )}

            {showEndPicker && (
              <DateTimePicker
                mode="date"
                value={customEnd ? new Date(customEnd) : new Date()}
                onChange={(_, date) => {
                  setShowEndPicker(false);
                  if (date) setCustomEnd(date.toISOString().split('T')[0]);
                }}
              />
            )}
          </View>
        )}
      </View>

      <Pie
        range={range}
        customStart={customStart}
        customEnd={customEnd}
        selectedCategories={selectedCategories}
        toggleCategory={toggleCategory}
        setSelectedCategories={setSelectedCategories}
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
}
