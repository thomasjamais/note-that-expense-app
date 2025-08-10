import Button from '@/components/Button';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Modal, StyleSheet, Switch, Text, TextInput, View } from 'react-native';

type AddBudgetModalProps = {
  visible: boolean;
  onClose: () => void;
  onAdd: (budgetData: { name: string; amount: number; scope: 'total' | 'monthly' }) => void;
};

export default function AddBudgetModal({ visible, onClose, onAdd }: AddBudgetModalProps) {
  const { t } = useTranslation();
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [scope, setScope] = useState<'total' | 'monthly'>('total');

  const handleSubmit = () => {
    if (!name || !amount) {
      alert(t('budgets.addOrEdit.fieldsRequired'));
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
          <Text style={styles.title}>{t('budgets.addOrEdit.title')}</Text>

          <Text>{t('budgets.addOrEdit.name')}</Text>
          <TextInput style={styles.input} value={name} onChangeText={setName} />

          <Text>{t('budgets.addOrEdit.amount')}</Text>
          <TextInput
            style={styles.input}
            value={amount}
            onChangeText={setAmount}
            keyboardType="numeric"
          />

          <View style={styles.switchContainer}>
            <Text>{t('budgets.addOrEdit.monthly')} ?</Text>
            <Switch
              value={scope === 'monthly'}
              onValueChange={(value) => setScope(value ? 'monthly' : 'total')}
            />
          </View>

          <Button title={t('budgets.addOrEdit.add')} onPress={handleSubmit} />
          <Button title={t('budgets.addOrEdit.cancel')} onPress={onClose} variant="error" />
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
