import Colors from '@/constants/Colors';
import { PeriodRange } from '@/hooks/useGetPieChartForTripId';
import DateTimePicker from '@react-native-community/datetimepicker';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

type TimeRangeProps = {
  range: PeriodRange;
  customStart?: string;
  customEnd?: string;
  showStartPicker: boolean;
  showEndPicker: boolean;
  setShowStartPicker: (show: boolean) => void;
  setShowEndPicker: (show: boolean) => void;
  setRange: (range: PeriodRange) => void;
  setCustomStart: (date: string) => void;
  setCustomEnd: (date: string) => void;
};

export default function TimeRange({
  range,
  customStart,
  customEnd,
  showStartPicker,
  showEndPicker,
  setShowStartPicker,
  setShowEndPicker,
  setRange,
  setCustomStart,
  setCustomEnd,
}: TimeRangeProps) {
  const primary = Colors.light.tint;

  return (
    <View>
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
    </View>
  );
}

const styles = StyleSheet.create({
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
});
