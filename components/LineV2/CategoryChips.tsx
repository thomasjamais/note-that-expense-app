import { LineChartData } from '@/hooks/useGetLineChartForTripId';
import { theme } from '@/theme';
import React from 'react';
import { ScrollView, Text, TouchableOpacity } from 'react-native';

export default function CategoryChips({
  data,
  selected,
  onToggle,
  allLegend,
}: {
  data: LineChartData;
  selected: string[];
  onToggle: (name: string) => void;
  allLegend: string[];
}) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: theme.spacing.md }}
      style={{ marginBottom: theme.spacing.sm }}
    >
      {allLegend.map((name) => {
        const i = data.legend.indexOf(name);
        const active = selected.includes(name);
        const color = i >= 0 ? data.barColors[i] : theme.colors.neutral[300];

        return (
          <TouchableOpacity
            key={name}
            onPress={() => onToggle(name)}
            style={{
              marginRight: 8,
              paddingVertical: 8,
              paddingHorizontal: 14,
              borderRadius: 999,
              borderWidth: 1,
              borderColor: active ? color : theme.colors.neutral[200],
              backgroundColor: active ? color + '22' : theme.colors.surface,
            }}
          >
            <Text
              style={{
                fontFamily: theme.typography.family.medium,
                color: active ? theme.colors.text.primary : theme.colors.text.secondary,
              }}
            >
              {name}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}
