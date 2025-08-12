import AddTrip from '@/components/Trips/AddTrip';
import TripList from '@/components/Trips/TripList';
import { useAddTrip } from '@/components/TripsScreen/hook';
import { theme } from '@/theme';
import React from 'react';
import { ScrollView } from 'react-native';

export default function TripsScreen() {
  const addTripMutation = useAddTrip();
  return (
    <ScrollView
      contentContainerStyle={{ padding: theme.spacing.lg, paddingBottom: theme.spacing.xl }}
    >
      <TripList />
      <AddTrip onAdd={(values) => addTripMutation.mutate(values)} />
    </ScrollView>
  );
}
