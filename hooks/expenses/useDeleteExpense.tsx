import api from '@/lib/api';
import { queryClient } from '@/lib/queryClient';
import { useMutation } from '@tanstack/react-query';

type DeleteExpenseInput = {
  tripId: string;
  expenseId: string;
};

export const useDeleteExpense = () => {
  return useMutation({
    mutationFn: async (data: DeleteExpenseInput) => {
      const response = await api.delete(`/expenses/trip/${data.tripId}/expenses/${data.expenseId}`);

      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      queryClient.invalidateQueries({ queryKey: ['charts'] });
    },
    onError: (error) => {
      alert('Failed to delete expense. Please try again.');
    },
  });
};
