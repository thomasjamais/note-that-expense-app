import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Redirect, Tabs } from 'expo-router';
import React from 'react';
import { ActivityIndicator, View } from 'react-native';

import BottomBar from '@/components/ui/BottomBar';
import { useAuth } from '@/contexts/AuthContext';
import { theme } from '@/theme';
import { useTranslation } from 'react-i18next';

export default function TabLayout() {
  const { t } = useTranslation();
  const { token, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!token) {
    return <Redirect href="/auth" />;
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.colors.primary[600],
        headerShown: false,
      }}
      tabBar={(props) => <BottomBar {...props} />}
    >
      <Tabs.Screen
        name="Charts/index"
        options={{
          title: t('tabs.chart'),
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="bar-chart" color={color} size={size ?? 12} />
          ),
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          title: t('tabs.expenses'),
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="money" color={color} size={size ?? 12} />
          ),
        }}
      />
      <Tabs.Screen
        name="Settings/index"
        options={{
          title: t('tabs.settings'),
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="cog" color={color} size={size ?? 12} />
          ),
        }}
      />
    </Tabs>
  );
}
