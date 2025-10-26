import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Modal,
} from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import locationService from '../services/locationService';
import { Location } from '../types';
import { RESULTS } from 'react-native-permissions';
// import { getGoogleMapsKey } from '../config/keys';

const HomeScreen: React.FC = () => {
  const [currentLocation, setCurrentLocation] = useState<Location | null>(null);
  const [destination, setDestination] = useState<Location | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [routeCoordinates] = useState<any[]>([]);
  const [riderLocation] = useState<Location | null>(null);

  const [region, setRegion] = useState({
    latitude: 19.0760,
    longitude: 72.8777,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  const [isLocationLoading, setIsLocationLoading] = useState(true);
  const [showRideTypeModal, setShowRideTypeModal] = useState(false);
  const [selectedRideType, setSelectedRideType] = useState<string | null>(null);

  const rideTypes = [
    { id: 'bike', name: 'Bike', icon: 'motorcycle', color: '#FF6B35', description: 'Fast & Affordable' },
    { id: 'auto', name: 'Auto', icon: 'car', color: '#FF6B35', description: 'Convenient & Safe' },
    { id: 'cab', name: 'Cab', icon: 'taxi', color: '#FF6B35', description: 'Comfortable & Premium' },
    { id: 'parcel', name: 'Parcel', icon: 'cube', color: '#FF6B35', description: 'Quick Delivery' },
  ];

  const initializeLocation = useCallback(async () => {
    try {
      setIsLocationLoading(true);
      console.log('=== INITIALIZE LOCATION START ===');
      
      // First check if we already have a valid location
      if (currentLocation && currentLocation.latitude !== 0 && currentLocation.longitude !== 0) {
        console.log('✅ Already have valid location, skipping initialization');
        setIsLocationLoading(false);
        return;
      }
      
      // Check permission status
      const permissionStatus = await locationService.checkPermissionStatus();
      console.log('Permission status:', permissionStatus);
      
      // Check if permission is granted
      const hasPermission = permissionStatus === RESULTS.GRANTED || 
                           permissionStatus === RESULTS.LIMITED ||
                           permissionStatus === 'granted' || 
                           permissionStatus === 'limited';
      
      if (hasPermission) {
        console.log('Permission granted, attempting to get location...');
        const location = await locationService.getCurrentLocation();
        console.log('Location result:', location);
        
        if (location && location.latitude !== 0 && location.longitude !== 0) {
          console.log('✅ Location successful, updating state');
          setCurrentLocation(location);
          setRegion({
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          });
          setIsLocationLoading(false);
        } else {
          console.log('❌ No valid location data, using fallback');
          setFallbackLocation();
        }
      } else {
        console.log('❌ Permission not granted, using fallback location');
        setFallbackLocation();
      }
    } catch (error) {
      console.error('❌ Error in initializeLocation:', error);
      setFallbackLocation();
    }
  }, [currentLocation]);

  // Helper function to use fallback location (like Uber does)
  function setFallbackLocation() {
    console.log('📍 Using fallback location (Mumbai)');
    const fallbackLocation = { latitude: 19.0760, longitude: 72.8777 };
    setCurrentLocation(fallbackLocation);
    setRegion({
      latitude: fallbackLocation.latitude,
      longitude: fallbackLocation.longitude,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    });
    setIsLocationLoading(false);
    
    // Show a subtle toast/info instead of blocking alert
    // This is how professional apps handle it
    console.log('ℹ️ App is using approximate location. Enable GPS for precise location.');
  }

  // Initialize location on component mount
  useEffect(() => {
    initializeLocation();
  }, [initializeLocation]);

  const setPickupToCurrentLocation = () => {
    if (currentLocation) {
      setSelectedLocation(currentLocation);
    }
  };

  const setDestinationToCurrentLocation = () => {
    if (currentLocation) {
      setDestination(currentLocation);
    }
  };

  const handleRideTypeSelect = (rideTypeId: string) => {
    setSelectedRideType(rideTypeId);
    setShowRideTypeModal(false);
  };

  const handleMapPress = (event: any) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    console.log('Map pressed at:', latitude, longitude);
  };

  return (
    <View style={styles.container}>
      {/* Futuristic Background */}
      <View style={styles.backgroundGradient} />
      <View style={styles.backgroundPattern} />

      {/* Map View */}
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        region={region}
        showsUserLocation={true}
        showsMyLocationButton={false}
        showsCompass={false}
        showsScale={false}
        showsBuildings={true}
        showsTraffic={false}
        showsIndoors={false}
        mapType="standard"
        onRegionChangeComplete={setRegion}
        onPress={handleMapPress}
      >
        {/* Current Location Marker */}
        {currentLocation && currentLocation.latitude !== 0 && (
          <Marker
            coordinate={currentLocation}
            title="Your Location"
            description="You are here"
          >
            <View style={styles.currentLocationMarker}>
              <Icon name="map-marker" size={24} color="#FF6B35" />
            </View>
          </Marker>
        )}

        {/* Selected Location Marker */}
        {selectedLocation && (
          <Marker
            coordinate={selectedLocation}
            title="Selected Location"
            description={selectedLocation.address || 'Selected location'}
          >
            <View style={styles.selectedLocationMarker}>
              <Icon name="map-marker" size={24} color="#FF6B35" />
            </View>
          </Marker>
        )}

        {/* Destination Marker */}
        {destination && destination.latitude !== 0 && (
          <Marker
            coordinate={destination}
            title="Destination"
            description={destination.address || 'Destination'}
          >
            <View style={styles.destinationMarker}>
              <Icon name="map-marker" size={24} color="#FF6B35" />
            </View>
          </Marker>
        )}

        {/* Route Polyline */}
        {routeCoordinates && routeCoordinates.length > 0 && (
          <Polyline
            coordinates={routeCoordinates}
            strokeWidth={4}
            strokeColor="#FF6B35"
          />
        )}

        {/* Rider Location Marker */}
        {riderLocation && riderLocation.latitude !== 0 && (
          <Marker
            coordinate={riderLocation}
            title="Your Rider"
            description="Rider is on the way"
          >
            <View style={styles.riderMarker}>
              <Icon name="motorcycle" size={20} color="#FF6B35" />
            </View>
          </Marker>
        )}
      </MapView>

      {/* Main Card Container */}
      <View style={styles.mainCard}>
        {/* Ride Type Selection */}
        <View style={styles.rideTypeSection}>
          <View style={styles.rideTypeInfo}>
            <View style={styles.rideTypeIcon}>
              <Icon 
                name={selectedRideType ? rideTypes.find(rt => rt.id === selectedRideType)?.icon || 'motorcycle' : 'motorcycle'} 
                size={20} 
                color="white"
              />
            </View>
            <Text style={styles.rideTypeName}>
              {selectedRideType ? rideTypes.find(rt => rt.id === selectedRideType)?.name || 'Bike' : 'Bike'}
            </Text>
          </View>
          <TouchableOpacity 
            style={styles.changeButton}
            onPress={() => setShowRideTypeModal(true)}
          >
            <Icon name="refresh" size={16} color="#FF6B35" />
            <Text style={styles.changeButtonText}>Change</Text>
          </TouchableOpacity>
        </View>

        {/* Pickup Location */}
        <View style={styles.locationInput}>
          <View style={styles.locationIconContainer}>
            <Icon name="map-marker" size={16} color="#FF6B35" />
          </View>
          <View style={styles.locationTextContainer}>
            <Text style={styles.locationLabel}>Pickup Location</Text>
            <View style={styles.locationInputLine} />
          </View>
          <TouchableOpacity 
            style={styles.currentLocationButton}
            onPress={() => setPickupToCurrentLocation()}
          >
            <Icon name="location-arrow" size={16} color="#FF6B35" />
          </TouchableOpacity>
        </View>

        {/* Destination Location */}
        <View style={styles.locationInput}>
          <View style={styles.locationIconContainer}>
            <Icon name="map-marker" size={16} color="#FF6B35" />
          </View>
          <View style={styles.locationTextContainer}>
            <Text style={styles.locationLabel}>Where to?</Text>
            <View style={styles.locationInputLine} />
          </View>
          <TouchableOpacity 
            style={styles.currentLocationButton}
            onPress={() => setDestinationToCurrentLocation()}
          >
            <Icon name="location-arrow" size={16} color="#FF6B35" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Bottom Location Pin */}
      <View style={styles.bottomLocationPin}>
        <Icon name="map-marker" size={32} color="#FF6B35" />
      </View>

      {/* Ride Type Selection Modal */}
      <Modal
        visible={showRideTypeModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowRideTypeModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <View style={styles.modalIconContainer}>
                <Icon name="rocket" size={32} color="#FF6B35" />
              </View>
              <Text style={styles.modalTitle}>Choose Your Ride</Text>
              <Text style={styles.modalSubtitle}>Select the type of service you need</Text>
            </View>
            
            <FlatList
              data={rideTypes}
              keyExtractor={(item) => item.id}
              renderItem={({ item: rideType }) => {
                return (
                  <TouchableOpacity
                    style={[styles.rideTypeListItem, { borderLeftColor: rideType.color }]}
                    onPress={() => handleRideTypeSelect(rideType.id)}
                  >
                    <View style={[styles.rideTypeIcon, { backgroundColor: rideType.color }]}>
                      <Icon name={rideType.icon} size={24} color="white" />
                    </View>
                    <View style={styles.rideTypeTextContainer}>
                      <Text style={styles.rideTypeName}>{rideType.name}</Text>
                      <Text style={styles.rideTypeDescription}>{rideType.description}</Text>
                    </View>
                    <View style={styles.rideTypeArrow}>
                      <Icon name="chevron-right" size={20} color="#FF6B35" />
                    </View>
                  </TouchableOpacity>
                );
              }}
              style={styles.rideTypeList}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.rideTypeListContent}
            />
          </View>
        </View>
      </Modal>

      {/* Loading State */}
      {isLocationLoading && (
        <View style={styles.loadingContainer}>
          <View style={styles.loadingIconContainer}>
            <Icon name="spinner" size={48} color="#FF6B35" />
            <View style={styles.loadingIconGlow} />
          </View>
          <Text style={styles.loadingText}>Getting your location...</Text>
          <Text style={styles.loadingSubtext}>Please wait while we locate you</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
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
  map: {
    flex: 1,
  },
  mainCard: {
    position: 'absolute',
    top: 100,
    left: 20,
    right: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  rideTypeSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  rideTypeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rideTypeIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FF6B35',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  rideTypeName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333333',
  },
  changeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 107, 53, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FF6B35',
  },
  changeButtonText: {
    color: '#FF6B35',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  locationInput: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  locationIconContainer: {
    width: 32,
    alignItems: 'center',
  },
  locationTextContainer: {
    flex: 1,
    marginLeft: 16,
  },
  locationLabel: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 8,
    fontWeight: '500',
  },
  locationInputLine: {
    height: 1,
    backgroundColor: '#333333',
  },
  currentLocationButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 107, 53, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FF6B35',
  },
  bottomLocationPin: {
    position: 'absolute',
    bottom: 50,
    alignSelf: 'center',
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 107, 53, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FF6B35',
    shadowColor: '#FF6B35',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 12,
    elevation: 8,
  },
  currentLocationMarker: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FF6B35',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  selectedLocationMarker: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FF6B35',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  destinationMarker: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FF6B35',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  riderMarker: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FF6B35',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    width: '90%',
    maxHeight: '80%',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  modalHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  modalIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255, 107, 53, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#FF6B35',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#333333',
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
  },
  rideTypeList: {
    maxHeight: 400,
  },
  rideTypeListContent: {
    paddingBottom: 20,
  },
  rideTypeListItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginBottom: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    borderRadius: 12,
    borderLeftWidth: 4,
  },
  rideTypeTextContainer: {
    flex: 1,
    marginLeft: 16,
  },
  rideTypeDescription: {
    fontSize: 14,
    color: '#666666',
    marginTop: 4,
  },
  rideTypeArrow: {
    marginLeft: 12,
  },
  searchResultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  searchResultText: {
    fontSize: 14,
    color: '#333333',
    marginLeft: 12,
    flex: 1,
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 107, 53, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#FF6B35',
  },
  loadingIconGlow: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#FF6B35',
    shadowColor: '#FF6B35',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 12,
    elevation: 8,
  },
  loadingText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333333',
    marginBottom: 8,
  },
  loadingSubtext: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
  },
});

export default HomeScreen;