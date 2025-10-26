import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Modal,
  TextInput,
} from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import locationService from '../services/locationService';
import placesService from '../services/placesService';
import { Location } from '../types';
import { RESULTS } from 'react-native-permissions';

const HomeScreen: React.FC = () => {
  const [currentLocation, setCurrentLocation] = useState<Location | null>(null);
  const [destination, setDestination] = useState<Location | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [routeCoordinates, setRouteCoordinates] = useState<any[]>([]);
  const [riderLocation, setRiderLocation] = useState<Location | null>(null);

  const [region, setRegion] = useState({
    latitude: 19.0760,
    longitude: 72.8777,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  const [isLocationLoading, setIsLocationLoading] = useState(true);
  const [showRideTypeModal, setShowRideTypeModal] = useState(false);
  const [selectedRideType, setSelectedRideType] = useState<string | null>(null);
  
  // Location search state
  const [pickupText, setPickupText] = useState('');
  const [destinationText, setDestinationText] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearchingLocation, setIsSearchingLocation] = useState(false);
  const [activeInput, setActiveInput] = useState<'pickup' | 'destination' | null>(null);
  
  // Route and rider search state
  const [showSearchRiderModal, setShowSearchRiderModal] = useState(false);
  const [isSearchingRider, setIsSearchingRider] = useState(false);

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
      let permissionStatus = await locationService.checkPermissionStatus();
      console.log('Initial permission status:', permissionStatus);
      
      // Check if permission is granted
      let hasPermission = permissionStatus === RESULTS.GRANTED || 
                         permissionStatus === RESULTS.LIMITED ||
                         permissionStatus === 'granted' || 
                         permissionStatus === 'limited';
      
      // If permission not granted, request it
      if (!hasPermission && permissionStatus !== RESULTS.BLOCKED) {
        console.log('Requesting location permission...');
        const permissionGranted = await locationService.requestPermissions();
        console.log('Permission request result:', permissionGranted);
        
        if (permissionGranted) {
          hasPermission = true;
          permissionStatus = RESULTS.GRANTED;
        }
      }
      
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
        console.log('Please enable location permission in settings to use your device location');
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

  const calculateRoute = async (origin: Location, dest: Location) => {
    try {
      // For now, create a simple straight line route
      // In production, use Google Directions API
      const intermediatePoints = 10;
      const latStep = (dest.latitude - origin.latitude) / intermediatePoints;
      const lngStep = (dest.longitude - origin.longitude) / intermediatePoints;
      
      const routeCoords = [];
      for (let i = 0; i <= intermediatePoints; i++) {
        routeCoords.push({
          latitude: origin.latitude + latStep * i,
          longitude: origin.longitude + lngStep * i,
        });
      }
      
      setRouteCoordinates(routeCoords);
      
      // Update region to fit both markers
      const midLat = (origin.latitude + dest.latitude) / 2;
      const midLng = (origin.longitude + dest.longitude) / 2;
      
      setRegion({
        latitude: midLat,
        longitude: midLng,
        latitudeDelta: Math.max(
          Math.abs(origin.latitude - dest.latitude) * 1.5,
          0.05
        ),
        longitudeDelta: Math.max(
          Math.abs(origin.longitude - dest.longitude) * 1.5,
          0.05
        ),
      });
    } catch (error) {
      console.error('Error calculating route:', error);
    }
  };

  // Calculate route when both locations are selected
  useEffect(() => {
    if (selectedLocation && destination) {
      calculateRoute(selectedLocation, destination);
      // Show search rider modal
      setShowSearchRiderModal(true);
    } else {
      setRouteCoordinates([]);
      setShowSearchRiderModal(false);
    }
  }, [selectedLocation, destination]);

  const setPickupToCurrentLocation = async () => {
    if (currentLocation) {
      setSelectedLocation(currentLocation);
      
      // Get address from coordinates using reverse geocoding
      try {
        const address = await placesService.getPlaceFromCoordinates(
          currentLocation.latitude,
          currentLocation.longitude
        );
        setPickupText(address || 'Current Location');
      } catch (error) {
        console.error('Error getting address:', error);
        setPickupText('Current Location');
      }
      
      // Update map region to center on current location
      setRegion({
        latitude: currentLocation.latitude,
        longitude: currentLocation.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    }
  };

  const setDestinationToCurrentLocation = async () => {
    if (currentLocation) {
      setDestination(currentLocation);
      
      // Get address from coordinates using reverse geocoding
      try {
        const address = await placesService.getPlaceFromCoordinates(
          currentLocation.latitude,
          currentLocation.longitude
        );
        setDestinationText(address || 'Current Location');
      } catch (error) {
        console.error('Error getting address:', error);
        setDestinationText('Current Location');
      }
      
      // Update map region to center on current location
      setRegion({
        latitude: currentLocation.latitude,
        longitude: currentLocation.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    }
  };

  const handleLocationSearch = async (text: string, type: 'pickup' | 'destination') => {
    setActiveInput(type);
    
    if (type === 'pickup') {
      setPickupText(text);
    } else {
      setDestinationText(text);
    }

    if (text.length > 2) {
      setIsSearchingLocation(true);
      
      try {
        // Search using Google Places API
        const results = await placesService.searchPlaces(text);
        
        // Transform results to match our format
        const transformedResults = results.map((result, index) => {
          const coords = {
            latitude: result.geometry.location.lat,
            longitude: result.geometry.location.lng,
          };
          
          console.log(`Result ${index}:`, {
            name: result.structured_formatting.main_text,
            coords: coords,
          });
          
          return {
            id: result.place_id || `result-${index}`,
            name: result.structured_formatting.main_text,
            address: result.description,
            location: coords,
          };
        });
        
        setSearchResults(transformedResults);
        setIsSearchingLocation(false);
      } catch (error) {
        console.error('Error searching places:', error);
        setSearchResults([]);
        setIsSearchingLocation(false);
      }
    } else {
      setSearchResults([]);
      setIsSearchingLocation(false);
    }
  };

  const handleSelectLocation = async (result: any) => {
    console.log('Handling location selection:', result);
    
    const location: Location = {
      latitude: result.location.latitude,
      longitude: result.location.longitude,
      address: result.address || result.name,
    };

    console.log('Setting location to:', location);

    if (activeInput === 'pickup') {
      setSelectedLocation(location);
      setPickupText(result.name || result.address);
    } else {
      setDestination(location);
      setDestinationText(result.name || result.address);
    }

    // Update map region to center on the selected location
    const newRegion = {
      latitude: location.latitude,
      longitude: location.longitude,
      latitudeDelta: 0.01, // Zoom in closer for better view
      longitudeDelta: 0.01,
    };
    
    console.log('Updating map region to:', newRegion);
    setRegion(newRegion);

    setSearchResults([]);
    setActiveInput(null);
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
            <TextInput
              style={styles.textInput}
              placeholder="Enter pickup location"
              placeholderTextColor="#999999"
              value={pickupText}
              onChangeText={(text) => handleLocationSearch(text, 'pickup')}
              onFocus={() => setActiveInput('pickup')}
            />
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
            <TextInput
              style={styles.textInput}
              placeholder="Enter destination"
              placeholderTextColor="#999999"
              value={destinationText}
              onChangeText={(text) => handleLocationSearch(text, 'destination')}
              onFocus={() => setActiveInput('destination')}
            />
          </View>
          <TouchableOpacity 
            style={styles.currentLocationButton}
            onPress={() => setDestinationToCurrentLocation()}
          >
            <Icon name="location-arrow" size={16} color="#FF6B35" />
          </TouchableOpacity>
        </View>

        {/* Search Results List */}
        {searchResults.length > 0 && (
          <View style={styles.searchResultsContainer}>
            <FlatList
              data={searchResults}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.searchResultItem}
                  onPress={() => handleSelectLocation(item)}
                >
                  <View style={styles.searchResultIcon}>
                    <Icon name="map-marker" size={18} color="#FF6B35" />
                  </View>
                  <View style={styles.searchResultTextContainer}>
                    <Text style={styles.searchResultName}>{item.name}</Text>
                    <Text style={styles.searchResultAddress}>{item.address}</Text>
                  </View>
                </TouchableOpacity>
              )}
              scrollEnabled={true}
              keyboardShouldPersistTaps="handled"
              style={styles.searchResultsList}
            />
          </View>
        )}

        {/* Loading indicator when searching */}
        {isSearchingLocation && (
          <View style={styles.searchingContainer}>
            <Icon name="spinner" size={20} color="#FF6B35" />
            <Text style={styles.searchingText}>Searching...</Text>
          </View>
        )}
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

      {/* Search Rider Modal */}
      <Modal
        visible={showSearchRiderModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowSearchRiderModal(false)}
      >
        <View style={styles.searchRiderModalOverlay}>
          <View style={styles.searchRiderModalContent}>
            <View style={styles.searchRiderHeader}>
              <View style={styles.searchRiderIconContainer}>
                <Icon name="motorcycle" size={32} color="#FF6B35" />
                <View style={styles.searchRiderIconGlow} />
              </View>
              <Text style={styles.searchRiderTitle}>Searching for Riders</Text>
              <Text style={styles.searchRiderSubtitle}>We're finding the best riders near you</Text>
            </View>
            
            <View style={styles.rideInfoContainer}>
              <View style={styles.rideInfoItem}>
                <View style={styles.rideInfoIconContainer}>
                  <Icon name="map-marker" size={20} color="#FF6B35" />
                </View>
                <View style={styles.rideInfoTextContainer}>
                  <Text style={styles.rideInfoLabel}>Pickup</Text>
                  <Text style={styles.rideInfoAddress} numberOfLines={1}>
                    {pickupText || 'Current Location'}
                  </Text>
                </View>
              </View>
              
              <View style={styles.routeLine} />
              
              <View style={styles.rideInfoItem}>
                <View style={styles.rideInfoIconContainer}>
                  <Icon name="map-marker" size={20} color="#FF6B35" />
                </View>
                <View style={styles.rideInfoTextContainer}>
                  <Text style={styles.rideInfoLabel}>Destination</Text>
                  <Text style={styles.rideInfoAddress} numberOfLines={1}>
                    {destinationText || 'Destination'}
                  </Text>
                </View>
              </View>
            </View>
            
            <View style={styles.searchRiderAnimation}>
              <Icon name="spinner" size={48} color="#FF6B35" />
              <View style={styles.searchRiderGlow} />
            </View>
            
            <Text style={styles.searchRiderStatus}>
              {isSearchingRider ? 'Looking for riders...' : 'Finding the best match'}
            </Text>
            
            <View style={styles.searchRiderActions}>
              <TouchableOpacity 
                style={styles.searchRiderCancelButton}
                onPress={() => {
                  setShowSearchRiderModal(false);
                  setSearchResults([]);
                }}
              >
                <Text style={styles.searchRiderCancelText}>Cancel</Text>
              </TouchableOpacity>
            </View>
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
  textInput: {
    fontSize: 16,
    color: '#333333',
    paddingVertical: 8,
    paddingHorizontal: 0,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
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
  searchResultsContainer: {
    marginTop: 16,
    maxHeight: 200,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  searchResultsList: {
    maxHeight: 200,
  },
  searchingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    marginTop: 8,
  },
  searchingText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#666666',
  },
  searchResultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  searchResultIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 107, 53, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  searchResultTextContainer: {
    flex: 1,
  },
  searchResultName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 4,
  },
  searchResultAddress: {
    fontSize: 14,
    color: '#666666',
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
  searchRiderModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'flex-end',
  },
  searchRiderModalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: 40,
    paddingHorizontal: 24,
    paddingTop: 32,
  },
  searchRiderHeader: {
    alignItems: 'center',
    marginBottom: 32,
  },
  searchRiderIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 107, 53, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#FF6B35',
  },
  searchRiderIconGlow: {
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
  searchRiderTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#333333',
    marginBottom: 8,
  },
  searchRiderSubtitle: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
  },
  rideInfoContainer: {
    backgroundColor: '#F8F8F8',
    borderRadius: 16,
    padding: 20,
    marginBottom: 32,
  },
  rideInfoItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rideInfoIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 107, 53, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  rideInfoTextContainer: {
    flex: 1,
  },
  rideInfoLabel: {
    fontSize: 12,
    color: '#999999',
    fontWeight: '600',
    marginBottom: 4,
  },
  rideInfoAddress: {
    fontSize: 16,
    color: '#333333',
    fontWeight: '600',
  },
  routeLine: {
    width: 2,
    height: 24,
    backgroundColor: '#FF6B35',
    marginLeft: 16,
    marginVertical: 8,
    borderRadius: 1,
  },
  searchRiderAnimation: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 107, 53, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 24,
    borderWidth: 2,
    borderColor: '#FF6B35',
  },
  searchRiderGlow: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#FF6B35',
    shadowColor: '#FF6B35',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 16,
    elevation: 8,
  },
  searchRiderStatus: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333333',
    textAlign: 'center',
    marginBottom: 24,
  },
  searchRiderActions: {
    paddingTop: 20,
  },
  searchRiderCancelButton: {
    backgroundColor: 'rgba(255, 107, 53, 0.1)',
    borderRadius: 12,
    paddingVertical: 16,
    borderWidth: 2,
    borderColor: '#FF6B35',
  },
  searchRiderCancelText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FF6B35',
    textAlign: 'center',
  },
});

export default HomeScreen;