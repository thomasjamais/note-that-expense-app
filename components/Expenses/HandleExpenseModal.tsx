import Button from '@/components/ui/Button';
import { Field } from '@/components/ui/Field';
import { Input } from '@/components/ui/Input';
import { ModalSheet } from '@/components/ui/ModalSheet';
import { useDeleteExpense } from '@/hooks/expenses/useDeleteExpense';
import { useUpdateExpense } from '@/hooks/expenses/useUpdateExpense';
import { TripWithCurrencies } from '@/hooks/useGetActiveTrip';
import { Category } from '@/hooks/useGetCategories';
import { theme } from '@/theme';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';

export default function HandleExpenseModal({
  activeTrip,
  categories,
  selectedExpense,
  modalVisible,
  setModalInvisible,
}: {
  activeTrip: TripWithCurrencies;
  categories: Category[];
  selectedExpense: any;
  modalVisible: boolean;
  setModalInvisible: () => void;
}) {
  const { t } = useTranslation();
  const { mutate: deleteExpense } = useDeleteExpense();
  const { mutate: updateExpense } = useUpdateExpense();

  const [label, setLabel] = useState(selectedExpense?.label || '');
  const [date, setDate] = useState<Date>(new Date());
  const [amount, setAmount] = useState<string>(selectedExpense?.originalAmount?.toString() || '');
  const [categoryId, setCategoryId] = useState<string>(selectedExpense?.categoryId || '');
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    if (!selectedExpense) return;
    setLabel(selectedExpense.label);
    setDate(new Date(selectedExpense.date));
    setAmount(String(selectedExpense.originalAmount));
    setCategoryId(selectedExpense.categoryId);
  }, [selectedExpense]);

  const save = () => {
    updateExpense({
      tripId: activeTrip.id,
      expenseId: selectedExpense.id,
      label,
      originalAmount: Number(amount),
      date,
      categoryId,
    });
    setModalInvisible();
  };
  const remove = () => {
    deleteExpense({ tripId: activeTrip.id, expenseId: selectedExpense.id });
    setModalInvisible();
  };

  return (
    <ModalSheet visible={modalVisible} onClose={setModalInvisible}>
      <Text style={{ ...theme.typography.title, marginBottom: theme.spacing.sm }}>
        {t('expenses.editExpense')}
      </Text>

      <Field label={t('expenses.name')}>
        <Input value={label} onChangeText={setLabel} placeholder={t('expenses.expenseName')!} />
      </Field>

      <Field
        label={`${t('expenses.amountIn')} ${activeTrip?.localCurrencyName} ${activeTrip?.localCurrencySymbol}`}
      >
        <Input value={amount} onChangeText={setAmount} keyboardType="numeric" />
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

      <View style={{ marginTop: theme.spacing.xl }}>
        <Button
          label={t('expenses.editButton')}
          onPress={save}
          style={{ marginBottom: theme.spacing.sm }}
        />
        <Button
          variant="destructive"
          label={t('expenses.deleteButton')}
          onPress={remove}
          style={{ marginBottom: theme.spacing.sm }}
        />
        <Button variant="link" label={t('expenses.close')} onPress={setModalInvisible} />
      </View>
    </ModalSheet>
  );
}
