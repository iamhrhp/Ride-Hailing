import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Switch,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/FontAwesome';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import RideService from '../services/rideService';
import DriverLocationService from '../services/driverLocationService';
import LocationService from '../services/locationService';
import { Location, RideRequest } from '../types';
import { useAuth } from '../contexts/AuthContext';

interface RideRequest {
  id: string;
  passengerName: string;
  pickup: { latitude: number; longitude: number; address: string };
  destination: { latitude: number; longitude: number; address: string };
  distance: number;
  fare: number;
  rideType: string;
  requestedAt: Date;
}

const RiderHomeScreen: React.FC = () => {
  const { user } = useAuth();
  const [isOnline, setIsOnline] = useState(false);
  const [availableRides, setAvailableRides] = useState<RideRequest[]>([]);
  const [selectedRide, setSelectedRide] = useState<RideRequest | null>(null);
  const [driverLocation, setDriverLocation] = useState<Location | null>(null);
  const [driverId, setDriverId] = useState<string | null>(null);

  useEffect(() => {
    LocationService.getCurrentLocation().then(setDriverLocation);
  }, []);

  useEffect(() => {
    if (isOnline && driverLocation && driverId) {
      const unsubscribe = RideService.subscribeToAvailableRides(
        driverLocation,
        10,
        (rides) => {
          setAvailableRides(rides);
        }
      );

      return () => unsubscribe();
    } else {
      setAvailableRides([]);
    }
  }, [isOnline, driverLocation, driverId]);

  const handleToggleOnline = async (value: boolean) => {
    try {
      if (value) {
        if (!driverId) {
          const location = await LocationService.getCurrentLocation();
          if (!location) {
            Alert.alert('Error', 'Unable to get your location');
            return;
          }

          const name = user?.displayName || user?.email?.split('@')[0] || 'Driver';
          const newDriverId = await DriverLocationService.initializeDriverProfile(
            name,
            'Vehicle',
            location
          );
          setDriverId(newDriverId);
          await DriverLocationService.setDriverOnline(newDriverId, true);
        } else {
          await DriverLocationService.setDriverOnline(driverId, true);
        }
        Alert.alert('You\'re Online', 'You will now receive ride requests');
      } else {
        if (driverId) {
          await DriverLocationService.setDriverOnline(driverId, false);
        }
        Alert.alert('You\'re Offline', 'You will not receive new ride requests');
      }
      setIsOnline(value);
    } catch (error: any) {
      console.error('Error toggling online status:', error);
      Alert.alert('Error', error.message || 'Failed to update online status');
    }
  };

  const handleAcceptRide = async (ride: RideRequest) => {
    if (!ride.id || !driverId) {
      Alert.alert('Error', 'Missing ride or driver information');
      return;
    }

    Alert.alert(
      'Accept Ride',
      `Accept ride for ₹${ride.fare || ride.price || 0}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Accept',
          onPress: async () => {
            try {
              await RideService.acceptRide(ride.id!, driverId);
              Alert.alert('Ride Accepted', 'Navigate to pickup location');
            } catch (error: any) {
              console.error('Error accepting ride:', error);
              Alert.alert('Error', error.message || 'Failed to accept ride');
            }
          },
        },
      ]
    );
  };

  const renderRideRequest = ({ item }: { item: RideRequest }) => (
    <TouchableOpacity
      style={styles.rideRequestCard}
      onPress={() => setSelectedRide(item)}
    >
      <View style={styles.rideRequestHeader}>
        <View style={styles.passengerInfo}>
          <View style={styles.avatar}>
            <Icon name="user" size={20} color="#FF6B35" />
          </View>
          <View>
            <Text style={styles.passengerName}>{item.passengerName}</Text>
            <View style={styles.rideTypeBadge}>
              <Icon name={item.rideType === 'car' ? 'car' : 'motorcycle'} size={12} color="#FF6B35" />
              <Text style={styles.rideTypeText}>{item.rideType.toUpperCase()}</Text>
            </View>
          </View>
        </View>
        <View style={styles.fareContainer}>
          <Text style={styles.fareAmount}>₹{item.fare}</Text>
          <Text style={styles.fareLabel}>Fare</Text>
        </View>
      </View>

      <View style={styles.routeInfo}>
        <View style={styles.routePoint}>
          <View style={styles.routeDot} />
          <Text style={styles.routeText} numberOfLines={1}>{item.pickup.address}</Text>
        </View>
        <View style={styles.routeLine} />
        <View style={styles.routePoint}>
          <View style={[styles.routeDot, styles.routeDotDestination]} />
          <Text style={styles.routeText} numberOfLines={1}>{item.destination.address}</Text>
        </View>
      </View>

      <View style={styles.rideDetails}>
        <View style={styles.detailItem}>
          <Icon name="road" size={14} color="#666" />
          <Text style={styles.detailText}>{item.distance} km</Text>
        </View>
        <View style={styles.detailItem}>
          <Icon name="clock-o" size={14} color="#666" />
          <Text style={styles.detailText}>Just now</Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.acceptButton}
        onPress={() => handleAcceptRide(item)}
      >
        <Text style={styles.acceptButtonText}>Accept Ride</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header with Online Toggle */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.greeting}>Good Morning</Text>
            <Text style={styles.riderName}>Rider</Text>
          </View>
          <View style={styles.onlineToggleContainer}>
            <Text style={styles.onlineStatusText}>{isOnline ? 'Online' : 'Offline'}</Text>
            <Switch
              value={isOnline}
              onValueChange={handleToggleOnline}
              trackColor={{ false: '#E0E0E0', true: '#4CAF50' }}
              thumbColor={isOnline ? '#FFFFFF' : '#FFFFFF'}
            />
          </View>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Earnings Summary */}
        <View style={styles.earningsCard}>
          <Text style={styles.earningsTitle}>Today's Earnings</Text>
          <View style={styles.earningsRow}>
            <View style={styles.earningsItem}>
              <Text style={styles.earningsAmount}>₹1,250</Text>
              <Text style={styles.earningsLabel}>Total</Text>
            </View>
            <View style={styles.earningsDivider} />
            <View style={styles.earningsItem}>
              <Text style={styles.earningsAmount}>8</Text>
              <Text style={styles.earningsLabel}>Rides</Text>
            </View>
            <View style={styles.earningsDivider} />
            <View style={styles.earningsItem}>
              <Text style={styles.earningsAmount}>₹156</Text>
              <Text style={styles.earningsLabel}>Avg/Ride</Text>
            </View>
          </View>
        </View>

        {/* Stats Cards */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Icon name="trophy" size={24} color="#FF6B35" />
            <Text style={styles.statValue}>4.8</Text>
            <Text style={styles.statLabel}>Rating</Text>
          </View>
          <View style={styles.statCard}>
            <Icon name="calendar" size={24} color="#FF6B35" />
            <Text style={styles.statValue}>127</Text>
            <Text style={styles.statLabel}>Total Rides</Text>
          </View>
          <View style={styles.statCard}>
            <Icon name="money" size={24} color="#FF6B35" />
            <Text style={styles.statValue}>₹18.5K</Text>
            <Text style={styles.statLabel}>This Month</Text>
          </View>
        </View>

        {/* Available Rides */}
        {isOnline ? (
          <View style={styles.ridesSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Available Rides</Text>
              <Text style={styles.ridesCount}>{availableRides.length} nearby</Text>
            </View>
            {availableRides.length > 0 ? (
              <FlatList
                data={availableRides}
                renderItem={renderRideRequest}
                keyExtractor={(item) => item.id}
                scrollEnabled={false}
              />
            ) : (
              <View style={styles.noRidesContainer}>
                <Icon name="search" size={48} color="#E0E0E0" />
                <Text style={styles.noRidesText}>No rides available</Text>
                <Text style={styles.noRidesSubtext}>Waiting for ride requests...</Text>
              </View>
            )}
          </View>
        ) : (
          <View style={styles.offlineContainer}>
            <Icon name="power-off" size={64} color="#E0E0E0" />
            <Text style={styles.offlineText}>You're Offline</Text>
            <Text style={styles.offlineSubtext}>
              Turn on to start receiving ride requests
            </Text>
            <TouchableOpacity
              style={styles.goOnlineButton}
              onPress={() => handleToggleOnline(true)}
            >
              <Text style={styles.goOnlineButtonText}>Go Online</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: {
    fontSize: 14,
    color: '#666',
  },
  riderName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 4,
  },
  onlineToggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  onlineStatusText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  content: {
    flex: 1,
  },
  earningsCard: {
    backgroundColor: '#FFFFFF',
    margin: 20,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  earningsTitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
  },
  earningsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  earningsItem: {
    alignItems: 'center',
    flex: 1,
  },
  earningsAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF6B35',
    marginBottom: 4,
  },
  earningsLabel: {
    fontSize: 12,
    color: '#666',
  },
  earningsDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#E0E0E0',
  },
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
  },
  ridesSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  ridesCount: {
    fontSize: 14,
    color: '#FF6B35',
    fontWeight: '600',
  },
  rideRequestCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  rideRequestHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  passengerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFF5F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  passengerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  rideTypeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  rideTypeText: {
    fontSize: 10,
    color: '#FF6B35',
    fontWeight: '600',
  },
  fareContainer: {
    alignItems: 'flex-end',
  },
  fareAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FF6B35',
    marginBottom: 4,
  },
  fareLabel: {
    fontSize: 12,
    color: '#666',
  },
  routeInfo: {
    marginBottom: 16,
  },
  routePoint: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  routeDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#4CAF50',
    marginRight: 12,
  },
  routeDotDestination: {
    backgroundColor: '#FF6B35',
  },
  routeLine: {
    width: 2,
    height: 20,
    backgroundColor: '#E0E0E0',
    marginLeft: 5,
    marginBottom: 8,
  },
  routeText: {
    flex: 1,
    fontSize: 14,
    color: '#666',
  },
  rideDetails: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  detailText: {
    fontSize: 12,
    color: '#666',
  },
  acceptButton: {
    backgroundColor: '#FF6B35',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  acceptButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  noRidesContainer: {
    alignItems: 'center',
    padding: 40,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
  },
  noRidesText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginTop: 16,
    marginBottom: 8,
  },
  noRidesSubtext: {
    fontSize: 14,
    color: '#666',
  },
  offlineContainer: {
    alignItems: 'center',
    padding: 40,
    backgroundColor: '#FFFFFF',
    margin: 20,
    borderRadius: 16,
  },
  offlineText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 16,
    marginBottom: 8,
  },
  offlineSubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  goOnlineButton: {
    backgroundColor: '#FF6B35',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 12,
  },
  goOnlineButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default RiderHomeScreen;

