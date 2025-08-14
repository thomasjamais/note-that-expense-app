import Shimmer from '@/components/ui/Skeleton';
import { theme } from '@/theme';
import React from 'react';
import { View } from 'react-native';

export default function ExpenseListSkeleton({ rows = 6 }: { rows?: number }) {
  return (
    <View>
      <Shimmer
        width={180}
        height={22}
        borderRadius={8}
        style={{ marginBottom: theme.spacing.md }}
      />

      {Array.from({ length: rows }).map((_, i) => (
        <View key={i} style={{ marginBottom: theme.spacing.sm }}>
          <Shimmer width="100%" height={76} borderRadius={theme.radii.lg} style={{}} />
        </View>
      ))}
    </View>
  );
}
