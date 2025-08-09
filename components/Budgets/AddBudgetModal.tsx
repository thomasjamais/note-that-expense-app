import Button from '@/components/Button';
import React, { useState } from 'react';
import { Modal, StyleSheet, Switch, Text, TextInput, View } from 'react-native';

type AddBudgetModalProps = {
  visible: boolean;
  onClose: () => void;
  onAdd: (budgetData: { name: string; amount: number; scope: 'total' | 'monthly' }) => void;
};

export default function AddBudgetModal({ visible, onClose, onAdd }: AddBudgetModalProps) {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [scope, setScope] = useState<'total' | 'monthly'>('total');

  const handleSubmit = () => {
    if (!name || !amount) {
      alert('Merci de remplir tous les champs obligatoires.');
      return;
    }

    const payload = {
      name,
      amount: parseFloat(amount),
      scope,
    };

    onAdd(payload);
    onClose();
    setName('');
    setAmount('');
    setScope('total');
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>Ajouter un budget</Text>

          <Text>Nom</Text>
          <TextInput style={styles.input} value={name} onChangeText={setName} />

          <Text>Montant</Text>
          <TextInput
            style={styles.input}
            value={amount}
            onChangeText={setAmount}
            keyboardType="numeric"
          />

          <View style={styles.switchContainer}>
            <Text>Mensuel ?</Text>
            <Switch
              value={scope === 'monthly'}
              onValueChange={(value) => setScope(value ? 'monthly' : 'total')}
            />
          </View>

          {scope === 'monthly' && (
            <>
              {/* <Text>Choisir un mois</Text>
              <View style={styles.picker}>
                {MONTHS.map((month) => (
                  <Button
                    key={month}
                    title={getMonthName(month)}
                    onPress={() => {
                      const date = new Date(startDate);
                      date.setMonth(month - 1);
                      setStartDate(date);
                    }}
                  />
                ))}
              </View> */}
              {/* <Text>Début</Text>
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
              <Text>Fin</Text>
              <Button title={endDate.toDateString()} onPress={() => setShowEndPicker(true)} />
              {showEndPicker && (
                <DateTimePicker
                  value={endDate}
                  mode="date"
                  display="default"
                  onChange={(_, date) => {
                    setShowEndPicker(false);
                    if (date) setEndDate(date);
                  }}
                />
              )} */}
            </>
          )}

          <Button title="Ajouter" onPress={handleSubmit} />
          <Button title="Annuler" onPress={onClose} variant="error" />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 16,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
  },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 16 },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 8,
    borderRadius: 6,
    marginBottom: 12,
  },
  picker: {
    marginBottom: 12,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 12,
    justifyContent: 'space-between',
  },
});
