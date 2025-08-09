import api from '@/api';
import { useSnackbar } from '@/contexts/SnackbarContext';
import { queryClient } from '@/lib/queryClient';
import { useMutation } from '@tanstack/react-query';

type UpdateExpenseInput = {
  expenseId: string;
  categoryId: string;
  tripId: string;
  label: string;
  originalAmount: number;
  date: Date;
};

export const useUpdateExpense = () => {
  const { showMessage } = useSnackbar();

  return useMutation({
    mutationFn: async (data: UpdateExpenseInput) => {
      const { tripId, expenseId, ...expenseData } = data;
      const response = await api.patch(
        `/expenses/trip/${tripId}/expenses/${expenseId}`,
        expenseData,
      );

      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      queryClient.invalidateQueries({ queryKey: ['charts'] });
      queryClient.invalidateQueries({ queryKey: ['stats'] });
      queryClient.invalidateQueries({ queryKey: ['budgets', 'usage'] });

      showMessage('Dépense mise à jour avec succès !', 'success');
    },
    onError: (error) => {
      showMessage(`Erreur lors de la mise à jour de la dépense : ${error.message}`, 'error');
    },
  });
};
