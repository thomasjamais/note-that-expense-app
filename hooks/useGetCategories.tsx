import { TIME } from '@/constants/Time';
import api from '@/lib/api';
import { useQuery } from '@tanstack/react-query';

export type Category = {
  id: string;
  userId: string;
  label: string;
  color: string;
  createdAt: Date;
  updatedAt: Date;
};

export const useGetCategories = () => {
  return useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data } = await api.get(`/categories`);
      console.log('Fetched categories:', data);
      return data;
    },
    staleTime: TIME.FIVE_MINUTES_IN_MILLISECONDS,
  });
};
