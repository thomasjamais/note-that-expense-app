import api from '@/api';
import { TIME } from '@/constants/Time';
import { useQuery } from '@tanstack/react-query';
import { PeriodRange } from './useGetPieChartForTripId';

export type LineChartData = {
  labels: string[];
  legend: string[];
  data: number[][];
  barColors: string[];
};

export const useGetLineChartForTripId = (
  tripId?: string,
  range: PeriodRange = 'total',
  start?: Date,
  end?: Date,
) => {
  return useQuery<LineChartData>({
    queryKey: [
      'charts',
      'line',
      tripId,
      range,
      start ? start.toString() : null,
      end ? end.toString() : null,
    ],
    queryFn: async () => {
      let url = `/charts/line/trip/${tripId}?range=${range}`;

      if (range === 'custom' && start && end) {
        url += `&start=${encodeURIComponent(start.toISOString())}&end=${encodeURIComponent(end.toISOString())}`;
      }
      const { data } = await api.get(url);

      return data;
    },
    staleTime: TIME.FIVE_MINUTES_IN_MILLISECONDS,
    enabled: !!tripId,
  });
};
