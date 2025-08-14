import { PieChartData } from '@/hooks/useGetPieChartForTripId';
import { theme } from '@/theme';
import React from 'react';
import { ScrollView, Text, TouchableOpacity } from 'react-native';

type CategoriesProps = {
  pieChartData: PieChartData[];
  selectedCategories: string[];
  toggleCategory: (name: string) => void;
  setSelectedCategories: React.Dispatch<React.SetStateAction<string[]>>;
};

export default function Categories({
  pieChartData,
  selectedCategories,
  toggleCategory,
}: CategoriesProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ gap: theme.spacing.xs, marginBottom: theme.spacing.sm }}
    >
      {pieChartData?.map((cat) => {
        const active = selectedCategories.includes(cat.name);
        return (
          <TouchableOpacity
            key={cat.name}
            onPress={() => toggleCategory(cat.name)}
            style={{
              paddingVertical: 8,
              paddingHorizontal: 14,
              borderRadius: 999,
              borderWidth: 1,
              borderColor: active ? cat.color : theme.colors.neutral[200],
              backgroundColor: active ? cat.color + '22' : theme.colors.surface,
            }}
          >
            <Text
              style={{
                fontFamily: theme.typography.family.medium,
                color: active ? theme.colors.text.primary : theme.colors.text.secondary,
              }}
            >
              {cat.name}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}
