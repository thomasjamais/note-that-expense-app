import FontAwesome from '@expo/vector-icons/FontAwesome';
import { StyleSheet, Text, View } from 'react-native';

export default function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ComponentProps<typeof FontAwesome>['name'];
  label: string;
  value: string;
}) {
  return (
    <View style={styles.card}>
      <FontAwesome name={icon} size={24} color="#555" />
      <Text style={styles.cardLabel}>{label}</Text>
      <Text style={styles.cardValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 12,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  cardLabel: {
    marginTop: 6,
    fontSize: 12,
    color: '#666',
  },
  cardValue: {
    marginTop: 4,
    fontSize: 16,
    fontWeight: '600',
  },
});
