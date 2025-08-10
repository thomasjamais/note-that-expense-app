import Expenses from '@/components/Expenses';
import Skeleton from '@/components/Skeleton';
import { useGetActiveTrip } from '@/hooks/useGetActiveTrip';
import { useGetCategories } from '@/hooks/useGetCategories';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';

export default function ExpenseTrackerScreen() {
  const { t } = useTranslation();
  const {
    data: activeTrip,
    isLoading: isActiveTripLoading,
    isError: isActiveTripError,
  } = useGetActiveTrip();
  const {
    data: categories,
    isLoading: isCategoriesLoading,
    isError: isCategoriesError,
  } = useGetCategories();

  if (isActiveTripError || isCategoriesError) {
    return (
      <View style={{ alignItems: 'center', marginVertical: 20 }}>
        <Text>{t('tripStats.error')}</Text>
      </View>
    );
  }

  return (
    <>
      {isActiveTripLoading || isCategoriesLoading ? (
        <>
          <View style={{ alignItems: 'center', marginVertical: 20 }}>
            <Skeleton width={120} height={15} />
            <Skeleton width={120} height={20} style={{ marginTop: 10 }} />
            <Skeleton width={80} height={20} style={{ marginTop: 6 }} />
          </View>
        </>
      ) : (
        <Expenses activeTrip={activeTrip!} categories={categories!} />
      )}
    </>
  );
}
