import { TIME } from '@/constants/Time';
import api from '@/lib/api';
import { useQuery } from '@tanstack/react-query';

export type TripWithCurrencies = {
  id: string;
  userId: string;
  label: string;
  localCurrencyId: string;
  homeCurrencyId: string;
  localCurrencySymbol: string;
  homeCurrencySymbol: string;
  localCurrencyName: string;
  homeCurrencyName: string;
  isActive: boolean;
  startDate: Date;
  endDate: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

export const useGetActiveTrip = () => {
  return useQuery<TripWithCurrencies>({
    queryKey: ['trips', 'active'],
    queryFn: async () => {
      const { data } = await api.get('/trips/active');
      return data;
    },
    staleTime: TIME.FIVE_MINUTES_IN_MILLISECONDS,
  });
};
