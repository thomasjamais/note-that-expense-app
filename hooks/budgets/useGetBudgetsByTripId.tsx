import api from '@/api';
import { TIME } from '@/constants/Time';
import { useQuery } from '@tanstack/react-query';

export type Budgets = {
  id: string;
  tripId: string;
  name: string;
  amount: string;
  currencyId: string;
  scope: 'total' | 'monthly';
  startDate?: Date;
  endDate?: Date;
  createdAt: Date;
  updatedAt: Date;
};

export const useGetBudgets = (tripId?: string) => {
  return useQuery<Budgets[]>({
    queryKey: ['budgets', tripId],
    queryFn: async () => {
      const { data } = await api.get(`/budgets/trip/${tripId}`);
      return data;
    },
    staleTime: TIME.FIVE_MINUTES_IN_MILLISECONDS,
    enabled: !!tripId,
  });
};
