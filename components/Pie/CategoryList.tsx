import { PieChartData } from '@/hooks/useGetPieChartForTripId';
import React from 'react';
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
  return (
    <View style={{ margin: 12 }}>
      {pieChartData?.map((cat: any) => (
        <TouchableOpacity
          key={cat.name}
          onPress={() => toggleCategory(cat.name)}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginVertical: 4,
            opacity: selectedCategories.includes(cat.name) ? 1 : 0.5,
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
          <Text style={{ fontSize: 14, fontWeight: '600' }}>{cat.population} €</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}
