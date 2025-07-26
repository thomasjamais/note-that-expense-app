import Button from '@/components/Button';
import { useCurrencies } from '@/hooks/useGetCurrencies';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import React, { useState } from 'react';
import { StyleSheet, Switch, Text, TextInput, View } from 'react-native';

interface AddTripProps {
  onAdd: (values: {
    label: string;
    localCurrencyId: string;
    homeCurrencyId: string;
    startDate: Date;
    endDate?: Date;
    isActive: boolean;
  }) => void;
}

export default function AddTrip({ onAdd }: AddTripProps) {
  const { data: currencies } = useCurrencies();

  const [label, setLabel] = useState('');
  const [localCurrencyId, setLocalCurrencyId] = useState<string | undefined>();
  const [homeCurrencyId, setHomeCurrencyId] = useState<string | undefined>();
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [isActive, setIsActive] = useState(false);

  const handleAdd = () => {
    if (!label || !localCurrencyId || !homeCurrencyId) {
      alert('Veuillez remplir tous les champs requis.');
      return;
    }
    onAdd({ label, localCurrencyId, homeCurrencyId, startDate, endDate, isActive });
    // reset form
    setLabel('');
    setLocalCurrencyId(undefined);
    setHomeCurrencyId(undefined);
    setStartDate(new Date());
    setEndDate(undefined);
    setIsActive(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ajouter un trip</Text>

      <Text style={styles.label}>Nom du trip</Text>
      <TextInput
        style={styles.input}
        placeholder="Nom du trip"
        value={label}
        onChangeText={setLabel}
      />

      <Text style={styles.label}>Monnaie locale</Text>
      {currencies?.length ? (
        <Picker
          selectedValue={localCurrencyId}
          onValueChange={(value) => setLocalCurrencyId(value)}
          style={styles.picker}
        >
          <Picker.Item label="Veuillez séléctionner" value={undefined} />
          {currencies.map((c) => (
            <Picker.Item key={c.id} label={`${c.name} (${c.symbol})`} value={c.id} />
          ))}
        </Picker>
      ) : (
        <Text>Chargement des devises...</Text>
      )}

      <Text style={styles.label}>Monnaie chez vous</Text>
      {currencies?.length ? (
        <Picker
          selectedValue={homeCurrencyId}
          onValueChange={(value) => setHomeCurrencyId(value)}
          style={styles.picker}
        >
          <Picker.Item label="Veuillez séléctionner" value={undefined} />
          {currencies.map((c) => (
            <Picker.Item key={c.id} label={`${c.name} (${c.symbol})`} value={c.id} />
          ))}
        </Picker>
      ) : (
        <Text>Chargement des devises...</Text>
      )}

      <Text style={styles.label}>Date de début</Text>
      <Button title={startDate.toDateString()} onPress={() => setShowStartPicker(true)} />
      {showStartPicker && (
        <DateTimePicker
          value={startDate}
          mode="date"
          display="default"
          onChange={(_, date) => {
            setShowStartPicker(false);
            if (date) setStartDate(date);
          }}
        />
      )}

      <Text style={styles.label}>Date de fin (optionnelle)</Text>
      <Button
        title={endDate ? endDate.toDateString() : 'Sélectionner une date'}
        onPress={() => setShowEndPicker(true)}
      />
      {showEndPicker && (
        <DateTimePicker
          value={endDate || new Date()}
          mode="date"
          display="default"
          onChange={(_, date) => {
            setShowEndPicker(false);
            if (date) setEndDate(date);
          }}
        />
      )}

      <View style={styles.switchContainer}>
        <Text style={styles.label}>Trip actif</Text>
        <Switch value={isActive} onValueChange={setIsActive} />
      </View>

      <Button title="Ajouter" onPress={handleAdd} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  label: {
    marginTop: 12,
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 8,
    borderRadius: 6,
    marginTop: 4,
  },
  picker: {
    marginTop: 4,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 12,
  },
});
