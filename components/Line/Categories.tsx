import { LineChartData } from '@/hooks/useGetLineChartForTripId';
import { theme } from '@/theme';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

export default function CategoriesLine({
  stackedBarData,
  selectedCategories,
  toggleCategory,
}: {
  stackedBarData: LineChartData;
  selectedCategories: string[];
  toggleCategory: (n: string) => void;
}) {
  return (
    <View
      style={{
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: theme.spacing.xs,
        marginBottom: theme.spacing.sm,
      }}
    >
      {stackedBarData.legend.map((cat, i) => {
        const active = selectedCategories.includes(cat);
        return (
          <TouchableOpacity
            key={cat}
            onPress={() => toggleCategory(cat)}
            style={{
              paddingVertical: 6,
              paddingHorizontal: 12,
              borderRadius: 999,
              backgroundColor: active ? stackedBarData.barColors[i] : theme.colors.neutral[200],
            }}
          >
            <Text style={{ color: theme.colors.text.primary }}>{cat}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
