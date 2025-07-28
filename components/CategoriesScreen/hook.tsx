import api from '@/api';
import { useSnackbar } from '@/contexts/SnackbarContext';
import { queryClient } from '@/lib/queryClient';
import { useMutation } from '@tanstack/react-query';

type AddCategoryInput = {
  label: string;
  color: string;
};

export const useAddCategory = () => {
  const { showMessage } = useSnackbar();

  return useMutation({
    mutationFn: async (data: AddCategoryInput) => {
      const response = await api.post('/categories', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      showMessage('Catégorie ajoutée avec succès !', 'success');
    },
    onError: (error) => {
      console.error('Error adding category:', error);
      showMessage(`Erreur lors de l'ajout de la catégorie : ${error.message}`, 'error');
    },
  });
};

export const useDeleteCategory = () => {
  const { showMessage } = useSnackbar();

  return useMutation({
    mutationFn: async (categoryId: string) => {
      const response = await api.delete(`/categories/${categoryId}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      showMessage('Catégorie supprimée avec succès !', 'success');
    },
    onError: (error) => {
      console.error('Error deleting category:', error);
      showMessage(`Erreur lors de la suppression de la catégorie : ${error.message}`, 'error');
    },
  });
};
