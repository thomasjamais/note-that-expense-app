import api from '@/api';
import { TIME } from '@/constants/Time';
import { queryClient } from '@/lib/queryClient';
import { useMutation, useQuery, UseQueryResult } from '@tanstack/react-query';

type AddTripInput = {
  label: string;
  localCurrencyId: string;
  homeCurrencyId: string;
  startDate: Date;
  endDate?: Date;
  isActive: boolean;
};

export type Trip = {
  id: string;
  label: string;
  localCurrencyId: string;
  homeCurrencyId: string;
  startDate: Date;
  endDate?: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
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

export const useListTrips = (): UseQueryResult<Trip[]> => {
  return useQuery({
    queryKey: ['trips'],
    queryFn: async () => {
      const response = await api.get('/trips/list');

      return response.data;
    },
    staleTime: TIME.FIVE_MINUTES_IN_MILLISECONDS,
  });
};
