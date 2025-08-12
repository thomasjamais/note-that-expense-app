import { theme } from '@/theme';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const Arrow = ({ direction }: { direction: 'up' | 'down' }) => (
  <View
    style={[
      styles.arrow,
      {
        backgroundColor: direction === 'up' ? theme.colors.danger[100] : theme.colors.success[100],
      },
    ]}
  />
);

export default function StatCard({
  icon,
  label,
  value,
  arrow,
  color = theme.colors.text.secondary,
}: {
  icon: React.ComponentProps<typeof FontAwesome>['name'];
  label: string;
  value: string;
  arrow?: 'up' | 'down';
  color?: string;
}) {
  return (
    <View style={styles.card}>
      <FontAwesome name={icon} size={22} color={color} />
      <Text style={styles.label}>{label}</Text>
      {!!arrow && <Arrow direction={arrow} />}
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radii.lg,
    padding: theme.spacing.md,
    marginHorizontal: theme.spacing.xs,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  label: { marginTop: 6, fontSize: 12, color: theme.colors.text.secondary },
  value: { marginTop: 4, fontSize: 16, fontWeight: '700', color: theme.colors.text.primary },
  arrow: {
    width: 10,
    height: 10,
    borderRadius: 999,
    marginTop: 6,
  },
});
