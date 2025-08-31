import api from '@/api';
import { TIME } from '@/constants/Time';
import { useQuery } from '@tanstack/react-query';
import { TripWithCurrencies } from '../useGetActiveTrip';

export const useGetTripById = (tripId?: string) => {
  return useQuery<TripWithCurrencies>({
    queryKey: ['trips', tripId],
    queryFn: async () => {
      const { data } = await api.get(`/trips/${tripId}`);
      return data;
    },
    staleTime: TIME.FIVE_MINUTES_IN_MILLISECONDS,
    enabled: !!tripId,
  });
};
