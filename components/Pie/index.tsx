import { useGetActiveTrip } from '@/hooks/useGetActiveTrip';
import { PeriodRange, useGetPieChartForTripId } from '@/hooks/useGetPieChartForTripId';
import React from 'react';
import { Dimensions, Text, View } from 'react-native';
import Skeleton from '../Skeleton';
import Categories from './Categories';
import CategoryList from './CategoryList';
import Chart from './Chart';

const screenWidth = Dimensions.get('window').width;

type PieProps = {
  range: PeriodRange;
  customStart?: string;
  customEnd?: string;
  selectedCategories: string[];
  toggleCategory: (name: string) => void;
  setSelectedCategories: React.Dispatch<React.SetStateAction<string[]>>;
};

export default function Pie({
  range,
  customStart,
  customEnd,
  selectedCategories,
  toggleCategory,
  setSelectedCategories,
}: PieProps) {
  const { data: activeTrip } = useGetActiveTrip();

  const { data: pieChartData, isLoading } = useGetPieChartForTripId(
    activeTrip?.id,
    range,
    customStart ? new Date(customStart) : undefined,
    customEnd ? new Date(customEnd) : undefined,
  );

  const filteredData = pieChartData?.filter((c: any) => selectedCategories.includes(c.name));

  console.log('Pie chart data:', pieChartData);
  return (
    <View>
      <Text style={{ textAlign: 'center', fontSize: 18, fontWeight: 'bold', marginBottom: 8 }}>
        Répartition des dépenses
      </Text>

      {isLoading ? (
        <View style={{ alignItems: 'center', marginVertical: 20 }}>
          <Skeleton width={screenWidth * 0.55} height={200} borderRadius={110} />
          <Skeleton width={120} height={20} style={{ marginTop: 10 }} />
          <Skeleton width={80} height={20} style={{ marginTop: 6 }} />
        </View>
      ) : (
        <>
          <Categories
            pieChartData={pieChartData!}
            selectedCategories={selectedCategories}
            setSelectedCategories={setSelectedCategories}
            toggleCategory={toggleCategory}
          />

          <Text>
            Total dépensé sur la période :{' '}
            {filteredData?.reduce((total, item) => item.population + total, 0).toFixed(2)}{' '}
            {activeTrip?.homeCurrencySymbol}
          </Text>

          <Chart filteredData={filteredData!} />

          <CategoryList
            pieChartData={pieChartData!}
            selectedCategories={selectedCategories}
            toggleCategory={toggleCategory}
          />
        </>
      )}
    </View>
  );
}
