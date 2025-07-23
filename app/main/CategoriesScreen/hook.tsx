import api from '@/lib/api';
import { queryClient } from '@/lib/queryClient';
import { useMutation } from '@tanstack/react-query';

type AddCategoryInput = {
  label: string;
  color: string;
};

export const useAddCategory = () => {
  return useMutation({
    mutationFn: async (data: AddCategoryInput) => {
      console.log('Adding category with data:', data);
      const response = await api.post('/categories', data);
      console.log('Category added successfully:', response.data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
    onError: (error) => {
      console.error('Error adding category:', error);
      alert('Failed to add category. Please try again.');
    },
  });
};

export const useDeleteCategory = () => {
  return useMutation({
    mutationFn: async (categoryId: string) => {
      console.log('Deleting category with ID:', categoryId);
      const response = await api.delete(`/categories/${categoryId}`);
      console.log('Category deleted successfully:', response.data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
    onError: (error) => {
      console.error('Error deleting category:', error);
      alert('Failed to delete category. Please try again.');
    },
  });
};
