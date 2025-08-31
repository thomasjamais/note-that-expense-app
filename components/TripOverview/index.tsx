import { useGetCategoriesForSelector } from '@/hooks/useGetCategoriesForSelector';
import { useGetActiveTrip } from '@/hooks/useGetActiveTrip';
import { useGetUserTrips, Trip } from '@/hooks/useGetUserTrips';
import { useGetTripById } from '@/hooks/trips/useGetTripById';
import { theme } from '@/theme';
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import TripStats from '../TripStats';
import Pie from '../Pie';
import LineV2 from '../LineV2';
import CategorySelector from '../ui/CategorySelector';

export default function TripOverview() {
  const { t } = useTranslation();
  const { data: activeTrip } = useGetActiveTrip();
  const { data: allTrips = [] } = useGetUserTrips();
  const { data: categories = [] } = useGetCategoriesForSelector();
  const [selectedTrip, setSelectedTrip] = useState<string | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  useEffect(() => {
    if (activeTrip && !selectedTrip) {
      setSelectedTrip(activeTrip.id);
    }
  }, [activeTrip, selectedTrip]);

  const { data: selectedTripData } = useGetTripById(selectedTrip ?? undefined);

  const goToPreviousTrip = () => {
    const currentIndex = allTrips.findIndex((trip: Trip) => trip.id === selectedTrip);
    if (currentIndex < allTrips.length - 1) {
      setSelectedTrip(allTrips[currentIndex + 1].id);
    }
  };

  const goToNextTrip = () => {
    const currentIndex = allTrips.findIndex((trip: Trip) => trip.id === selectedTrip);
    if (currentIndex > 0) {
      setSelectedTrip(allTrips[currentIndex - 1].id);
    }
  };

  const canGoToPreviousTrip = () => {
    const currentIndex = allTrips.findIndex((trip: Trip) => trip.id === selectedTrip);
    return currentIndex < allTrips.length - 1;
  };

  const canGoToNextTrip = () => {
    const currentIndex = allTrips.findIndex((trip: Trip) => trip.id === selectedTrip);
    return currentIndex > 0;
  };

  const getCurrentTrip = () => {
    return allTrips.find((trip: Trip) => trip.id === selectedTrip);
  };

  const getTripName = (trip: Trip) => {
    return trip.name;
  };

  const getTripIsActive = (trip: Trip) => {
    return trip.isActive;
  };

  const currentTrip = getCurrentTrip();

  if (!currentTrip || !selectedTripData) {
    return null;
  }

  return (
    <View style={{ flex: 1, position: 'relative' }}>
      <CategorySelector
        categories={categories}
        selectedCategories={selectedCategories}
        onSelectionChange={setSelectedCategories}
        position="top-right"
      />

      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        {allTrips.length > 1 && (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingHorizontal: theme.spacing.lg,
              paddingVertical: theme.spacing.md,
              marginHorizontal: theme.spacing.lg,
              marginTop: theme.spacing.lg,
              borderRadius: theme.radii.lg,
            }}
          >
            <TouchableOpacity onPress={goToPreviousTrip} disabled={!canGoToPreviousTrip()}>
              <FontAwesome
                name="chevron-left"
                size={20}
                color={
                  canGoToPreviousTrip() ? theme.colors.text.primary : theme.colors.text.secondary
                }
              />
            </TouchableOpacity>

            <View style={{ alignItems: 'center', flex: 1 }}>
              <Text style={[theme.typography.title, { color: theme.colors.text.primary }]}>
                {getTripName(currentTrip)}
              </Text>
              {getTripIsActive(currentTrip) && (
                <Text style={[theme.typography.small, { color: theme.colors.primary[500] }]}>
                  {t('tripOverview.active')}
                </Text>
              )}
            </View>

            <TouchableOpacity onPress={goToNextTrip} disabled={!canGoToNextTrip()}>
              <FontAwesome
                name="chevron-right"
                size={20}
                color={canGoToNextTrip() ? theme.colors.text.primary : theme.colors.text.secondary}
              />
            </TouchableOpacity>
          </View>
        )}

        <View style={{ padding: theme.spacing.lg }}>
          <Text
            style={[
              theme.typography.title,
              { color: theme.colors.text.primary, marginBottom: theme.spacing.md },
            ]}
          >
            {t('tripOverview.statsTitle')}
          </Text>
          {selectedTrip && <TripStats tripId={selectedTrip} />}
        </View>

        <View style={{ padding: theme.spacing.lg }}>
          <Text
            style={[
              theme.typography.title,
              { color: theme.colors.text.primary, marginBottom: theme.spacing.md },
            ]}
          >
            {t('tripOverview.categoriesTitle')}
          </Text>
          <Pie
            range="total"
            tripId={selectedTrip}
            selectedCategories={selectedCategories}
            toggleCategory={() => {}}
            setSelectedCategories={setSelectedCategories}
          />
        </View>

        <View style={{ padding: theme.spacing.lg }}>
          <Text
            style={[
              theme.typography.title,
              { color: theme.colors.text.primary, marginBottom: theme.spacing.md },
            ]}
          >
            {t('tripOverview.evolutionTitle')}
          </Text>
          <LineV2
            range="total"
            tripId={selectedTrip}
            selectedCategories={selectedCategories}
            toggleCategory={() => {}}
            setSelectedCategories={setSelectedCategories}
          />
        </View>
      </ScrollView>
    </View>
  );
}
