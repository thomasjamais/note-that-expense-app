import api from '@/api';
import { useSnackbar } from '@/contexts/SnackbarContext';
import { queryClient } from '@/lib/queryClient';
import { useMutation } from '@tanstack/react-query';

type AddBudgetInput = {
  tripId: string;
  name: string;
  amount: number;
  scope: 'total' | 'monthly';
};

export const useAddBudget = () => {
  const { showMessage } = useSnackbar();

  return useMutation({
    mutationFn: async (data: AddBudgetInput) => {
      const { tripId, ...budgetData } = data;
      const response = await api.post(`/budgets/trip/${data.tripId}`, budgetData);

      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trips'] });
      queryClient.invalidateQueries({ queryKey: ['budgets'] });
      showMessage('Budget ajouté avec succès !', 'success');
    },
    onError: (error) => {
      showMessage(`Erreur lors de l'ajout du budget : ${error.message}`, 'error');
    },
  });
};
