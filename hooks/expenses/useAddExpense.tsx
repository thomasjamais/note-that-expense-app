import api from '@/lib/api';
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
  return useMutation({
    mutationFn: async (data: AddExpenseInput) => {
      const { tripId, ...expenseData } = data;
      const response = await api.post(`/expenses/trip/${data.tripId}`, expenseData);

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
