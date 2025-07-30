import api from '@/api';
import { useSnackbar } from '@/contexts/SnackbarContext';
import { queryClient } from '@/lib/queryClient';
import { useMutation } from '@tanstack/react-query';

type AddExpenseInput = {
  categoryId: string;
  tripId: string;
  label: string;
  originalAmount: number;
  date: Date;
};

export const useAddExpense = () => {
  const { showMessage } = useSnackbar();

  return useMutation({
    mutationFn: async (data: AddExpenseInput) => {
      const { tripId, ...expenseData } = data;
      const response = await api.post(`/expenses/trip/${data.tripId}`, expenseData);

      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      queryClient.invalidateQueries({ queryKey: ['charts'] });
      queryClient.invalidateQueries({ queryKey: ['stats'] });
      showMessage('Dépense ajoutée avec succès !', 'success');
    },
    onError: (error) => {
      showMessage(`Erreur lors de l'ajout de la dépense : ${error.message}`, 'error');
    },
  });
};
