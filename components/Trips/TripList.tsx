import Colors from '@/constants/Colors';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Trip, useListTrips } from '../TripsScreen/hook';
import HandleTripModal from './HandleTripModal';

export default function TripList() {
  const { data: trips, isLoading, isError } = useListTrips();
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const handleTripPress = (trip: Trip) => {
    setSelectedTrip(trip);
    setModalVisible(true);
  };

  if (isLoading) {
    return <Text>Chargement des trips...</Text>;
  }

  if (isError) {
    return <Text>Erreur lors du chargement des trips.</Text>;
  }

  if (trips?.length === 0) {
    return <Text>Aucun trip pour l’instant.</Text>;
  }

  return (
    <View>
      <Text style={styles.title}>Liste des trips</Text>
      {trips?.map((item) => (
        <TouchableOpacity
          key={item.id}
          style={{
            padding: 12,
            marginVertical: 6,
            borderRadius: 6,
          }}
          onPress={() => handleTripPress(item)}
        >
          <Text style={styles.label}>
            {item.label} {item.isActive ? '(Actif)' : ''}
          </Text>
          <Text>{new Date(item.startDate).toLocaleDateString()}</Text>
        </TouchableOpacity>
      ))}
      {selectedTrip && selectedTrip.id && (
        <HandleTripModal
          selectedTrip={selectedTrip}
          modalVisible={modalVisible}
          setModalInvisible={() => setModalVisible(false)}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 12 },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 8,
    marginBottom: 12,
    borderRadius: 6,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 12,
  },
  item: {
    borderWidth: 1,
    borderColor: Colors.light.border,
    padding: 12,
    marginVertical: 6,
    borderRadius: 6,
    backgroundColor: Colors.light.card,
  },
  label: { fontWeight: 'bold', fontSize: 16, color: Colors.light.text },
  picker: { marginBottom: 12 },
});
