import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/FontAwesome';

interface RiderRide {
  id: string;
  passengerName: string;
  pickup: string;
  destination: string;
  fare: number;
  distance: number;
  duration: number;
  status: 'completed' | 'cancelled';
  date: Date;
  rating?: number;
}

const RiderRidesScreen: React.FC = () => {
  // Mock data for rider's completed rides
  const mockRides: RiderRide[] = [
    {
      id: '1',
      passengerName: 'John Doe',
      pickup: 'Andheri Station, Mumbai',
      destination: 'Bandra Kurla Complex, Mumbai',
      fare: 250,
      distance: 8.5,
      duration: 25,
      status: 'completed',
      date: new Date('2024-01-15T10:30:00'),
      rating: 5,
    },
    {
      id: '2',
      passengerName: 'Jane Smith',
      pickup: 'Powai, Mumbai',
      destination: 'Andheri Station, Mumbai',
      fare: 180,
      distance: 6.2,
      duration: 18,
      status: 'completed',
      date: new Date('2024-01-15T14:20:00'),
      rating: 4,
    },
    {
      id: '3',
      passengerName: 'Mike Johnson',
      pickup: 'Bandra, Mumbai',
      destination: 'Juhu, Mumbai',
      fare: 120,
      distance: 4.5,
      duration: 15,
      status: 'completed',
      date: new Date('2024-01-14T16:45:00'),
      rating: 5,
    },
    {
      id: '4',
      passengerName: 'Sarah Williams',
      pickup: 'Andheri Station, Mumbai',
      destination: 'Goregaon, Mumbai',
      fare: 200,
      distance: 7.8,
      duration: 22,
      status: 'cancelled',
      date: new Date('2024-01-14T12:10:00'),
    },
  ];

  const formatDate = (date: Date) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
  };

  const renderRideItem = ({ item }: { item: RiderRide }) => (
    <TouchableOpacity style={styles.rideCard}>
      <View style={styles.rideHeader}>
        <View style={styles.rideInfo}>
          <View style={styles.passengerRow}>
            <View style={styles.avatar}>
              <Icon name="user" size={16} color="#FF6B35" />
            </View>
            <Text style={styles.passengerName}>{item.passengerName}</Text>
          </View>
          <Text style={styles.rideDate}>
            {formatDate(item.date)} • {formatTime(item.date)}
          </Text>
        </View>
        <View style={styles.fareContainer}>
          <Text style={styles.fareAmount}>₹{item.fare}</Text>
          <View
            style={[
              styles.statusBadge,
              {
                backgroundColor:
                  item.status === 'completed' ? '#4CAF50' : '#FF4444',
              },
            ]}
          >
            <Text style={styles.statusText}>
              {item.status === 'completed' ? 'Completed' : 'Cancelled'}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.routeSection}>
        <View style={styles.routePoint}>
          <View style={styles.routeDot} />
          <Text style={styles.routeText} numberOfLines={1}>
            {item.pickup}
          </Text>
        </View>
        <View style={styles.routeLine} />
        <View style={styles.routePoint}>
          <View style={[styles.routeDot, styles.routeDotDestination]} />
          <Text style={styles.routeText} numberOfLines={1}>
            {item.destination}
          </Text>
        </View>
      </View>

      <View style={styles.rideDetails}>
        <View style={styles.detailItem}>
          <Icon name="road" size={14} color="#666" />
          <Text style={styles.detailText}>{item.distance} km</Text>
        </View>
        <View style={styles.detailItem}>
          <Icon name="clock-o" size={14} color="#666" />
          <Text style={styles.detailText}>{item.duration} min</Text>
        </View>
        {item.rating && (
          <View style={styles.detailItem}>
            <Icon name="star" size={14} color="#FFD700" />
            <Text style={styles.detailText}>{item.rating}.0</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.headerIconContainer}>
            <Icon name="history" size={24} color="#FF6B35" />
          </View>
          <Text style={styles.title}>My Rides</Text>
        </View>
        <Text style={styles.subtitle}>Your completed rides</Text>
      </View>

      <FlatList
        data={mockRides}
        renderItem={renderRideItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
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
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  headerIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFF5F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginLeft: 52,
  },
  listContainer: {
    padding: 20,
  },
  rideCard: {
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
  rideHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  rideInfo: {
    flex: 1,
  },
  passengerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFF5F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  passengerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  rideDate: {
    fontSize: 12,
    color: '#666',
  },
  fareContainer: {
    alignItems: 'flex-end',
  },
  fareAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FF6B35',
    marginBottom: 8,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600',
  },
  routeSection: {
    marginBottom: 16,
  },
  routePoint: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  routeDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#4CAF50',
    marginRight: 12,
  },
  routeDotDestination: {
    backgroundColor: '#FF6B35',
  },
  routeLine: {
    width: 2,
    height: 16,
    backgroundColor: '#E0E0E0',
    marginLeft: 4,
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
});

export default RiderRidesScreen;

