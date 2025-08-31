import BudgetList from '@/components/Budgets/BudgetList';
import { Trip } from '@/components/TripsScreen/hook';
import Button from '@/components/ui/Button';
import { Field } from '@/components/ui/Field';
import { Input } from '@/components/ui/Input';
import { ModalSheet } from '@/components/ui/ModalSheet';
import { useAddBudget } from '@/hooks/budgets/useAddBudget';
import { useGetBudgets } from '@/hooks/budgets/useGetBudgetsByTripId';
import { useDeleteTrip } from '@/hooks/trips/useDeleteTrip';
import { useUpdateTrip } from '@/hooks/trips/useUpdateTrip';
import { useCurrencies } from '@/hooks/useGetCurrencies';
import { theme } from '@/theme';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Text, View, Switch } from 'react-native';
import AddBudgetModal from '../Budgets/AddBudgetModal';

export default function HandleTripModal({
  selectedTrip,
  modalVisible,
  setModalInvisible,
}: {
  selectedTrip: Trip;
  modalVisible: boolean;
  setModalInvisible: () => void;
}) {
  const { t } = useTranslation();
  const { data: currencies } = useCurrencies();
  const { mutate: updateTrip } = useUpdateTrip();
  const { mutate: deleteTrip } = useDeleteTrip();
  const { mutate: addBudget } = useAddBudget();
  const { data: budgets = [] } = useGetBudgets(selectedTrip.id);

  const [label, setLabel] = useState(selectedTrip.label);
  const [showAddBudgetModal, setShowAddBudgetModal] = useState(false);
  const [localCurrencyId, setLocalCurrencyId] = useState<string | undefined>(
    selectedTrip.localCurrencyId,
  );
  const [homeCurrencyId, setHomeCurrencyId] = useState<string | undefined>(
    selectedTrip.homeCurrencyId,
  );
  const [startDate, setStartDate] = useState<Date>(new Date(selectedTrip.startDate));
  const [endDate, setEndDate] = useState<Date | undefined>(
    selectedTrip.endDate ? new Date(selectedTrip.endDate) : undefined,
  );
  const [isActive, setIsActive] = useState(selectedTrip.isActive);
  const [showStart, setShowStart] = useState(false);
  const [showEnd, setShowEnd] = useState(false);

  useEffect(() => {
    if (!selectedTrip) return;
    setLabel(selectedTrip.label);
    setLocalCurrencyId(selectedTrip.localCurrencyId);
    setHomeCurrencyId(selectedTrip.homeCurrencyId);
    setStartDate(new Date(selectedTrip.startDate));
    setEndDate(selectedTrip.endDate ? new Date(selectedTrip.endDate) : undefined);
    setIsActive(selectedTrip.isActive);
  }, [selectedTrip]);

  const handleSave = () => {
    updateTrip({
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
    deleteTrip({ tripId: selectedTrip.id });
    setModalInvisible();
  };

  return (
    <ModalSheet visible={modalVisible} onClose={setModalInvisible}>
      <Text style={{ ...theme.typography.title, marginBottom: theme.spacing.sm }}>
        {t('trips.editTrip')}
      </Text>

      <Field label={t('trips.tripName')}>
        <Input value={label} onChangeText={setLabel} />
      </Field>

      <Field label={t('trips.localCurrency')}>
        <View
          style={{
            borderWidth: 1,
            borderColor: theme.colors.neutral[200],
            borderRadius: theme.radii.md,
            overflow: 'hidden',
          }}
        >
          <Picker selectedValue={localCurrencyId} onValueChange={(v) => setLocalCurrencyId(v)}>
            <Picker.Item label={t('trips.localCurrencyPlaceholder')!} value={undefined} />
            {currencies?.map((c) => (
              <Picker.Item key={c.id} label={`${c.name} (${c.symbol})`} value={c.id} />
            ))}
          </Picker>
        </View>
      </Field>

      <Field label={t('trips.homeCurrency')}>
        <View
          style={{
            borderWidth: 1,
            borderColor: theme.colors.neutral[200],
            borderRadius: theme.radii.md,
            overflow: 'hidden',
          }}
        >
          <Picker selectedValue={homeCurrencyId} onValueChange={(v) => setHomeCurrencyId(v)}>
            <Picker.Item label={t('trips.homeCurrencyPlaceholder')!} value={undefined} />
            {currencies?.map((c) => (
              <Picker.Item key={c.id} label={`${c.name} (${c.symbol})`} value={c.id} />
            ))}
          </Picker>
        </View>
      </Field>

      <Field label={t('trips.startDate')}>
        <Button
          variant="soft"
          label={startDate.toDateString()}
          onPress={() => setShowStart(true)}
        />
        {showStart && (
          <DateTimePicker
            value={startDate}
            mode="date"
            onChange={(_, d) => {
              setShowStart(false);
              if (d) setStartDate(d);
            }}
          />
        )}
      </Field>

      <Field label={t('trips.endDate')}>
        <Button
          variant="soft"
          label={endDate ? endDate.toDateString() : t('trips.endDatePlaceholder')!}
          onPress={() => setShowEnd(true)}
        />
        {showEnd && (
          <DateTimePicker
            value={endDate || new Date()}
            mode="date"
            onChange={(_, d) => {
              setShowEnd(false);
              setEndDate(d || undefined);
            }}
          />
        )}
      </Field>

      <Field label={t('trips.actif')}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingVertical: theme.spacing.sm,
          }}
        >
          <Text style={{ color: theme.colors.text.secondary }}>
            {isActive ? t('trips.actif') : t('trips.inactif')}
          </Text>
          <Switch value={isActive} onValueChange={setIsActive} />
        </View>
      </Field>

      <View style={{ marginTop: theme.spacing.xl }}>
        <BudgetList budgets={budgets} />
        <View style={{ marginTop: theme.spacing.sm }}>
          <Button
            label={t('budgets.addBudget')}
            onPress={() => {
              setShowAddBudgetModal(true);
            }}
            leftIcon={<FontAwesome name="plus" size={16} color={theme.colors.text.inverted} />}
          />
        </View>
      </View>

      <AddBudgetModal
        visible={showAddBudgetModal}
        onClose={() => setShowAddBudgetModal(false)}
        onAdd={(data) => addBudget({ ...data, tripId: selectedTrip.id })}
      />

      <View style={{ marginTop: theme.spacing.xl }}>
        <Button
          label={t('trips.save')}
          onPress={handleSave}
          style={{ marginBottom: theme.spacing.sm }}
        />
        <Button
          variant="destructive"
          label={t('trips.delete')}
          onPress={handleDelete}
          style={{ marginBottom: theme.spacing.sm }}
        />
        <Button variant="link" label={t('trips.close')} onPress={setModalInvisible} />
      </View>
    </ModalSheet>
  );
}
