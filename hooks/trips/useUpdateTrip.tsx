import api from '@/api';
import { useSnackbar } from '@/contexts/SnackbarContext';
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
  const { showMessage } = useSnackbar();

  return useMutation({
    mutationFn: async (data: UpdateTripInput) => {
      const { tripId, ...tripData } = data;
      const response = await api.patch(`/trips/${tripId}`, tripData);

      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trips'] });
      queryClient.invalidateQueries({ queryKey: ['charts'] });
      showMessage('Voyage mis à jour avec succès !', 'success');
    },
    onError: (error) => {
      showMessage(`Erreur lors de la mise à jour du voyage : ${error.message}`, 'error');
    },
  });
};
