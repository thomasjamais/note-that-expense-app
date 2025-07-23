import api from '@/lib/api';
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
    },
    onError: (error) => {
      alert('Failed to add expense. Please try again.');
    },
  });
};
