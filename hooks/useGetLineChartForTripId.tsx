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
  customStart?: Date,
  customEnd?: Date,
) => {
  return useQuery<LineChartData>({
    queryKey: ['lineChart', tripId, range, customStart?.toISOString(), customEnd?.toISOString()],
    queryFn: async () => {
      if (!tripId) return { labels: [], legend: [], barColors: [], data: [] };

      const params = new URLSearchParams();
      params.append('range', range);

      if (customStart) {
        params.append('start', customStart.toISOString());
      }
      if (customEnd) {
        params.append('end', customEnd.toISOString());
      }

      const { data } = await api.get(`/charts/line/trip/${tripId}?${params.toString()}`);
      return data;
    },
    enabled: !!tripId,
    staleTime: TIME.FIVE_MINUTES_IN_MILLISECONDS,
  });
};
