// import { PeriodRange } from '@/hooks/useGetPieChartForTripId';
// import { theme } from '@/theme';
// import DateTimePicker from '@react-native-community/datetimepicker';
// import React from 'react';
// import { StyleSheet, Text, View } from 'react-native';

// type TimeRangeProps = {
//   range: PeriodRange;
//   customStart?: string;
//   customEnd?: string;
//   showStartPicker: boolean;
//   showEndPicker: boolean;
//   setShowStartPicker: (show: boolean) => void;
//   setShowEndPicker: (show: boolean) => void;
//   setRange: (range: PeriodRange) => void;
//   setCustomStart: (date: string) => void;
//   setCustomEnd: (date: string) => void;
// };

// export default function TimeRange({
//   range,
//   customStart,
//   customEnd,
//   showStartPicker,
//   showEndPicker,
//   setShowStartPicker,
//   setShowEndPicker,
//   setRange,
//   setCustomStart,
//   setCustomEnd,
// }: TimeRangeProps) {
//   const primary = theme.colors.primary[600];

//   return (
//     <View>
//       <View style={styles.filterBar}>
//         {(['total', 'week', 'month', 'custom'] as PeriodRange[]).map((r) => (
//           <Text
//             key={r}
//             onPress={() => setRange(r)}
//             style={[styles.filterTab, range === r && { backgroundColor: primary, color: '#fff' }]}
//           >
//             {r.toUpperCase()}
//           </Text>
//         ))}
//       </View>

//       {range === 'custom' && (
//         <View style={styles.dateRow}>
//           <Text style={styles.dateButton} onPress={() => setShowStartPicker(true)}>
//             {customStart ? `Début: ${customStart}` : 'Choisir début'}
//           </Text>
//           <Text style={styles.dateButton} onPress={() => setShowEndPicker(true)}>
//             {customEnd ? `Fin: ${customEnd}` : 'Choisir fin'}
//           </Text>
//           {showStartPicker && (
//             <DateTimePicker
//               mode="date"
//               value={customStart ? new Date(customStart) : new Date()}
//               onChange={(_, d) => {
//                 setShowStartPicker(false);
//                 if (d) setCustomStart(d.toISOString().split('T')[0]);
//               }}
//             />
//           )}
//           {showEndPicker && (
//             <DateTimePicker
//               mode="date"
//               value={customEnd ? new Date(customEnd) : new Date()}
//               onChange={(_, d) => {
//                 setShowEndPicker(false);
//                 if (d) setCustomEnd(d.toISOString().split('T')[0]);
//               }}
//             />
//           )}
//         </View>
//       )}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   filterBar: {
//     flexDirection: 'row',
//     justifyContent: 'space-evenly',
//     marginHorizontal: 16,
//     marginBottom: 8,
//     marginTop: theme.spacing.lg,
//   },
//   filterTab: {
//     paddingVertical: 6,
//     paddingHorizontal: 12,
//     borderRadius: 12,
//     backgroundColor: '#eee',
//     color: theme.colors.text.primary,
//     fontSize: 12,
//     fontWeight: '500',
//   },
//   dateRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     marginHorizontal: 16,
//     marginBottom: 12,
//   },
//   dateButton: {
//     flex: 1,
//     marginHorizontal: 8,
//     paddingVertical: 8,
//     borderRadius: 6,
//     backgroundColor: theme.colors.primary[600],
//     color: '#fff',
//     textAlign: 'center',
//     fontSize: 14,
//   },
// });
import { PeriodRange } from '@/hooks/useGetPieChartForTripId';
import { theme } from '@/theme';
import DateTimePicker from '@react-native-community/datetimepicker';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Text, TouchableOpacity, View } from 'react-native';

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
}: {
  range: PeriodRange;
  customStart?: string;
  customEnd?: string;
  showStartPicker: boolean;
  showEndPicker: boolean;
  setShowStartPicker: (b: boolean) => void;
  setShowEndPicker: (b: boolean) => void;
  setRange: (r: PeriodRange) => void;
  setCustomStart: (d: string) => void;
  setCustomEnd: (d: string) => void;
}) {
  const { t } = useTranslation();
  const items: { key: PeriodRange; label: string }[] = [
    { key: 'total', label: t('timeRange.total') },
    { key: 'week', label: t('timeRange.week') },
    { key: 'month', label: t('timeRange.month') },
    { key: 'custom', label: t('timeRange.custom') },
  ];
  return (
    <View style={{ marginTop: theme.spacing.md }}>
      <View style={{ flexDirection: 'row', gap: theme.spacing.xs, flexWrap: 'wrap' }}>
        {items.map((it) => {
          const active = range === it.key;
          return (
            <TouchableOpacity
              key={it.key}
              onPress={() => setRange(it.key)}
              style={{
                paddingVertical: 8,
                paddingHorizontal: 14,
                borderRadius: 999,
                backgroundColor: active ? theme.colors.primary[600] : theme.colors.neutral[200],
              }}
            >
              <Text
                style={{
                  color: active ? theme.colors.neutral[50] : theme.colors.text.primary,
                  fontWeight: '700',
                  fontSize: 12,
                }}
              >
                {it.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {range === 'custom' && (
        <View style={{ flexDirection: 'row', marginTop: theme.spacing.sm, gap: theme.spacing.sm }}>
          <TouchableOpacity
            style={{
              flex: 1,
              paddingVertical: 10,
              borderRadius: theme.radii.md,
              backgroundColor: theme.colors.primary[600],
            }}
            onPress={() => setShowStartPicker(true)}
          >
            <Text style={{ color: theme.colors.neutral[50], textAlign: 'center' }}>
              {customStart ? `Début: ${customStart}` : 'Choisir début'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              flex: 1,
              paddingVertical: 10,
              borderRadius: theme.radii.md,
              backgroundColor: theme.colors.primary[600],
            }}
            onPress={() => setShowEndPicker(true)}
          >
            <Text style={{ color: theme.colors.neutral[50], textAlign: 'center' }}>
              {customEnd ? `Fin: ${customEnd}` : 'Choisir fin'}
            </Text>
          </TouchableOpacity>

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
