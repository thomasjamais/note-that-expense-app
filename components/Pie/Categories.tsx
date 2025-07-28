import { PieChartData } from '@/hooks/useGetPieChartForTripId';
import React, { useEffect } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

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
  setSelectedCategories,
}: CategoriesProps) {
  useEffect(() => {
    if (pieChartData && selectedCategories.length === 0) {
      setSelectedCategories(pieChartData.map((c: any) => c.name));
    }
  }, [pieChartData, selectedCategories, setSelectedCategories]);

  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 12 }}>
      {pieChartData?.map((cat: any) => (
        <TouchableOpacity
          key={cat.name}
          onPress={() => toggleCategory(cat.name)}
          style={{
            padding: 6,
            margin: 4,
            borderRadius: 8,
            backgroundColor: selectedCategories.includes(cat.name) ? cat.color : '#ccc',
          }}
        >
          <Text style={{ color: '#000' }}>{cat.name}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}
