import { useDeleteExpense } from '@/hooks/expenses/useDeleteExpense';
import { useUpdateExpense } from '@/hooks/expenses/useUpdateExpense';
import { TripWithCurrencies } from '@/hooks/useGetActiveTrip';
import { Category } from '@/hooks/useGetCategories';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { useEffect, useState } from 'react';
import { Modal, StyleSheet, Text, TextInput, View } from 'react-native';
import Button from '../Button';

type ExpenseListProps = {
  activeTrip: TripWithCurrencies;
  categories: Category[];
  selectedExpense: any;
  modalVisible: boolean;
  setModalInvisible: () => void;
};

export default function HandleExpenseModal({
  activeTrip,
  categories,
  selectedExpense,
  modalVisible,
  setModalInvisible,
}: ExpenseListProps) {
  const { mutate: deleteExpenseForTripMutation } = useDeleteExpense();
  const { mutate: updateExpenseForTripMutation } = useUpdateExpense();

  const [label, setLabel] = useState(selectedExpense?.label || '');
  const [date, setDate] = useState(new Date());
  const [amount, setAmount] = useState(selectedExpense?.originalAmount.toString() || '');
  const [category, setCategory] = useState(selectedExpense?.categoryId || '');

  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    if (selectedExpense) {
      setLabel(selectedExpense.label);
      setDate(new Date(selectedExpense.date));
      setAmount(selectedExpense.originalAmount.toString());
      setCategory(selectedExpense.categoryId);
    }
  }, [selectedExpense]);

  const handleSave = () => {
    updateExpenseForTripMutation({
      tripId: activeTrip.id,
      expenseId: selectedExpense.id,
      label,
      originalAmount: Number(amount),
      date,
      categoryId: category,
    });
    setModalInvisible();
  };

  const handleDelete = () => {
    deleteExpenseForTripMutation({
      tripId: activeTrip.id,
      expenseId: selectedExpense.id,
    });
    setModalInvisible();
  };
  return (
    <Modal visible={modalVisible} animationType="slide" transparent>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text>Modifier la dépense</Text>
          <TextInput
            value={label}
            onChangeText={setLabel}
            placeholder="Label"
            style={styles.input}
          />
          <TextInput
            value={amount}
            onChangeText={setAmount}
            placeholder="Montant"
            keyboardType="numeric"
            style={styles.input}
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
});
