import { Location } from '../types';
import { request, check, openSettings, PERMISSIONS, RESULTS } from 'react-native-permissions';
import { Platform } from 'react-native';
import Geolocation from '@react-native-community/geolocation';

class LocationService {
  private currentLocation: Location | null = null;
  private locationWatcher: number | null = null;

  // Check current permission status
  async checkPermissionStatus(): Promise<string> {
    try {
      let permissionType;
      if (Platform.OS === 'ios') {
        permissionType = PERMISSIONS.IOS.LOCATION_WHEN_IN_USE;
      } else {
        permissionType = PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;
      }
      
      const result = await check(permissionType);
      console.log('Current permission status:', result);
      return result;
    } catch (error) {
      console.log('Error checking permission status:', error);
      return RESULTS.DENIED;
    }
  }

  // Check if location services are enabled
  async checkLocationServicesEnabled(): Promise<boolean> {
    return new Promise((resolve) => {
      try {
        console.log('🔍 Checking if location services are enabled...');
        
        // First try a quick check with shorter timeout
        Geolocation.getCurrentPosition(
          (_position) => {
            console.log('✅ Location services are enabled - got position quickly');
            resolve(true);
          },
          (error) => {
            console.log('⚠️ Quick location check failed, trying with longer timeout...');
            console.log('Error details:', error.code, error.message);
            
            // If quick check fails, try with longer timeout
            Geolocation.getCurrentPosition(
              (_position) => {
                console.log('✅ Location services are enabled - got position with longer timeout');
                resolve(true);
              },
              (retryError) => {
                console.log('❌ Location services check failed with longer timeout:', retryError.code, retryError.message);
                
                // Check if it's a permission issue vs GPS issue
                if (retryError.code === 1) {
                  console.log('❌ Permission denied - this is a permission issue');
                  resolve(false);
                } else if (retryError.code === 2) {
                  console.log('❌ Location unavailable - GPS might be disabled');
                  resolve(false);
                } else if (retryError.code === 3) {
                  console.log('❌ Timeout - GPS might be slow to respond');
                  resolve(false);
                } else {
                  console.log('❌ Unknown error - assuming GPS disabled');
                  resolve(false);
                }
              },
              { 
                timeout: 15000,  // 15 seconds
                maximumAge: 60000, // Accept locations up to 1 minute old
                enableHighAccuracy: false 
              }
            );
          },
          { 
            timeout: 8000,  // 8 seconds for quick check
            maximumAge: 300000, // Accept locations up to 5 minutes old
            enableHighAccuracy: false 
          }
        );
      } catch (error) {
        console.log('❌ Error checking location services:', error);
        resolve(false);
      }
    });
  }

  // Open device settings
  openSettings(): void {
    openSettings();
  }

  // Request location permissions using react-native-permissions
  async requestPermissions(): Promise<boolean> {
    try {
      console.log('Requesting location permissions...');
      
      let permissionType;
      if (Platform.OS === 'ios') {
        permissionType = PERMISSIONS.IOS.LOCATION_WHEN_IN_USE;
      } else {
        permissionType = PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;
      }
      
      const result = await request(permissionType);
      console.log('Permission result:', result);
      
      if (result === RESULTS.GRANTED || result === RESULTS.LIMITED) {
        console.log('Location permission granted');
        return true;
      } else {
        console.log('Location permission denied:', result);
        return false;
      }
    } catch (error) {
      console.log('Location permission request failed:', error);
      return false;
    }
  }

  // Get current location with React Native Geolocation
  async getCurrentLocation(): Promise<Location | null> {
    return new Promise((resolve) => {
      console.log('🔍 Attempting to get current location using React Native Geolocation...');
      
      try {
        // First try with high accuracy and longer timeout
        Geolocation.getCurrentPosition(
          (position: any) => {
            try {
              console.log('✅ Successfully got current location (high accuracy):', {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                accuracy: position.coords.accuracy,
              });
              
              const location: Location = {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
              };
              this.currentLocation = location;
              resolve(location);
            } catch (positionError) {
              console.log('❌ Error processing position:', positionError);
              resolve(null);
            }
          },
          (error: any) => {
            console.log('❌ High accuracy location failed, trying with lower accuracy...');
            console.log('Error code:', error.code);
            console.log('Error message:', error.message);
            
            // If high accuracy fails, try with lower accuracy and longer timeout
            Geolocation.getCurrentPosition(
              (position: any) => {
                try {
                  console.log('✅ Successfully got current location (lower accuracy):', {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    accuracy: position.coords.accuracy,
                  });
                  
                  const location: Location = {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                  };
                  this.currentLocation = location;
                  resolve(location);
                } catch (positionError) {
                  console.log('❌ Error processing lower accuracy position:', positionError);
                  resolve(null);
                }
              },
              (retryError: any) => {
                console.log('❌ Both location attempts failed:', retryError);
                console.log('Retry error code:', retryError.code);
                console.log('Retry error message:', retryError.message);
                
                // Provide more specific error information
                switch (retryError.code) {
                  case 1:
                    console.log('❌ Location permission denied');
                    break;
                  case 2:
                    console.log('❌ Location unavailable - GPS might be disabled');
                    break;
                  case 3:
                    console.log('❌ Location request timeout - GPS might be slow');
                    break;
                  default:
                    console.log('❌ Unknown location error');
                }
                
                resolve(null);
              },
              {
                enableHighAccuracy: false,
                timeout: 30000,  // 30 seconds for lower accuracy
                maximumAge: 300000, // Accept locations up to 5 minutes old
              }
            );
          },
          {
            enableHighAccuracy: true,
            timeout: 25000,  // 25 seconds for high accuracy
            maximumAge: 60000, // Accept locations up to 1 minute old
          }
        );
      } catch (getLocationError) {
        console.log('❌ getCurrentPosition call failed:', getLocationError);
        resolve(null);
      }
    });
  }

  // Start watching location
  startLocationWatcher(callback: (location: Location) => void): void {
    if (this.locationWatcher) {
      this.stopLocationWatcher();
    }

    console.log('Starting location watcher...');
    
    try {
      this.locationWatcher = Geolocation.watchPosition(
        (position: any) => {
          try {
            console.log('Location updated:', {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            });
            
            const location: Location = {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            };
            this.currentLocation = location;
            callback(location);
          } catch (positionError) {
            console.log('Error processing watched position:', positionError);
          }
        },
        (error: any) => {
          console.log('Location watcher error:', error);
        },
        {
          enableHighAccuracy: false,
          distanceFilter: 10, // Update every 10 meters
          interval: 5000, // Update every 5 seconds
          fastestInterval: 2000, // Fastest update every 2 seconds
        }
      );
    } catch (watchError) {
      console.log('watchPosition call failed:', watchError);
    }
  }

  // Stop watching location
  stopLocationWatcher(): void {
    if (this.locationWatcher) {
      try {
        Geolocation.clearWatch(this.locationWatcher);
        this.locationWatcher = null;
        console.log('Location watcher stopped');
      } catch (clearError) {
        console.log('Error clearing location watcher:', clearError);
      }
    }
  }

  // Get cached location
  getCachedLocation(): Location | null {
    return this.currentLocation;
  }

  // Calculate distance between two locations
  calculateDistance(location1: Location, location2: Location): number {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (location2.latitude - location1.latitude) * Math.PI / 180;
    const dLon = (location2.longitude - location1.longitude) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(location1.latitude * Math.PI / 180) * Math.cos(location2.latitude * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  // Check if location is within radius
  isWithinRadius(center: Location, point: Location, radiusKm: number): boolean {
    const distance = this.calculateDistance(center, point);
    return distance <= radiusKm;
  }

  // Get region for map display
  getRegion(location: Location, delta: number = 0.01) {
    return {
      latitude: location.latitude,
      longitude: location.longitude,
      latitudeDelta: delta,
      longitudeDelta: delta,
    };
  }
}

export default new LocationService(); 