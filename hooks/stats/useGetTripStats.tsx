import api from '@/api';
import { TIME } from '@/constants/Time';
import { useQuery } from '@tanstack/react-query';

export type TripStats = {
  tripId: string;
  dayCount: number;
  totalSpentOriginal: number;
  totalSpentConverted: number;
  avgDailySpentOriginal: number;
  avgDailySpentConverted: number;
  maxDailySpentOriginal: number;
  maxDailySpentConverted: number;
};

export const useGetTripStats = (tripId?: string) => {
  return useQuery<TripStats>({
    queryKey: ['stats', tripId, 'summary'],
    queryFn: async () => {
      const { data } = await api.get(`/expenses/trip/${tripId}/stats/summary`);
      return data;
    },
    staleTime: TIME.FIVE_MINUTES_IN_MILLISECONDS,
    enabled: !!tripId,
  });
};
