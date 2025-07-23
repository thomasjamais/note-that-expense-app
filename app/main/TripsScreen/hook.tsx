import { TIME } from '@/constants/Time';
import api from '@/lib/api';
import { queryClient } from '@/lib/queryClient';
import { useMutation, useQuery } from '@tanstack/react-query';

type AddTripInput = {
  label: string;
  localCurrencyId: string;
  homeCurrencyId: string;
  startDate: Date;
  endDate?: Date;
  isActive: boolean;
};

export const useAddTrip = () => {
  return useMutation({
    mutationFn: async (data: AddTripInput) => {
      const response = await api.post('/trips', data);

      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trips'] });
    },
    onError: (error) => {
      alert('Failed to add trip. Please try again.');
    },
  });
};

export const useListTrips = () => {
  return useQuery({
    queryKey: ['trips'],
    queryFn: async () => {
      const response = await api.get('/trips/list');

      return response.data;
    },
    staleTime: TIME.FIVE_MINUTES_IN_MILLISECONDS,
  });
};
