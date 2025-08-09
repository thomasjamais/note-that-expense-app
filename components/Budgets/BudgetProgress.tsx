import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { AnimatedCircularProgress } from 'react-native-circular-progress';

type BudgetProgressCircleProps = {
  name: string;
  amount: number;
  spent: number;
  currencySymbol?: string;
};

export default function BudgetProgressCircle({
  name,
  amount,
  spent,
  currencySymbol = '€',
}: BudgetProgressCircleProps) {
  const percent = Math.min((spent / amount) * 100, 999);
  const isOver = percent > 100;

  return (
    <View style={styles.container}>
      <Text style={styles.name}>{name}</Text>

      <AnimatedCircularProgress
        size={120}
        width={12}
        fill={Math.min(percent, 100)}
        tintColor={isOver ? '#ff4d4d' : '#4CAF50'}
        backgroundColor="#e0e0e0"
        rotation={0}
        lineCap="round"
      >
        {() => (
          <View style={styles.innerLabel}>
            <Text style={[styles.percent, isOver && styles.over]}>{Math.round(percent)}%</Text>
            <Text style={styles.amount}>
              {spent.toFixed(0)} / {amount.toFixed(0)} {currencySymbol}
            </Text>
          </View>
        )}
      </AnimatedCircularProgress>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 16,
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    color: '#333',
  },
  innerLabel: {
    alignItems: 'center',
  },
  percent: {
    fontSize: 20,
    fontWeight: '700',
    color: '#4CAF50',
  },
  over: {
    color: '#ff4d4d',
  },
  amount: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
});
