import api from '@/api';
import { TIME } from '@/constants/Time';
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
  customStart?: Date,
  customEnd?: Date,
) => {
  return useQuery<PieChartData[]>({
    queryKey: [
      'charts',
      'pie',
      tripId,
      range,
      customStart?.toISOString(),
      customEnd?.toISOString(),
    ],
    queryFn: async () => {
      if (!tripId) return [];

      const params = new URLSearchParams();
      params.append('range', range);

      if (customStart) {
        params.append('start', customStart.toISOString());
      }
      if (customEnd) {
        params.append('end', customEnd.toISOString());
      }

      const { data } = await api.get(`/charts/pie/trip/${tripId}?${params.toString()}`);

      // Transformer les données dans le format attendu par le composant Pie
      const pie = data.map((item: any) => ({
        name: item.categoryLabel.trim(),
        population: parseFloat(item.totalAmount.toString()),
        color: item.categoryColor,
        legendFontColor: '#7F7F7F',
        legendFontSize: 14,
      }));

      return pie;
    },
    enabled: !!tripId,
    staleTime: TIME.FIVE_MINUTES_IN_MILLISECONDS,
  });
};
