import api from '@/api';
import { useSnackbar } from '@/contexts/SnackbarContext';
import { queryClient } from '@/lib/queryClient';
import { useMutation } from '@tanstack/react-query';

type DeleteTripInput = {
  tripId: string;
};

export const useDeleteTrip = () => {
  const { showMessage } = useSnackbar();

  return useMutation({
    mutationFn: async (data: DeleteTripInput) => {
      const response = await api.delete(`/trips/${data.tripId}`);

      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trips'] });
      queryClient.invalidateQueries({ queryKey: ['charts'] });
      queryClient.invalidateQueries({ queryKey: ['stats'] });
      showMessage('Voyage supprimé avec succès !', 'success');
    },
    onError: (error) => {
      showMessage(`Erreur lors de la suppression du voyage : ${error.message}`, 'error');
    },
  });
};
