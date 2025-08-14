import { PieChartData } from '@/hooks/useGetPieChartForTripId';
import { theme } from '@/theme';
import React, { useMemo } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

type CategoryListProps = {
  pieChartData: PieChartData[];
  selectedCategories: string[];
  toggleCategory: (name: string) => void;
};

export default function CategoryList({
  pieChartData,
  selectedCategories,
  toggleCategory,
}: CategoryListProps) {
  const sorted = useMemo(
    () => [...pieChartData].sort((a, b) => b.population - a.population),
    [pieChartData],
  );

  const total = useMemo(
    () => pieChartData.reduce((s, it) => s + (it.population || 0), 0),
    [pieChartData],
  );

  return (
    <View
      style={{ paddingHorizontal: 16, marginTop: theme.spacing.sm, marginBottom: theme.spacing.md }}
    >
      {sorted.map((cat) => {
        const pct = total > 0 ? Math.round((cat.population / total) * 100) : 0;
        const active = selectedCategories.includes(cat.name);
        return (
          <TouchableOpacity
            key={cat.name}
            onPress={() => toggleCategory(cat.name)}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingVertical: theme.spacing.xs,
              opacity: active ? 1 : 0.45,
            }}
          >
            <View
              style={{
                width: 16,
                height: 16,
                borderRadius: 6,
                backgroundColor: cat.color,
                marginRight: 10,
              }}
            />
            <Text style={{ flex: 1, fontFamily: theme.typography.family.medium }}>{cat.name}</Text>
            <Text style={{ width: 44, textAlign: 'right', color: theme.colors.text.muted }}>
              {pct}%
            </Text>
            <Text
              style={{
                width: 96,
                textAlign: 'right',
                fontFamily: theme.typography.family.bold,
                color: theme.colors.text.primary,
              }}
            >
              {cat.population.toFixed(2)} €
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
