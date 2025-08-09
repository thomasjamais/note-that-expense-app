import api from '@/api';
import { TIME } from '@/constants/Time';
import { useQuery } from '@tanstack/react-query';

export type BudgetUsage = {
  budgetId: string;
  tripId: string;
  name: string;
  budgetAmount: string;
  currencyId: string;
  scope: 'total' | 'monthly';
  periodStart?: Date;
  periodEnd?: Date;
  spentConverted: number;
};

export const useGetCurrentBudgetUsageByTripId = (tripId?: string) => {
  return useQuery<BudgetUsage>({
    queryKey: ['budgets', 'usage', tripId],
    queryFn: async () => {
      const { data } = await api.get(`/budgets/trip/${tripId}/usage`);
      return data;
    },
    staleTime: TIME.FIVE_MINUTES_IN_MILLISECONDS,
    enabled: !!tripId,
  });
};
