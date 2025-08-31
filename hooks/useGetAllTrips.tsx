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

export const useGetAllTrips = () => {
  return useQuery<Trip[]>({
    queryKey: ['trips', 'all'],
    queryFn: async () => {
      const { data } = await api.get('/trips');
      return data.map((trip: any) => ({
        id: trip.id,
        name: trip.name,
        startDate: trip.start_date,
        endDate: trip.end_date,
        isActive: trip.is_active,
        budget: trip.budget,
        currency: trip.currency,
      }));
    },
    staleTime: TIME.FIVE_MINUTES_IN_MILLISECONDS,
  });
};
