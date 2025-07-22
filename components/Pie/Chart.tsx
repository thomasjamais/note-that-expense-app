import { PieChartData } from '@/hooks/useGetPieChartForTripId';
import React from 'react';
import { Dimensions, View } from 'react-native';
import { PieChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width;

type ChartProps = {
  filteredData: PieChartData[];
};

export default function Chart({ filteredData }: ChartProps) {
  return (
    <View>
      {filteredData && filteredData.length > 0 && (
        <View style={{ width: '100%', alignItems: 'center' }}>
          <PieChart
            data={filteredData}
            width={screenWidth * 0.85}
            height={220}
            chartConfig={{
              backgroundColor: '#fff',
              backgroundGradientFrom: '#fff',
              backgroundGradientTo: '#fff',
              color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            }}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="15"
            hasLegend={false}
            absolute
          />
        </View>
      )}
    </View>
  );
}
