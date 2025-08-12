import { LineChartData } from '@/hooks/useGetLineChartForTripId';
import React, { useEffect } from 'react';
import { Dimensions, ScrollView } from 'react-native';
import { StackedBarChart } from 'react-native-chart-kit';

const screenWidth3 = Dimensions.get('window').width;

export default function ChartLine({
  stackedBarData,
  selectedCategories,
  setSelectedCategories,
}: {
  stackedBarData: LineChartData;
  selectedCategories: string[];
  setSelectedCategories: React.Dispatch<React.SetStateAction<string[]>>;
}) {
  useEffect(() => {
    if (stackedBarData && selectedCategories.length === 0)
      setSelectedCategories(stackedBarData.legend);
  }, [stackedBarData, selectedCategories]);
  const idx = stackedBarData.legend
    .map((c: string, i: number) => (selectedCategories.includes(c) ? i : -1))
    .filter((i: number) => i !== -1);
  const data = stackedBarData.data.map((row: number[]) => idx.map((i: number) => row[i]));
  const colors = idx.map((i: number) => stackedBarData.barColors[i]);
  const legend = idx.map((i: number) => stackedBarData.legend[i]);
  const barWidth = 60;
  const chartWidth = Math.max(screenWidth3, stackedBarData.labels.length * barWidth);
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: 16 }}
    >
      <StackedBarChart
        data={{ labels: stackedBarData.labels, legend, data, barColors: colors }}
        width={chartWidth}
        height={320}
        withHorizontalLabels
        hideLegend
        chartConfig={{
          backgroundGradientFrom: '#fff',
          backgroundGradientTo: '#fff',
          color: (o = 1) => `rgba(0,0,0,${o})`,
          decimalPlaces: 0,
          propsForBackgroundLines: { strokeWidth: 1, strokeDasharray: '', stroke: '#e0e0e0' },
        }}
      />
    </ScrollView>
  );
}
