import { PieChartData } from '@/hooks/useGetPieChartForTripId';
import React from 'react';
import { Dimensions, View } from 'react-native';
import { PieChart } from 'react-native-chart-kit';

const screenWidth2 = Dimensions.get('window').width;

export default function Chart({ filteredData }: { filteredData: PieChartData[] }) {
  return (
    <View style={{ width: '100%', alignItems: 'center' }}>
      <PieChart
        data={filteredData}
        width={screenWidth2 * 0.88}
        height={220}
        chartConfig={{
          backgroundColor: '#fff',
          backgroundGradientFrom: '#fff',
          backgroundGradientTo: '#fff',
          color: (o = 1) => `rgba(0,0,0,${o})`,
        }}
        accessor="population"
        backgroundColor="transparent"
        paddingLeft="15"
        hasLegend={false}
        absolute
      />
    </View>
  );
}
