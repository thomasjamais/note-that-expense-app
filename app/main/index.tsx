import AddExpense from '@/components/Expenses/AddExpense';
import ExpenseList from '@/components/Expenses/ExpenseList';
import Skeleton from '@/components/Skeleton';
import AppHeader from '@/components/ui/AppHeader';
import IconButton from '@/components/ui/IconButton';
import { Screen } from '@/components/ui/Screen';
import { useGetActiveTrip } from '@/hooks/useGetActiveTrip';
import { useGetCategories } from '@/hooks/useGetCategories';
import { theme } from '@/theme';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, Text, View } from 'react-native';

export default function ExpenseTrackerScreen() {
  const { focusTab } = useLocalSearchParams();

  const { t } = useTranslation();
  const [index, setIndex] = useState(focusTab || 0);

  useEffect(() => {
    if (focusTab) {
      setIndex(Number(focusTab));
    }
  }, [focusTab]);

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
    <Screen>
      <AppHeader
        title={t('tabs.expenses')}
        right={
          <>
            <IconButton onPress={() => setIndex(0)}>
              <FontAwesome name="plus" size={16} color={theme.colors.text.primary} />
            </IconButton>
            <IconButton onPress={() => setIndex(1)}>
              <FontAwesome name="calendar" size={16} color={theme.colors.text.primary} />
            </IconButton>
          </>
        }
        variant="large"
        elevated
      />
      {isActiveTripLoading || isCategoriesLoading ? (
        <>
          <View style={{ alignItems: 'center', marginVertical: 20 }}>
            <Skeleton width={120} height={15} />
            <Skeleton width={120} height={20} style={{ marginTop: 10 }} />
            <Skeleton width={80} height={20} style={{ marginTop: 6 }} />
          </View>
        </>
      ) : (
        <ScrollView
          contentContainerStyle={{ padding: theme.spacing.lg, paddingBottom: theme.spacing.xl }}
        >
          {index === 0 ? (
            <AddExpense activeTrip={activeTrip!} categories={categories!} />
          ) : (
            <ExpenseList activeTrip={activeTrip!} categories={categories!} />
          )}
        </ScrollView>
      )}
    </Screen>
  );
}
