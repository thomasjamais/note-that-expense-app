import Shimmer from '@/components/ui/Skeleton';
import { theme } from '@/theme';
import React from 'react';
import { View } from 'react-native';

export default function DailyStatsSkeleton() {
  return (
    <View style={{ marginTop: theme.spacing.md, width: '100%' }}>
      <Shimmer
        width={280}
        height={24}
        borderRadius={8}
        style={{ alignSelf: 'center', marginBottom: theme.spacing.lg }}
      />

      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Shimmer
          width="48%"
          height={100}
          borderRadius={20}
          style={{ marginBottom: theme.spacing.md, flex: 1 }}
        />
        <Shimmer
          width="48%"
          height={100}
          borderRadius={20}
          style={{ marginBottom: theme.spacing.md, flex: 1 }}
        />
      </View>

      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Shimmer
          width="48%"
          height={100}
          borderRadius={20}
          style={{ marginBottom: theme.spacing.md, flex: 1 }}
        />
        <Shimmer
          width="48%"
          height={100}
          borderRadius={20}
          style={{ marginBottom: theme.spacing.md, flex: 1 }}
        />
      </View>

      <Shimmer
        width="100%"
        height={96}
        borderRadius={20}
        style={{ marginBottom: theme.spacing.lg }}
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
