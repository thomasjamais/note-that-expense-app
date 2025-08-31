import HandleTripModal from '@/components/Trips/HandleTripModal';
import { Trip, useListTrips } from '@/components/TripsScreen/hook';
import { Card } from '@/components/ui/Card';
import { theme } from '@/theme';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';

export default function TripList() {
  const { t } = useTranslation();
  const { data: trips, isLoading, isError } = useListTrips();
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  if (isLoading) return <Text>{t('trips.loading')}</Text>;
  if (isError) return <Text>{t('trips.error')}</Text>;
  if (!trips?.length) return <Text>{t('trips.noTrips')}</Text>;

  return (
    <View>
      <Text style={styles.title}>{t('trips.listTitle')}</Text>
      {trips!.map((item) => (
        <TouchableOpacity
          key={item.id}
          onPress={() => {
            setSelectedTrip(item);
            setModalVisible(true);
          }}
        >
          <Card style={{ marginBottom: theme.spacing.sm }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text style={styles.label}>{item.label}</Text>
                  {item.isActive && (
                    <View style={styles.activeIndicator}>
                      <FontAwesome
                        name="check-circle"
                        size={16}
                        color={theme.colors.success[300]}
                      />
                      <Text style={styles.activeText}>{t('trips.isActive')}</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.meta}>{new Date(item.startDate).toLocaleDateString()}</Text>
              </View>
            </View>
          </Card>
        </TouchableOpacity>
      ))}
      {selectedTrip && (
        <HandleTripModal
          selectedTrip={selectedTrip}
          modalVisible={modalVisible}
          setModalInvisible={() => setModalVisible(false)}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  title: { ...theme.typography.subtitle, marginBottom: theme.spacing.sm },
  label: { fontSize: 16, fontWeight: '700', color: theme.colors.text.primary },
  meta: { marginTop: 2, color: theme.colors.text.secondary },
  activeIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: theme.spacing.sm,
    backgroundColor: theme.colors.success + '20',
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.radii.sm,
  },
  activeText: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.success[300],
    marginLeft: theme.spacing.xs,
  },
});
