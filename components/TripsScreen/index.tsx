import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import AddTrip from '../Trips/AddTrip';
import TripList from '../Trips/TripList';
import { useAddTrip } from './hook';

export default function TripsScreen() {
  const addTripMutation = useAddTrip();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <AddTrip onAdd={(values) => addTripMutation.mutate(values)} />
      <TripList />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
    paddingBottom: 32,
  },
});
