// import { useDeleteTrip } from '@/hooks/trips/useDeleteTrip';
import { Trip } from '@/components/TripsScreen/hook';
import { useDeleteTrip } from '@/hooks/trips/useDeleteTrip';
import { useUpdateTrip } from '@/hooks/trips/useUpdateTrip';
import { useCurrencies } from '@/hooks/useGetCurrencies';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { useEffect, useState } from 'react';
import { Modal, StyleSheet, Switch, Text, TextInput, View } from 'react-native';
import Button from '../Button';

type HandleTripModalProps = {
  selectedTrip: Trip;
  modalVisible: boolean;
  setModalInvisible: () => void;
};

export default function HandleTripModal({
  selectedTrip,
  modalVisible,
  setModalInvisible,
}: HandleTripModalProps) {
  console.log('selectedTrip', selectedTrip);
  const { mutate: deleteTripForTripMutation } = useDeleteTrip();
  const { mutate: updateTripForTripMutation } = useUpdateTrip();
  const { data: currencies } = useCurrencies();

  const [label, setLabel] = useState(selectedTrip?.label || '');
  const [localCurrencyId, setLocalCurrencyId] = useState<string | undefined>(
    selectedTrip?.localCurrencyId,
  );
  const [homeCurrencyId, setHomeCurrencyId] = useState<string | undefined>(
    selectedTrip?.homeCurrencyId,
  );
  const [startDate, setStartDate] = useState<Date>(new Date(selectedTrip?.startDate));
  const [endDate, setEndDate] = useState<Date | undefined>(
    selectedTrip?.endDate ? new Date(selectedTrip.endDate) : undefined,
  );
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [isActive, setIsActive] = useState(selectedTrip?.isActive || false);

  useEffect(() => {
    if (selectedTrip) {
      setLabel(selectedTrip.label);
      setLocalCurrencyId(selectedTrip.localCurrencyId);
      setHomeCurrencyId(selectedTrip.homeCurrencyId);
      setStartDate(new Date(selectedTrip.startDate));
      setEndDate(selectedTrip.endDate ? new Date(selectedTrip.endDate) : undefined);
      setIsActive(selectedTrip.isActive);
    }
  }, [selectedTrip]);

  const handleSave = () => {
    updateTripForTripMutation({
      tripId: selectedTrip.id,
      label,
      localCurrencyId: localCurrencyId || '',
      homeCurrencyId: homeCurrencyId || '',
      startDate,
      endDate,
      isActive,
    });

    setModalInvisible();
  };

  const handleDelete = () => {
    deleteTripForTripMutation({
      tripId: selectedTrip.id,
    });
    setModalInvisible();
  };

  return (
    <Modal visible={modalVisible} animationType="slide" transparent>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
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
          <Button
            title={new Date(startDate).toDateString()}
            onPress={() => setShowStartPicker(true)}
          />
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
          <Button variant="success" title="Sauvegarder" onPress={handleSave} />
          <Button variant="error" title="Supprimer" onPress={handleDelete} />
          <Button title="Fermer" onPress={() => setModalInvisible()} />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  label: {
    marginTop: 12,
    fontWeight: '600',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 8,
    width: '80%',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 8,
    marginVertical: 8,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 12,
  },
  picker: {
    marginTop: 4,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
  },
});
