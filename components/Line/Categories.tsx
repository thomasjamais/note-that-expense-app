import { LineChartData } from '@/hooks/useGetLineChartForTripId';
import { Text, TouchableOpacity, View } from 'react-native';

type CategoriesProps = {
  stackedBarData: LineChartData;
  selectedCategories: string[];
  toggleCategory: (name: string) => void;
};

export default function Categories({
  stackedBarData,
  selectedCategories,
  toggleCategory,
}: CategoriesProps) {
  return (
    <View
      style={{
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        marginBottom: 12,
      }}
    >
      {stackedBarData.legend.map((cat, i) => (
        <TouchableOpacity
          key={cat}
          onPress={() => toggleCategory(cat)}
          style={{
            padding: 6,
            margin: 4,
            borderRadius: 8,
            backgroundColor: selectedCategories.includes(cat)
              ? stackedBarData.barColors[i]
              : '#ccc',
          }}
        >
          <Text style={{ color: '#000' }}>{cat}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}
