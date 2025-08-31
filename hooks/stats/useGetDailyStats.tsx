import api from '@/api';
import { TIME } from '@/constants/Time';
import { useQuery } from '@tanstack/react-query';

export type DailyStats = {
  tripId: string;
  day: Date;
  expenseCount: number;
  totalSpentOriginal: number;
  totalSpentConverted: number;
  avgSpentOriginal: number;
  avgSpentConverted: number;
  maxSpentOriginal: number;
  maxSpentConverted: number;
  topCategory: string;
};

export const useGetDailyStats = (tripId?: string, customDate?: Date) => {
  return useQuery<DailyStats>({
    queryKey: ['stats', tripId, 'daily', customDate?.toISOString()],
    queryFn: async () => {
      const params: any = {};
      if (customDate) {
        params.date = customDate.toISOString();
      }

      const { data } = await api.get(`/expenses/trip/${tripId}/stats/daily`, { params });
      return data;
    },
    staleTime: TIME.FIVE_MINUTES_IN_MILLISECONDS,
    enabled: !!tripId,
  });
};
