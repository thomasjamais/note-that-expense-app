import Shimmer from '@/components/ui/Skeleton';
import { theme } from '@/theme';
import React from 'react';
import { View } from 'react-native';

export default function TripStatsSkeleton() {
  return (
    <View style={{ paddingTop: theme.spacing.md, width: '100%' }}>
      <Shimmer
        width={260}
        height={24}
        borderRadius={8}
        style={{ alignSelf: 'center', marginBottom: theme.spacing.lg }}
      />

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginBottom: theme.spacing.sm,
        }}
      >
        <Shimmer
          width="100%"
          height={110}
          borderRadius={20}
          style={{ marginBottom: theme.spacing.md, flex: 1 }}
        />
        <Shimmer
          width="100%"
          height={110}
          borderRadius={20}
          style={{ marginBottom: theme.spacing.md, flex: 1 }}
        />
      </View>

      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Shimmer
          width="48%"
          height={110}
          borderRadius={20}
          style={{ marginBottom: theme.spacing.xl, flex: 1 }}
        />
        <Shimmer
          width="48%"
          height={110}
          borderRadius={20}
          style={{ marginBottom: theme.spacing.xl, flex: 1 }}
        />
      </View>

      <Shimmer
        width={300}
        height={22}
        borderRadius={8}
        style={{ alignSelf: 'center', marginBottom: theme.spacing.md }}
      />

      <Shimmer
        width={220}
        height={220}
        borderRadius={110}
        style={{ alignSelf: 'center', marginBottom: theme.spacing.lg }}
      />
    </View>
  );
}
