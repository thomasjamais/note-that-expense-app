import Button from '@/components/ui/Button';
import { Field } from '@/components/ui/Field';
import { Input } from '@/components/ui/Input';
import { useCurrencies } from '@/hooks/useGetCurrencies';
import { theme } from '@/theme';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Switch, Text, View } from 'react-native';

export default function AddTrip({
  onAdd,
}: {
  onAdd: (v: {
    label: string;
    localCurrencyId: string;
    homeCurrencyId: string;
    startDate: Date;
    endDate?: Date;
    isActive: boolean;
  }) => void;
}) {
  const { t } = useTranslation();
  const { data: currencies } = useCurrencies();
  const [label, setLabel] = useState('');
  const [localCurrencyId, setLocalCurrencyId] = useState<string | undefined>();
  const [homeCurrencyId, setHomeCurrencyId] = useState<string | undefined>();
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [showStart, setShowStart] = useState(false);
  const [showEnd, setShowEnd] = useState(false);
  const [isActive, setIsActive] = useState(false);

  const submit = () => {
    if (!label || !localCurrencyId || !homeCurrencyId) return alert(t('trips.fieldsRequired'));
    onAdd({ label, localCurrencyId, homeCurrencyId, startDate, endDate, isActive });
    setLabel('');
    setLocalCurrencyId(undefined);
    setHomeCurrencyId(undefined);
    setStartDate(new Date());
    setEndDate(undefined);
    setIsActive(false);
  };

  return (
    <View style={{ marginBottom: theme.spacing.xl }}>
      <Text style={{ ...theme.typography.subtitle, marginBottom: theme.spacing.sm }}>
        {t('trips.addTrip')}
      </Text>

      <Field label={t('trips.tripName')}>
        <Input value={label} onChangeText={setLabel} placeholder={t('trips.tripName')!} />
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

      <View style={{ marginTop: theme.spacing.lg }}>
        <Button label={t('trips.addButton')} onPress={submit} />
      </View>
    </View>
  );
}
