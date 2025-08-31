import TripStats from '@/components/TripStats';
import Pie from '@/components/Pie';
import LineV2 from '@/components/LineV2';
import CategorySelector from '@/components/ui/CategorySelector';
import { useGetCategoriesForSelector } from '@/hooks/useGetCategoriesForSelector';
import { useGetActiveTrip } from '@/hooks/useGetActiveTrip';
import { useGetAllTrips } from '@/hooks/useGetAllTrips';
import { theme } from '@/theme';
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, View, Text } from 'react-native';
import IconButton from '@/components/ui/IconButton';
import FontAwesome from '@expo/vector-icons/FontAwesome';

export default function TripOverview() {
  const { t } = useTranslation();
  const { data: activeTrip } = useGetActiveTrip();
  const { data: allTrips = [] } = useGetAllTrips();
  const { data: categories = [] } = useGetCategoriesForSelector();
  const [selectedTrip, setSelectedTrip] = useState<string | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  // Initialiser avec le voyage actif
  useEffect(() => {
    if (activeTrip && !selectedTrip) {
      setSelectedTrip(activeTrip.id);
    }
  }, [activeTrip, selectedTrip]);

  const handleCategorySelectionChange = (selectedIds: string[]) => {
    setSelectedCategories(selectedIds);
  };

  const goToPreviousTrip = () => {
    if (!selectedTrip || allTrips.length === 0) return;

    const currentIndex = allTrips.findIndex((trip) => trip.id === selectedTrip);
    if (currentIndex > 0) {
      setSelectedTrip(allTrips[currentIndex - 1].id);
    }
  };

  const goToNextTrip = () => {
    if (!selectedTrip || allTrips.length === 0) return;

    const currentIndex = allTrips.findIndex((trip) => trip.id === selectedTrip);
    if (currentIndex < allTrips.length - 1) {
      setSelectedTrip(allTrips[currentIndex + 1].id);
    }
  };

  const canGoToPreviousTrip = () => {
    if (!selectedTrip || allTrips.length === 0) return false;
    const currentIndex = allTrips.findIndex((trip) => trip.id === selectedTrip);
    return currentIndex > 0;
  };

  const canGoToNextTrip = () => {
    if (!selectedTrip || allTrips.length === 0) return false;
    const currentIndex = allTrips.findIndex((trip) => trip.id === selectedTrip);
    return currentIndex < allTrips.length - 1;
  };

  const getCurrentTrip = () => {
    return allTrips.find((trip) => trip.id === selectedTrip) || activeTrip;
  };

  const currentTrip = getCurrentTrip();

  // Gérer les deux types de propriétés (name pour allTrips, label pour activeTrip)
  const getTripName = (trip: any) => {
    return trip?.name || trip?.label || '';
  };

  const getTripIsActive = (trip: any) => {
    return trip?.isActive || trip?.is_active || false;
  };

  return (
    <View style={{ flex: 1, position: 'relative' }}>
      {/* Sélecteur de catégories flottant - en dehors du ScrollView */}
      <CategorySelector
        categories={categories}
        selectedCategories={selectedCategories}
        onSelectionChange={handleCategorySelectionChange}
        position="top-right"
      />

      <ScrollView
        contentContainerStyle={{
          padding: theme.spacing.lg,
          paddingBottom: theme.spacing.xl,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Navigation entre les voyages */}
        {allTrips.length > 1 && (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: theme.spacing.xl,
              paddingHorizontal: theme.spacing.md,
            }}
          >
            <IconButton onPress={goToPreviousTrip} disabled={!canGoToPreviousTrip()}>
              <FontAwesome
                name="chevron-left"
                size={20}
                color={
                  canGoToPreviousTrip() ? theme.colors.text.primary : theme.colors.text.secondary
                }
              />
            </IconButton>

            <View style={{ alignItems: 'center', flex: 1 }}>
              <Text
                style={{
                  ...theme.typography.title,
                  color: theme.colors.text.primary,
                  textAlign: 'center',
                }}
              >
                {getTripName(currentTrip)}
              </Text>
              {getTripIsActive(currentTrip) && (
                <Text
                  style={{
                    ...theme.typography.small,
                    color: theme.colors.success[600],
                    marginTop: theme.spacing.xs,
                  }}
                >
                  {t('tripOverview.active')}
                </Text>
              )}
            </View>

            <IconButton onPress={goToNextTrip} disabled={!canGoToNextTrip()}>
              <FontAwesome
                name="chevron-right"
                size={20}
                color={canGoToNextTrip() ? theme.colors.text.primary : theme.colors.text.secondary}
              />
            </IconButton>
          </View>
        )}

        {/* Section Statistiques du voyage */}
        <View style={{ marginBottom: theme.spacing.xl }}>
          <Text
            style={{
              ...theme.typography.title,
              marginBottom: theme.spacing.lg,
              color: theme.colors.text.primary,
            }}
          >
            {t('tripOverview.statsTitle')}
          </Text>
          <TripStats />
        </View>

        {/* Section Répartition par catégories */}
        <View style={{ marginBottom: theme.spacing.xl }}>
          <Text
            style={{
              ...theme.typography.title,
              marginBottom: theme.spacing.lg,
              color: theme.colors.text.primary,
            }}
          >
            {t('tripOverview.categoriesTitle')}
          </Text>
          <Pie
            range="total"
            tripId={selectedTrip}
            selectedCategories={selectedCategories}
            toggleCategory={() => {}} // Géré par le CategorySelector
            setSelectedCategories={setSelectedCategories}
          />
        </View>

        {/* Section Évolution des dépenses */}
        <View style={{ marginBottom: theme.spacing.xl }}>
          <Text
            style={{
              ...theme.typography.title,
              marginBottom: theme.spacing.lg,
              color: theme.colors.text.primary,
            }}
          >
            {t('tripOverview.evolutionTitle')}
          </Text>
          <LineV2
            range="total"
            tripId={selectedTrip}
            selectedCategories={selectedCategories}
            toggleCategory={() => {}} // Géré par le CategorySelector
            setSelectedCategories={setSelectedCategories}
          />
        </View>
      </ScrollView>
    </View>
  );
}
