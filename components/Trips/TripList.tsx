import HandleTripModal from '@/components/Trips/HandleTripModal';
import { Trip, useListTrips } from '@/components/TripsScreen/hook';
import { Card } from '@/components/ui/Card';
import { theme } from '@/theme';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

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
              <View>
                <Text style={styles.label}>
                  {item.label} {item.isActive ? `(${t('trips.isActive')})` : ''}
                </Text>
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
});
