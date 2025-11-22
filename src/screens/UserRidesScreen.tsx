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
import { Ride } from '../types';
import { formatPrice, formatDistance, formatTimestamp, getStatusColor, getStatusText, formatDuration } from '../utils/general';

const UserRidesScreen: React.FC = () => {
  // Mock data for rides
  const mockRides: Ride[] = [
    {
      id: '1',
      userId: 'user1',
      pickup: { latitude: 37.78825, longitude: -122.4324 },
      destination: { latitude: 37.7849, longitude: -122.4094 },
      status: 'completed',
      price: 125,
      distance: 2.5,
      duration: 12,
      createdAt: new Date('2024-01-15T10:30:00'),
      updatedAt: new Date('2024-01-15T10:42:00'),
    },
    {
      id: '2',
      userId: 'user1',
      pickup: { latitude: 37.7849, longitude: -122.4094 },
      destination: { latitude: 37.78825, longitude: -122.4324 },
      status: 'in-progress',
      price: 145,
      distance: 3.2,
      duration: 15,
      createdAt: new Date('2024-01-15T14:20:00'),
      updatedAt: new Date('2024-01-15T14:20:00'),
    },
  ];

  const renderRideItem = ({ item }: { item: Ride }) => (
    <TouchableOpacity style={styles.rideItem}>
      <View style={styles.rideCard}>
        <View style={styles.rideHeader}>
          <View style={styles.rideInfo}>
            <Text style={styles.rideDate}>{formatTimestamp(item.createdAt)}</Text>
            <Text style={styles.ridePrice}>{formatPrice(item.price)}</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
            <Text style={styles.statusText}>{getStatusText(item.status)}</Text>
          </View>
        </View>
        
        <View style={styles.rideDetails}>
          <View style={styles.detailRow}>
            <View style={styles.detailIconContainer}>
              <Icon name="map-marker" size={16} color="#FF6B35" />
            </View>
            <Text style={styles.detailText}>Pickup location</Text>
          </View>
          <View style={styles.detailRow}>
            <View style={styles.detailIconContainer}>
              <Icon name="map-marker" size={16} color="#FF6B35" />
            </View>
            <Text style={styles.detailText}>Destination</Text>
          </View>
          <View style={styles.detailRow}>
            <View style={styles.detailIconContainer}>
              <Icon name="road" size={16} color="#FF6B35" />
            </View>
            <Text style={styles.detailText}>{formatDistance(item.distance)}</Text>
          </View>
          <View style={styles.detailRow}>
            <View style={styles.detailIconContainer}>
              <Icon name="clock-o" size={16} color="#FF6B35" />
            </View>
            <Text style={styles.detailText}>{formatDuration(item.duration)}</Text>
          </View>
        </View>
        
        <View style={styles.rideFooter}>
          <View style={styles.rideIdContainer}>
            <Text style={styles.rideIdLabel}>Ride ID:</Text>
            <Text style={styles.rideIdValue}>{item.id}</Text>
          </View>
          <TouchableOpacity style={styles.viewDetailsButton}>
            <Text style={styles.viewDetailsText}>View Details</Text>
            <Icon name="chevron-right" size={14} color="#FF6B35" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Futuristic Background */}
      <View style={styles.backgroundGradient} />
      <View style={styles.backgroundPattern} />
      
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.headerIconContainer}>
            <Icon name="history" size={24} color="#FF6B35" />
            <View style={styles.headerIconGlow} />
          </View>
          <Text style={styles.title}>Ride History</Text>
          <View style={styles.headerSpacer} />
        </View>
        <Text style={styles.subtitle}>Your journey timeline</Text>
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
    backgroundColor: '#FFFFFF',
  },
  // Light Background
  backgroundGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#FFFFFF',
  },
  backgroundPattern: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'transparent',
    opacity: 0.1,
  },
  header: {
    padding: 24,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  headerIconContainer: {
    position: 'relative',
    marginRight: 12,
  },
  headerIconGlow: {
    position: 'absolute',
    top: -5,
    left: -5,
    right: -5,
    bottom: -5,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 107, 53, 0.2)',
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#333333',
    flex: 1,
  },
  headerSpacer: {
    width: 40,
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
    fontWeight: '400',
  },
  listContainer: {
    padding: 20,
  },
  rideItem: {
    marginBottom: 16,
  },
  rideCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  rideHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  rideInfo: {
    flex: 1,
  },
  rideDate: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 4,
    fontWeight: '500',
  },
  ridePrice: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FF6B35',
  },
  statusBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  rideDetails: {
    gap: 12,
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 107, 53, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  detailText: {
    fontSize: 14,
    color: '#333333',
    fontWeight: '500',
  },
  rideFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  rideIdContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rideIdLabel: {
    fontSize: 12,
    color: '#666666',
    marginRight: 8,
  },
  rideIdValue: {
    fontSize: 12,
    color: '#FF6B35',
    fontWeight: '600',
  },
  viewDetailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: 'rgba(255, 107, 53, 0.1)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FF6B35',
  },
  viewDetailsText: {
    fontSize: 12,
    color: '#FF6B35',
    fontWeight: '600',
    marginRight: 4,
  },
});

export default UserRidesScreen; 