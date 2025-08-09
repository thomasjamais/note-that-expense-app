import api from '@/api';
import { useSnackbar } from '@/contexts/SnackbarContext';
import { queryClient } from '@/lib/queryClient';
import { useMutation } from '@tanstack/react-query';

type EditBudgetInput = {
  tripId: string;
  name: string;
  amount: number;
  scope: 'total' | 'monthly';
};

export const useEditBudget = () => {
  const { showMessage } = useSnackbar();

  return useMutation({
    mutationFn: async (data: EditBudgetInput) => {
      const { tripId, ...budgetData } = data;
      const response = await api.patch(`/budgets/trip/${data.tripId}`, budgetData);

      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trips'] });
      queryClient.invalidateQueries({ queryKey: ['budgets'] });
      showMessage('Budget modifié avec succès !', 'success');
    },
    onError: (error) => {
      showMessage(`Erreur lors de la modification du budget : ${error.message}`, 'error');
    },
  });
};
