import { theme } from '@/theme';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { AnimatedCircularProgress } from 'react-native-circular-progress';

export default function BudgetProgressCircle({
  name,
  amount,
  spent,
  currencySymbol = '€',
}: {
  name: string;
  amount: number;
  spent: number;
  currencySymbol?: string;
}) {
  const percent = Math.min((spent / (amount || 1)) * 100, 999);
  const isOver = percent > 100;

  return (
    <View style={styles.container}>
      <Text style={styles.name}>{name}</Text>
      <AnimatedCircularProgress
        size={140}
        width={12}
        fill={Math.min(percent, 100)}
        tintColor={isOver ? theme.colors.danger[600] : theme.colors.success[700]}
        backgroundColor={theme.colors.neutral[200]}
        rotation={0}
        lineCap="round"
      >
        {() => (
          <View style={styles.innerLabel}>
            <Text style={[styles.percent, isOver && { color: theme.colors.danger[600] }]}>
              {Math.round(percent)}%
            </Text>
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
    marginVertical: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.lg,
    borderRadius: theme.radii.xl,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: theme.spacing.sm,
    color: theme.colors.text.primary,
  },
  innerLabel: { alignItems: 'center' },
  percent: { fontSize: 22, fontWeight: '800', color: theme.colors.success[700] },
  amount: { fontSize: 12, color: theme.colors.text.secondary, marginTop: 4 },
});
