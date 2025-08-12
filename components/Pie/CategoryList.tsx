import { PieChartData } from '@/hooks/useGetPieChartForTripId';
import { theme } from '@/theme';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

export default function CategoryList({
  pieChartData,
  selectedCategories,
  toggleCategory,
}: {
  pieChartData: PieChartData[];
  selectedCategories: string[];
  toggleCategory: (n: string) => void;
}) {
  return (
    <View style={{ marginTop: theme.spacing.md }}>
      {pieChartData?.map((cat: any) => (
        <TouchableOpacity
          key={cat.name}
          onPress={() => toggleCategory(cat.name)}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginVertical: 6,
            opacity: selectedCategories.includes(cat.name) ? 1 : 0.45,
          }}
        >
          <View
            style={{
              width: 16,
              height: 16,
              borderRadius: 4,
              backgroundColor: cat.color,
              marginRight: 8,
            }}
          />
          <Text style={{ flex: 1, fontSize: 14 }}>{cat.name}</Text>
          <Text style={{ fontSize: 14, fontWeight: '700' }}>{cat.population} €</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}
