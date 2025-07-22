import { LineChartData } from '@/hooks/useGetLineChartForTripId';
import { Dimensions, ScrollView } from 'react-native';
import { StackedBarChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width;

type ChartProps = {
  stackedBarData: LineChartData;
  selectedCategories: string[];
  setSelectedCategories: React.Dispatch<React.SetStateAction<string[]>>;
};

export default function Chart({
  stackedBarData,
  selectedCategories,
  setSelectedCategories,
}: ChartProps) {
  if (stackedBarData && selectedCategories.length === 0) {
    setSelectedCategories(stackedBarData.legend);
  }

  const categoryIndexes = stackedBarData.legend
    .map((cat, index) => (selectedCategories.includes(cat) ? index : -1))
    .filter((index) => index !== -1);

  const filteredData = stackedBarData.data.map((row: number[]) =>
    categoryIndexes.map((i) => row[i]),
  );

  const filteredColors = categoryIndexes.map((i) => stackedBarData.barColors[i]);
  const filteredLegend = categoryIndexes.map((i) => stackedBarData.legend[i]);

  const barWidth = 60;
  const chartWidth = Math.max(screenWidth, stackedBarData.labels.length * barWidth);

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: 16 }}
    >
      <StackedBarChart
        data={{
          labels: stackedBarData.labels,
          legend: filteredLegend,
          data: filteredData,
          barColors: filteredColors,
        }}
        width={chartWidth}
        height={320}
        withHorizontalLabels
        hideLegend
        chartConfig={{
          backgroundGradientFrom: '#fff',
          backgroundGradientTo: '#fff',
          color: (opacity = 1) => `rgba(0,0,0,${opacity})`,
          decimalPlaces: 0,
          propsForBackgroundLines: {
            strokeWidth: 1,
            strokeDasharray: '',
            stroke: '#e0e0e0',
          },
        }}
      />
    </ScrollView>
  );
}
