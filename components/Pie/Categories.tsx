import { PieChartData } from '@/hooks/useGetPieChartForTripId';
import { theme } from '@/theme';
import React, { useEffect } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

export default function Categories({
  pieChartData,
  selectedCategories,
  toggleCategory,
  setSelectedCategories,
}: {
  pieChartData: PieChartData[];
  selectedCategories: string[];
  toggleCategory: (n: string) => void;
  setSelectedCategories: React.Dispatch<React.SetStateAction<string[]>>;
}) {
  useEffect(() => {
    if (pieChartData && selectedCategories.length === 0)
      setSelectedCategories(pieChartData.map((c: any) => c.name));
  }, [pieChartData, selectedCategories]);
  return (
    <View
      style={{
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: theme.spacing.sm,
        gap: theme.spacing.xs,
      }}
    >
      {pieChartData?.map((cat: any) => {
        const active = selectedCategories.includes(cat.name);
        return (
          <TouchableOpacity
            key={cat.name}
            onPress={() => toggleCategory(cat.name)}
            style={{
              paddingVertical: 6,
              paddingHorizontal: 12,
              borderRadius: 999,
              backgroundColor: active ? cat.color : theme.colors.neutral[200],
            }}
          >
            <Text style={{ color: active ? theme.colors.neutral[900] : theme.colors.text.primary }}>
              {cat.name}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
