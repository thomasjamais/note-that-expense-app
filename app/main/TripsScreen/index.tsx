import Button from '@/components/Button';
import Colors from '@/constants/Colors';
import { useCurrencies } from '@/hooks/useGetCurrencies';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import React, { useState } from 'react';
import { FlatList, StyleSheet, Switch, Text, TextInput, View } from 'react-native';
import { useAddTrip, useListTrips } from './hook';

export default function TripsScreen() {
  const { data: currencies } = useCurrencies();
  const { mutate: addTripMutation } = useAddTrip();
  const { data: trips } = useListTrips();

  const [label, setLabel] = useState('');
  const [localCurrencyId, setLocalCurrencyId] = useState<string | undefined>();
  const [homeCurrencyId, setHomeCurrencyId] = useState<string | undefined>();
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [isActive, setIsActive] = useState(false);

  const addTrip = () => {
    if (!label || !localCurrencyId || !homeCurrencyId) {
      alert('Veuillez remplir tous les champs requis.');
      return;
    }
    addTripMutation({ label, localCurrencyId, homeCurrencyId, startDate, endDate, isActive });
    // reset
    setLabel('');
    setLocalCurrencyId(undefined);
    setHomeCurrencyId(undefined);
    setStartDate(new Date());
    setEndDate(undefined);
    setIsActive(false);
  };

  return (
    <FlatList
      data={trips || []}
      keyExtractor={(item) => item.id}
      ListHeaderComponent={
        <View>
          <Text style={styles.title}>Ajouter un trip</Text>

          <Text>Nom</Text>
          <TextInput
            style={styles.input}
            placeholder="Nom du trip"
            value={label}
            onChangeText={setLabel}
          />

          <Text>Monnaie locale</Text>
          {currencies?.length ? (
            <Picker
              selectedValue={localCurrencyId}
              onValueChange={setLocalCurrencyId}
              style={styles.picker}
            >
              {currencies.map((currency) => (
                <Picker.Item
                  key={currency.id}
                  label={`${currency.name} (${currency.symbol})`}
                  value={currency.id}
                />
              ))}
            </Picker>
          ) : (
            <Text>Chargement...</Text>
          )}

          <Text>Monnaie home</Text>
          {currencies?.length ? (
            <Picker
              selectedValue={homeCurrencyId}
              onValueChange={setHomeCurrencyId}
              style={styles.picker}
            >
              {currencies.map((currency) => (
                <Picker.Item
                  key={currency.id}
                  label={`${currency.name} (${currency.symbol})`}
                  value={currency.id}
                />
              ))}
            </Picker>
          ) : (
            <Text>Chargement...</Text>
          )}

          <Text>Date de début</Text>
          <Button title={startDate.toDateString()} onPress={() => setShowStartDatePicker(true)} />
          {showStartDatePicker && (
            <DateTimePicker
              value={startDate}
              mode="date"
              display="default"
              onChange={(_, selectedDate) => {
                setShowStartDatePicker(false);
                if (selectedDate) setStartDate(selectedDate);
              }}
            />
          )}

          <Text>Date de fin (optionnelle)</Text>
          <Button
            title={endDate ? endDate.toDateString() : 'Sélectionner une date'}
            onPress={() => setShowEndDatePicker(true)}
          />
          {showEndDatePicker && (
            <DateTimePicker
              value={endDate || new Date()}
              mode="date"
              display="default"
              onChange={(_, selectedDate) => {
                setShowEndDatePicker(false);
                if (selectedDate) setEndDate(selectedDate);
              }}
            />
          )}

          <View style={styles.switchContainer}>
            <Text>Trip actif</Text>
            <Switch value={isActive} onValueChange={setIsActive} />
          </View>

          <Button title="Ajouter" onPress={addTrip} />

          <Text style={[styles.title, { marginTop: 24 }]}>Liste des trips</Text>
        </View>
      }
      renderItem={({ item }) => (
        <View style={styles.tripItem}>
          <Text style={styles.tripLabel}>
            {item.label} {item.isActive ? '(Actif)' : ''}
          </Text>
          <Text>
            {item.localCurrencyId} ↔ {item.homeCurrencyId}
          </Text>
          <Text>Début: {new Date(item.startDate).toDateString()}</Text>
          {item.endDate && <Text>Fin: {new Date(item.endDate).toDateString()}</Text>}
        </View>
      )}
      ListEmptyComponent={<Text style={{ padding: 16 }}>Aucun trip pour l’instant.</Text>}
      contentContainerStyle={{ padding: 16, paddingBottom: 64 }}
    />
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
  tripItem: {
    borderWidth: 1,
    borderColor: Colors.light.border,
    padding: 12,
    marginVertical: 6,
    borderRadius: 6,
    backgroundColor: Colors.light.card,
  },
  tripLabel: { fontWeight: 'bold', fontSize: 16, color: Colors.light.text },
  picker: { marginBottom: 12 },
});
