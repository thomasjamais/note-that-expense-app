import FontAwesome from '@expo/vector-icons/FontAwesome';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Tooltip } from 'react-native-paper';

const PASTEL_RED = '#FFCDD2';
const PASTEL_GREEN = '#C8E6C9';

export default function StatCard({
  icon,
  label,
  value,
  arrow,
  tooltipTitle,
}: {
  icon: React.ComponentProps<typeof FontAwesome>['name'];
  label: string;
  value: string;
  arrow?: 'up' | 'down';
  tooltipTitle?: string;
}) {
  const arrowIcon = arrow === 'up' ? 'arrow-up' : arrow === 'down' ? 'arrow-down' : null;
  const arrowColor = arrow === 'up' ? PASTEL_RED : PASTEL_GREEN;
  const rotation = arrow === 'up' ? '225deg' : '-45deg';

  return (
    <View style={styles.card}>
      <FontAwesome name={icon} size={24} color="#555" />

      {arrowIcon && tooltipTitle ? (
        <Tooltip title={tooltipTitle} enterTouchDelay={1}>
          <View style={{ flexDirection: 'row', marginTop: 8 }}>
            <Text style={styles.cardLabel}>{label}</Text>
            <FontAwesome
              name={arrowIcon}
              size={16}
              color={arrowColor}
              style={[styles.arrow, { transform: [{ rotate: rotation }] }]}
            />
          </View>
        </Tooltip>
      ) : (
        <Text style={styles.cardLabel}>{label}</Text>
      )}

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
  arrow: {
    marginTop: 4,
    marginBottom: 4,
  },
  cardValue: {
    fontSize: 16,
    fontWeight: '600',
  },
});
