import { useQuery } from '@tanstack/react-query';
import api from '@/api';
import { TIME } from '@/constants/Time';

export interface Trip {
  id: string;
  name: string;
  startDate: string;
  endDate: string | null;
  isActive: boolean;
  budget: number | null;
  currency: string;
}

export const useGetUserTrips = () => {
  return useQuery<Trip[]>({
    queryKey: ['trips', 'all'],
    queryFn: async () => {
      const { data } = await api.get('/trips');
      return data.map((trip: any) => ({
        id: trip.id,
        name: trip.label,
        startDate: trip.startDate,
        endDate: trip.endDate,
        isActive: trip.isActive,
        budget: null,
        currency: '',
      }));
    },
    staleTime: TIME.FIVE_MINUTES_IN_MILLISECONDS,
  });
};
