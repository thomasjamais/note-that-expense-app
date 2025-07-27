import { useAddExpense } from '@/hooks/expenses/useAddExpense';
import { TripWithCurrencies } from '@/hooks/useGetActiveTrip';
import { Category } from '@/hooks/useGetCategories';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, View } from 'react-native';
import Button from '../Button';

type AddExpenseProps = {
  activeTrip: TripWithCurrencies;
  categories: Category[];
};

export default function AddExpense({ activeTrip, categories }: AddExpenseProps) {
  const { mutate: addExpenseMutation, isPending } = useAddExpense();
  const [label, setLabel] = useState('');
  const [bath, setBath] = useState('');
  const [date, setDate] = useState(new Date());
  const [category, setCategory] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleSubmit = () => {
    if (!label || !bath || !category) {
      Alert.alert('Erreur', 'Tous les champs sont requis. ');
      return;
    }

    addExpenseMutation({
      categoryId: category,
      tripId: activeTrip?.id || '',
      label,
      originalAmount: parseFloat(bath),
      date,
    });

    Alert.alert('Succès', 'Dépense ajoutée !');
  };

  return (
    <View>
      <Text style={styles.title}>Ajouter une dépense</Text>
      <Text style={styles.label}>Pour le trip Actif : {activeTrip?.label || 'Aucun'}</Text>

      <Text style={styles.label}>Nom</Text>
      <TextInput
        style={styles.input}
        placeholder="Nom de la dépense"
        value={label}
        onChangeText={setLabel}
      />

      <Text style={styles.label}>
        Montant en {activeTrip?.localCurrencyName} {activeTrip?.localCurrencySymbol}
      </Text>
      <TextInput
        style={styles.input}
        placeholder="ex: 150"
        keyboardType="numeric"
        value={bath}
        onChangeText={setBath}
      />

      <Text style={styles.label}>Date</Text>
      <Button title={date.toDateString()} onPress={() => setShowDatePicker(true)} />
      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          locale="fr-FR"
          onChange={(event, selectedDate) => {
            setShowDatePicker(false);
            if (selectedDate) setDate(selectedDate);
          }}
        />
      )}

      <Text style={styles.label}>Catégorie</Text>
      <Picker
        selectedValue={category}
        onValueChange={(itemValue: string) => setCategory(itemValue)}
        style={styles.input}
      >
        {categories!.map((cat) => (
          <Picker.Item key={cat.id} label={cat.label} value={cat.id} color={cat.color} />
        ))}
      </Picker>

      <Button title="Ajouter" onPress={handleSubmit} disabled={isPending} />
    </View>
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
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 8,
    marginTop: 4,
    borderRadius: 6,
  },
});
