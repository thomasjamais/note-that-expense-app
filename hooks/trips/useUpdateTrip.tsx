import api from '@/api';
import { queryClient } from '@/lib/queryClient';
import { useMutation } from '@tanstack/react-query';

type UpdateTripInput = {
  tripId: string;
  label: string;
  localCurrencyId: string;
  homeCurrencyId: string;
  isActive: boolean;
  startDate: Date;
  endDate?: Date | null;
};

export const useUpdateTrip = () => {
  return useMutation({
    mutationFn: async (data: UpdateTripInput) => {
      const { tripId, ...tripData } = data;
      const response = await api.patch(`/trips/${tripId}`, tripData);

      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trips'] });
      queryClient.invalidateQueries({ queryKey: ['charts'] });
    },
    onError: (error) => {
      alert('Failed to update trip. Please try again.');
    },
  });
};
