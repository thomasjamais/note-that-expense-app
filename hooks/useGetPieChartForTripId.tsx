import { TIME } from '@/constants/Time';
import api from '@/lib/api';
import { useQuery } from '@tanstack/react-query';

export type PieChartInput = {
  userId: string;
  tripId: string;
  categoryId: string;
  categoryLabel: string;
  categoryColor: string;
  totalAmount: number;
};

export type PieChartData = {
  name: string;
  population: number;
  color: string;
  legendFontColor: string;
  legendFontSize: number;
};

export type PeriodRange = 'week' | 'month' | 'total' | 'custom';

export const useGetPieChartForTripId = (
  tripId?: string,
  range: PeriodRange = 'total',
  start?: Date,
  end?: Date,
) => {
  return useQuery<PieChartData[]>({
    queryKey: [
      'charts',
      'pie',
      tripId,
      range,
      start ? start.toString() : null,
      end ? end.toString() : null,
    ],
    queryFn: async () => {
      if (!tripId) return [];

      let url = `/charts/pie/trip/${tripId}?range=${range}`;

      if (range === 'custom' && start && end) {
        url += `&start=${encodeURIComponent(start.toISOString())}&end=${encodeURIComponent(end.toISOString())}`;
      }

      const { data } = await api.get(url);

      const pie = data.map((item: PieChartInput) => ({
        name: item.categoryLabel.trim(),
        population: parseFloat(item.totalAmount.toString()),
        color: item.categoryColor,
        legendFontColor: '#7F7F7F',
        legendFontSize: 14,
      }));

      return pie;
    },
    staleTime: TIME.FIVE_MINUTES_IN_MILLISECONDS,
    enabled: !!tripId,
  });
};
