import { useQuery } from '@tanstack/react-query';
import api from '@/api';
import { TIME } from '@/constants/Time';

export interface CategoryForSelector {
  id: string;
  name: string;
  color: string;
}

export const useGetCategoriesForSelector = () => {
  return useQuery<CategoryForSelector[]>({
    queryKey: ['categories', 'forSelector'],
    queryFn: async () => {
      const { data } = await api.get('/categories');
      return data.map((category: any) => ({
        id: category.label, // Utiliser le label comme ID pour être compatible avec les graphiques
        name: category.label,
        color: category.color,
      }));
    },
    staleTime: TIME.FIVE_MINUTES_IN_MILLISECONDS,
  });
};
