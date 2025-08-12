import Button from '@/components/ui/Button';
import { Field } from '@/components/ui/Field';
import { Input } from '@/components/ui/Input';
import { useSnackbar } from '@/contexts/SnackbarContext';
import { useAddExpense } from '@/hooks/expenses/useAddExpense';
import { TripWithCurrencies } from '@/hooks/useGetActiveTrip';
import { Category } from '@/hooks/useGetCategories';
import { queueExpense } from '@/lib/offlineQueue';
import { theme } from '@/theme';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { onlineManager } from '@tanstack/react-query';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';

export default function AddExpense({
  activeTrip,
  categories,
}: {
  activeTrip: TripWithCurrencies;
  categories: Category[];
}) {
  const { t } = useTranslation();
  const online = onlineManager.isOnline();
  const { showMessage } = useSnackbar();
  const { mutate: addExpense, isPending } = useAddExpense();

  const [label, setLabel] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date());
  const [categoryId, setCategoryId] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);

  const submit = () => {
    if (!label || !amount || !categoryId) return alert(t('expenses.fieldsRequired'));
    const payload = {
      categoryId,
      tripId: activeTrip?.id || '',
      label,
      originalAmount: parseFloat(amount),
      date,
    };
    if (!online) {
      queueExpense(payload);
      showMessage(t('expenses.savedOffline'), 'success');
    } else {
      addExpense(payload);
    }
    setLabel('');
    setAmount('');
    setDate(new Date());
    setCategoryId('');
  };

  return (
    <View>
      <Text style={{ ...theme.typography.title, marginBottom: theme.spacing.xs }}>
        {t('expenses.addLabel')}
      </Text>
      <Text style={{ color: theme.colors.text.secondary, marginBottom: theme.spacing.sm }}>
        {t('expenses.forTravel')}: {activeTrip?.label || t('expenses.noActiveTrip')}
      </Text>

      <Field label={t('expenses.name')}>
        <Input placeholder={t('expenses.expenseName')!} value={label} onChangeText={setLabel} />
      </Field>

      <Field
        label={`${t('expenses.amountIn')} ${activeTrip?.localCurrencyName} ${activeTrip?.localCurrencySymbol}`}
      >
        <Input
          placeholder="ex: 150"
          keyboardType="numeric"
          value={amount}
          onChangeText={setAmount}
        />
      </Field>

      <Field label={t('expenses.date')}>
        <Button
          label={date.toDateString()}
          variant="soft"
          onPress={() => setShowDatePicker(true)}
        />
        {showDatePicker && (
          <DateTimePicker
            value={date}
            mode="date"
            onChange={(_, d) => {
              setShowDatePicker(false);
              if (d) setDate(d);
            }}
          />
        )}
      </Field>

      <Field label={t('expenses.category')}>
        <View
          style={{
            borderWidth: 1,
            borderColor: theme.colors.neutral[200],
            borderRadius: theme.radii.md,
            overflow: 'hidden',
          }}
        >
          <Picker selectedValue={categoryId} onValueChange={(v) => setCategoryId(v)}>
            {categories.map((c) => (
              <Picker.Item key={c.id} label={c.label} value={c.id} color={c.color} />
            ))}
          </Picker>
        </View>
      </Field>

      <View style={{ marginTop: theme.spacing.md }}>
        <Button label={t('expenses.addButton')} onPress={submit} disabled={isPending} />
      </View>
    </View>
  );
}
