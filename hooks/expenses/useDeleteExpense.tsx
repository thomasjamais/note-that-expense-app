import api from '@/api';
import { useSnackbar } from '@/contexts/SnackbarContext';
import { queryClient } from '@/lib/queryClient';
import { useMutation } from '@tanstack/react-query';

type DeleteExpenseInput = {
  tripId: string;
  expenseId: string;
};

export const useDeleteExpense = () => {
  const { showMessage } = useSnackbar();

  return useMutation({
    mutationFn: async (data: DeleteExpenseInput) => {
      const response = await api.delete(`/expenses/trip/${data.tripId}/expenses/${data.expenseId}`);

      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      queryClient.invalidateQueries({ queryKey: ['charts'] });
      queryClient.invalidateQueries({ queryKey: ['stats'] });
      showMessage('Dépense supprimée avec succès !', 'success');
    },
    onError: (error) => {
      showMessage(`Erreur lors de la suppression de la dépense : ${error.message}`, 'error');
    },
  });
};
