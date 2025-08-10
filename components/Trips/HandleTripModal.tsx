import { Trip } from '@/components/TripsScreen/hook';
import { useAddBudget } from '@/hooks/budgets/useAddBudget';
import { useGetBudgets } from '@/hooks/budgets/useGetBudgetsByTripId';
import { useDeleteTrip } from '@/hooks/trips/useDeleteTrip';
import { useUpdateTrip } from '@/hooks/trips/useUpdateTrip';
import { useCurrencies } from '@/hooks/useGetCurrencies';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Modal, ScrollView, StyleSheet, Switch, Text, TextInput, View } from 'react-native';
import AddBudgetModal from '../Budgets/AddBudgetModal';
import BudgetList from '../Budgets/BudgetList';
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
  const { t } = useTranslation();
  const { mutate: deleteTripForTripMutation } = useDeleteTrip();
  const { mutate: updateTripForTripMutation } = useUpdateTrip();
  const { data: budgets = [] } = useGetBudgets(selectedTrip.id);
  const { mutate: addBudget } = useAddBudget();
  const [showAddBudgetModal, setShowAddBudgetModal] = useState(false);
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
        <ScrollView contentContainerStyle={styles.scrollContent} style={styles.modalContent}>
          <Text style={styles.label}>{t('trips.tripName')}</Text>
          <TextInput
            style={styles.input}
            placeholder={t('trips.tripName')}
            value={label}
            onChangeText={setLabel}
          />

          <Text style={styles.label}>{t('trips.localCurrency')}</Text>
          {currencies?.length ? (
            <Picker
              selectedValue={localCurrencyId}
              onValueChange={(value) => setLocalCurrencyId(value)}
              style={styles.picker}
            >
              <Picker.Item label={t('trips.localCurrencyPlaceholder')} value={undefined} />
              {currencies.map((c) => (
                <Picker.Item key={c.id} label={`${c.name} (${c.symbol})`} value={c.id} />
              ))}
            </Picker>
          ) : (
            <Text>{t('trips.currencies.loading')}</Text>
          )}

          <Text style={styles.label}>{t('trips.homeCurrency')}</Text>
          {currencies?.length ? (
            <Picker
              selectedValue={homeCurrencyId}
              onValueChange={(value) => setHomeCurrencyId(value)}
              style={styles.picker}
            >
              <Picker.Item label={t('trips.homeCurrencyPlaceholder')} value={undefined} />
              {currencies.map((c) => (
                <Picker.Item key={c.id} label={`${c.name} (${c.symbol})`} value={c.id} />
              ))}
            </Picker>
          ) : (
            <Text>{t('trips.currencies.loading')}</Text>
          )}

          <Text style={styles.label}>{t('trips.startDate')}</Text>
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

          <Text style={styles.label}>{t('trips.endDate')}</Text>
          <Button
            title={endDate ? endDate.toDateString() : t('trips.endDatePlaceholder')}
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
            <Text style={styles.label}>{t('trips.actif')}</Text>
            <Switch value={isActive} onValueChange={setIsActive} />
          </View>
          <View style={{ marginTop: 24 }}>
            <BudgetList budgets={budgets} />
            <Button title={t('budgets.addBudget')} onPress={() => setShowAddBudgetModal(true)} />
          </View>

          <AddBudgetModal
            visible={showAddBudgetModal}
            onClose={() => setShowAddBudgetModal(false)}
            onAdd={(data) => addBudget({ ...data, tripId: selectedTrip.id })}
          />
          <Button variant="success" title={t('trips.save')} onPress={handleSave} />
          <Button variant="error" title={t('trips.delete')} onPress={handleDelete} />
          <Button title={t('trips.close')} onPress={() => setModalInvisible()} />
        </ScrollView>
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
    borderRadius: 8,
    width: '90%',
    margin: 'auto',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
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
