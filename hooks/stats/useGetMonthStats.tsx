import api from '@/api';
import { TIME } from '@/constants/Time';
import { useQuery } from '@tanstack/react-query';

export type MonthStats = {
  tripId: string;
  month: string;
  dayCount: number;
  totalSpentOriginal: number;
  totalSpentConverted: number;
  avgDailySpentOriginal: number;
  avgDailySpentConverted: number;
  maxDailySpentOriginal: number;
  maxDailySpentConverted: number;
};

export const useGetMonthStats = (tripId?: string, currentMonth?: Date) => {
  return useQuery<MonthStats>({
    queryKey: ['stats', tripId, 'month', currentMonth?.toISOString()],
    queryFn: async () => {
      if (!tripId || !currentMonth) return null;

      const startOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
      const endOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);

      const { data } = await api.get(`/expenses/trip/${tripId}/stats/summary`, {
        params: {
          start: startOfMonth.toISOString(),
          end: endOfMonth.toISOString(),
        },
      });

      return data;
    },
    staleTime: TIME.FIVE_MINUTES_IN_MILLISECONDS,
    enabled: !!tripId && !!currentMonth,
  });
};
