import Button from '@/components/Button';
import { useCurrencies } from '@/hooks/useGetCurrencies';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();
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
      alert(t('trips.fieldsRequired'));
      return;
    }
    onAdd({ label, localCurrencyId, homeCurrencyId, startDate, endDate, isActive });
    setLabel('');
    setLocalCurrencyId(undefined);
    setHomeCurrencyId(undefined);
    setStartDate(new Date());
    setEndDate(undefined);
    setIsActive(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('trips.addTrip')}</Text>

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

      <Button title={t('trips.addButton')} onPress={handleAdd} />
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
