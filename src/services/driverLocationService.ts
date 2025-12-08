import RideService from './rideService';
import LocationService from './locationService';
import { Location } from '../types';
import auth from '@react-native-firebase/auth';

class DriverLocationService {
  private locationUpdateInterval: NodeJS.Timeout | null = null;
  private isTracking = false;
  private currentDriverId: string | null = null;

  async startTrackingDriverLocation(driverId: string, updateIntervalMs: number = 5000): Promise<void> {
    if (this.isTracking) {
      this.stopTrackingDriverLocation();
    }

    this.currentDriverId = driverId;
    this.isTracking = true;

    const updateLocation = async () => {
      try {
        const location = await LocationService.getCurrentLocation();
        if (location && this.currentDriverId) {
          await RideService.updateDriverLocation(this.currentDriverId, location);
          console.log('Driver location updated:', location);
        }
      } catch (error) {
        console.error('Error updating driver location:', error);
      }
    };

    LocationService.startLocationWatcher(async (location: Location) => {
      if (this.currentDriverId) {
        await RideService.updateDriverLocation(this.currentDriverId, location);
      }
    });

    await updateLocation();
    this.locationUpdateInterval = setInterval(updateLocation, updateIntervalMs);
  }

  stopTrackingDriverLocation(): void {
    if (this.locationUpdateInterval) {
      clearInterval(this.locationUpdateInterval);
      this.locationUpdateInterval = null;
    }
    LocationService.stopLocationWatcher();
    this.isTracking = false;
    this.currentDriverId = null;
  }

  async initializeDriverProfile(
    name: string,
    vehicleModel: string,
    initialLocation: Location
  ): Promise<string> {
    const userId = auth().currentUser?.uid;
    if (!userId) {
      throw new Error('User not authenticated');
    }

    const driverId = await RideService.createDriverProfile({
      name,
      vehicle: { model: vehicleModel },
      rating: 5.0,
      isAvailable: false,
      isOnline: false,
      currentLocation: initialLocation,
    });

    return driverId;
  }

  async setDriverOnline(driverId: string, isOnline: boolean): Promise<void> {
    await RideService.setDriverOnlineStatus(driverId, isOnline);
    
    if (isOnline) {
      const location = await LocationService.getCurrentLocation();
      if (location) {
        await RideService.updateDriverLocation(driverId, location);
      }
      await this.startTrackingDriverLocation(driverId);
    } else {
      this.stopTrackingDriverLocation();
    }
  }
}

export default new DriverLocationService();

