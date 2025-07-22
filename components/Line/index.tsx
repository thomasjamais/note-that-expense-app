import { useGetActiveTrip } from '@/hooks/useGetActiveTrip';
import { useGetLineChartForTripId } from '@/hooks/useGetLineChartForTripId';
import { PeriodRange } from '@/hooks/useGetPieChartForTripId';
import { Text, View } from 'react-native';
import Categories from './Categories';
import Chart from './Chart';

type LineProps = {
  range: PeriodRange;
  customStart?: string;
  customEnd?: string;
  selectedCategories: string[];
  toggleCategory: (name: string) => void;
  setSelectedCategories: React.Dispatch<React.SetStateAction<string[]>>;
};

export default function Line({
  range,
  customStart,
  customEnd,
  selectedCategories,
  toggleCategory,
  setSelectedCategories,
}: LineProps) {
  const { data: activeTripId } = useGetActiveTrip();

  const { data: stackedBarData } = useGetLineChartForTripId(
    activeTripId?.id,
    range,
    customStart ? new Date(customStart) : undefined,
    customEnd ? new Date(customEnd) : undefined,
  );

  if (!stackedBarData) return null;

  return (
    <View style={{ marginTop: 24 }}>
      <Text style={{ textAlign: 'center', fontSize: 18, fontWeight: 'bold', marginBottom: 8 }}>
        Dépenses journalières
      </Text>
      <Categories
        stackedBarData={stackedBarData}
        selectedCategories={selectedCategories}
        toggleCategory={toggleCategory}
      />

      <Chart
        stackedBarData={stackedBarData}
        selectedCategories={selectedCategories}
        setSelectedCategories={setSelectedCategories}
      />
    </View>
  );
}
