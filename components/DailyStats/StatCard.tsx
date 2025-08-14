import FancyCard from '@/components/ui/FancyCard';
import { theme } from '@/theme';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import React from 'react';
import { Text, View } from 'react-native';

export default function StatCard({
  icon,
  label,
  value,
  arrow,
  color = theme.colors.primary[700],
  variant = 'elevated',
}: {
  icon: React.ComponentProps<typeof FontAwesome>['name'];
  label: string;
  value: string;
  arrow?: 'up' | 'down';
  color?: string;
  variant?: 'elevated' | 'gradient' | 'glass' | 'outline';
}) {
  const Arrow = arrow ? (
    <FontAwesome
      name={arrow === 'down' ? 'long-arrow-up' : 'long-arrow-down'}
      size={12}
      color={arrow === 'down' ? theme.colors.danger[500] : theme.colors.success[600]}
      style={{ marginLeft: 6 }}
    />
  ) : null;

  return (
    <FancyCard compact variant={variant} style={{ flex: 1, marginHorizontal: 4 }} minHeight={96}>
      <View style={{ alignItems: 'center' }}>
        <FontAwesome name={icon} size={22} color={color} />
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 6 }}>
          <Text
            style={{
              fontFamily: theme.typography.family.medium,
              fontSize: 12,
              color: theme.colors.text.secondary,
            }}
            numberOfLines={1}
          >
            {label}
          </Text>
          {Arrow}
        </View>
        <Text
          style={{
            marginTop: 4,
            fontFamily: theme.typography.family.bold,
            fontSize: 16,
            color: theme.colors.text.primary,
          }}
        >
          {value}
        </Text>
      </View>
    </FancyCard>
  );
}
