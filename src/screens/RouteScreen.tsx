import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  ScrollView,
  LinearGradient,
} from 'react-native';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Location } from '../types';

interface RouteScreenProps {
  route: any;
  navigation: any;
}

const RouteScreen: React.FC<RouteScreenProps> = ({ route, navigation }) => {
  const { pickupLocation, destinationLocation, rideType, routeCoordinates, ridePrice } = route.params;
  
  const [region, setRegion] = useState({
    latitude: pickupLocation.latitude,
    longitude: pickupLocation.longitude,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  useEffect(() => {
    // Calculate region to show both pickup and destination
    if (pickupLocation && destinationLocation) {
      const midLat = (pickupLocation.latitude + destinationLocation.latitude) / 2;
      const midLng = (pickupLocation.longitude + destinationLocation.longitude) / 2;
      
      const latDelta = Math.abs(pickupLocation.latitude - destinationLocation.latitude) * 1.5;
      const lngDelta = Math.abs(pickupLocation.longitude - destinationLocation.longitude) * 1.5;
      
      setRegion({
        latitude: midLat,
        longitude: midLng,
        latitudeDelta: Math.max(latDelta, 0.01),
        longitudeDelta: Math.max(lngDelta, 0.01),
      });
    }
  }, [pickupLocation, destinationLocation]);

  const getRideTypeIcon = (type: string) => {
    const icons = {
      bike: 'motorcycle',
      auto: 'car',
      cab: 'taxi',
      parcel: 'cube'
    };
    return icons[type as keyof typeof icons] || 'car';
  };

  const getRideTypeColor = (type: string) => {
    const colors = {
      bike: '#4CAF50',
      auto: '#FF9800',
      cab: '#2196F3',
      parcel: '#9C27B0'
    };
    return colors[type as keyof typeof colors] || '#4CAF50';
  };

  const getRideTypeName = (type: string) => {
    const names = {
      bike: 'Bike',
      auto: 'Auto',
      cab: 'Cab',
      parcel: 'Parcel'
    };
    return names[type as keyof typeof names] || 'Ride';
  };

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleBookRide = () => {
    // TODO: Implement ride booking logic
    console.log('🚗 Booking ride...');
  };

  return (
    <View style={styles.container}>
      {/* Futuristic Background */}
      <View style={styles.backgroundGradient} />
      <View style={styles.backgroundPattern} />
      
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
            <Icon name="arrow-left" size={20} color="#00D4FF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Route & Pricing</Text>
          <View style={styles.headerSpacer} />
        </View>

      {/* Full Screen Map */}
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        region={region}
        showsUserLocation
        showsMyLocationButton
      >
        {/* Pickup Marker */}
        <Marker
          coordinate={pickupLocation}
          title="Pickup Location"
          pinColor="green"
        />
        
        {/* Destination Marker */}
        <Marker
          coordinate={destinationLocation}
          title="Destination"
          pinColor="red"
        />
        
        {/* Route Polyline */}
        {routeCoordinates && routeCoordinates.length > 0 && (
          <Polyline
            coordinates={routeCoordinates}
            strokeWidth={6}
            strokeColor="#4CAF50"
            zIndex={1}
          />
        )}
      </MapView>

      {/* Route Information Card */}
      <View style={styles.routeCard}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Ride Type & Price */}
          <View style={styles.rideTypeSection}>
            <View style={styles.rideTypeInfo}>
              <View style={[styles.rideTypeIcon, { backgroundColor: getRideTypeColor(rideType) }]}>
                <Icon name={getRideTypeIcon(rideType)} size={24} color="white" />
              </View>
              <View style={styles.rideTypeText}>
                <Text style={styles.rideTypeName}>{getRideTypeName(rideType)}</Text>
                <Text style={styles.rideTypeDescription}>
                  {rideType === 'bike' && 'Fast & Affordable'}
                  {rideType === 'auto' && 'Convenient & Safe'}
                  {rideType === 'cab' && 'Comfortable & Premium'}
                  {rideType === 'parcel' && 'Quick Delivery'}
                </Text>
              </View>
            </View>
            <View style={styles.priceContainer}>
              <Text style={styles.priceLabel}>Estimated Fare</Text>
              <Text style={styles.priceAmount}>₹{ridePrice}</Text>
            </View>
          </View>

          {/* Location Details */}
          <View style={styles.locationSection}>
            <View style={styles.locationItem}>
              <View style={styles.locationIconContainer}>
                <Icon name="map-marker" size={16} color="#4CAF50" />
              </View>
              <View style={styles.locationText}>
                <Text style={styles.locationLabel}>Pickup</Text>
                <Text style={styles.locationAddress} numberOfLines={2}>
                  {pickupLocation.address || 'Selected pickup location'}
                </Text>
              </View>
            </View>

            <View style={styles.locationDivider} />

            <View style={styles.locationItem}>
              <View style={styles.locationIconContainer}>
                <Icon name="map-marker" size={16} color="#FF5722" />
              </View>
              <View style={styles.locationText}>
                <Text style={styles.locationLabel}>Destination</Text>
                <Text style={styles.locationAddress} numberOfLines={2}>
                  {destinationLocation.address || 'Selected destination'}
                </Text>
              </View>
            </View>
          </View>

          {/* Route Details */}
          <View style={styles.rideDetailsSection}>
            <View style={styles.rideDetailItem}>
              <Icon name="route" size={16} color="#666" />
              <Text style={styles.rideDetailText}>
                Route calculated and optimized
              </Text>
            </View>
            
            <View style={styles.rideDetailItem}>
              <Icon name="clock-o" size={16} color="#666" />
              <Text style={styles.rideDetailText}>
                Estimated arrival time will be shown
              </Text>
            </View>
          </View>
        </ScrollView>

        {/* Book Ride Button */}
        <TouchableOpacity style={styles.bookRideButton} onPress={handleBookRide}>
          <Icon name="check" size={18} color="white" style={styles.bookRideButtonIcon} />
          <Text style={styles.bookRideButtonText}>Book This Ride</Text>
        </TouchableOpacity>
      </View>
      </SafeAreaView>
    </View>
  );
};

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0A',
  },
  backgroundGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#0A0A0A',
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
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: 'rgba(26, 26, 26, 0.95)',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    zIndex: 1000,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0, 212, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#00D4FF',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
    textShadowColor: '#00D4FF',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  headerSpacer: {
    width: 40,
  },
  map: {
    flex: 1,
  },
  routeCard: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(26, 26, 26, 0.95)',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    maxHeight: height * 0.6,
    shadowColor: '#00D4FF',
    shadowOffset: {
      width: 0,
      height: -4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
    zIndex: 1000,
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: '#333',
  },
  rideTypeSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  rideTypeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rideTypeIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    shadowColor: '#00D4FF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
    elevation: 8,
  },
  rideTypeText: {
    flex: 1,
  },
  rideTypeName: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  rideTypeDescription: {
    fontSize: 14,
    color: '#B0B0B0',
    fontWeight: '500',
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  priceLabel: {
    fontSize: 12,
    color: '#B0B0B0',
    marginBottom: 4,
    fontWeight: '600',
  },
  priceAmount: {
    fontSize: 28,
    fontWeight: '800',
    color: '#00D4FF',
    textShadowColor: '#00D4FF',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  locationSection: {
    marginBottom: 24,
  },
  locationItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  locationIconContainer: {
    width: 32,
    alignItems: 'center',
    marginTop: 2,
  },
  locationText: {
    flex: 1,
    marginLeft: 16,
  },
  locationLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  locationAddress: {
    fontSize: 14,
    color: '#B0B0B0',
    lineHeight: 20,
    fontWeight: '500',
  },
  locationDivider: {
    height: 1,
    backgroundColor: '#333',
    marginVertical: 16,
    marginLeft: 48,
  },
  rideDetailsSection: {
    marginBottom: 24,
  },
  rideDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  rideDetailText: {
    fontSize: 14,
    color: '#B0B0B0',
    marginLeft: 12,
    fontWeight: '500',
  },
  bookRideButton: {
    backgroundColor: '#00D4FF',
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    shadowColor: '#00D4FF',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 1,
    borderColor: '#00D4FF',
  },
  bookRideButtonIcon: {
    marginRight: 10,
  },
  bookRideButtonText: {
    color: '#0A0A0A',
    fontSize: 18,
    fontWeight: '800',
  },
});

export default RouteScreen;
