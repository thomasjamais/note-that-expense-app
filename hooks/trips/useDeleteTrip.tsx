import api from '@/api';
import { queryClient } from '@/lib/queryClient';
import { useMutation } from '@tanstack/react-query';

type DeleteTripInput = {
  tripId: string;
};

export const useDeleteTrip = () => {
  return useMutation({
    mutationFn: async (data: DeleteTripInput) => {
      const response = await api.delete(`/trips/${data.tripId}`);

      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trips'] });
      queryClient.invalidateQueries({ queryKey: ['charts'] });
    },
    onError: (error) => {
      alert('Failed to delete trip. Please try again.');
    },
  });
};
