import firestore from '@react-native-firebase/firestore';
import { Location, Ride, Driver, RideRequest } from '../types';
import auth from '@react-native-firebase/auth';

const RIDES_COLLECTION = 'rides';
const DRIVERS_COLLECTION = 'drivers';
const USERS_COLLECTION = 'users';

class RideService {
  private ridesRef = firestore().collection(RIDES_COLLECTION);
  private driversRef = firestore().collection(DRIVERS_COLLECTION);
  private usersRef = firestore().collection(USERS_COLLECTION);

  static calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number {
    const R = 6371;
    const dLat = RideService.toRad(lat2 - lat1);
    const dLon = RideService.toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(RideService.toRad(lat1)) *
        Math.cos(RideService.toRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private static toRad(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  async createRideRequest(rideRequest: Omit<Ride, 'id' | 'status' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const userId = auth().currentUser?.uid;
    if (!userId) {
      throw new Error('User not authenticated');
    }

    const rideData = {
      ...rideRequest,
      userId,
      status: 'pending' as const,
      createdAt: firestore.FieldValue.serverTimestamp(),
      updatedAt: firestore.FieldValue.serverTimestamp(),
    };

    const docRef = await this.ridesRef.add(rideData);
    return docRef.id;
  }

  async findNearbyDrivers(
    location: Location,
    radiusKm: number = 5
  ): Promise<Driver[]> {
    const drivers: Driver[] = [];
    
    try {
      const snapshot = await this.driversRef
        .where('isAvailable', '==', true)
        .where('isOnline', '==', true)
        .get();

      snapshot.forEach((doc) => {
        const driverData = doc.data();
        const driverLocation = driverData.currentLocation;
        
        if (driverLocation) {
          const distance = RideService.calculateDistance(
            location.latitude,
            location.longitude,
            driverLocation.latitude,
            driverLocation.longitude
          );

          if (distance <= radiusKm) {
            drivers.push({
              id: doc.id,
              ...driverData,
              currentLocation: driverLocation,
            } as Driver);
          }
        }
      });

      drivers.sort((a, b) => {
        const distA = RideService.calculateDistance(
          location.latitude,
          location.longitude,
          a.currentLocation.latitude,
          a.currentLocation.longitude
        );
        const distB = RideService.calculateDistance(
          location.latitude,
          location.longitude,
          b.currentLocation.latitude,
          b.currentLocation.longitude
        );
        return distA - distB;
      });
    } catch (error) {
      console.error('Error finding nearby drivers:', error);
    }

    return drivers;
  }

  subscribeToNearbyDrivers(
    location: Location,
    radiusKm: number,
    callback: (drivers: Driver[]) => void
  ): () => void {
    return this.driversRef
      .where('isAvailable', '==', true)
      .where('isOnline', '==', true)
      .onSnapshot(
        (snapshot) => {
          const drivers: Driver[] = [];
          
          snapshot.forEach((doc) => {
            const driverData = doc.data();
            const driverLocation = driverData.currentLocation;
            
            if (driverLocation) {
              const distance = RideService.calculateDistance(
                location.latitude,
                location.longitude,
                driverLocation.latitude,
                driverLocation.longitude
              );

              if (distance <= radiusKm) {
                drivers.push({
                  id: doc.id,
                  ...driverData,
                  currentLocation: driverLocation,
                } as Driver);
              }
            }
          });

          drivers.sort((a, b) => {
            const distA = RideService.calculateDistance(
              location.latitude,
              location.longitude,
              a.currentLocation.latitude,
              a.currentLocation.longitude
            );
            const distB = RideService.calculateDistance(
              location.latitude,
              location.longitude,
              b.currentLocation.latitude,
              b.currentLocation.longitude
            );
            return distA - distB;
          });

          callback(drivers);
        },
        (error) => {
          console.error('Error subscribing to nearby drivers:', error);
          callback([]);
        }
      );
  }

  async getAvailableRides(
    driverLocation: Location,
    radiusKm: number = 10
  ): Promise<RideRequest[]> {
    const rides: RideRequest[] = [];
    
    try {
      const snapshot = await this.ridesRef
        .where('status', '==', 'pending')
        .orderBy('createdAt', 'desc')
        .limit(50)
        .get();

      snapshot.forEach((doc) => {
        const rideData = doc.data();
        const pickupLocation = rideData.pickup;
        
        if (pickupLocation) {
          const distance = RideService.calculateDistance(
            driverLocation.latitude,
            driverLocation.longitude,
            pickupLocation.latitude,
            pickupLocation.longitude
          );

          if (distance <= radiusKm) {
            rides.push({
              id: doc.id,
              ...rideData,
              pickup: pickupLocation,
            } as RideRequest);
          }
        }
      });

      rides.sort((a, b) => {
        const distA = RideService.calculateDistance(
          driverLocation.latitude,
          driverLocation.longitude,
          a.pickup.latitude,
          a.pickup.longitude
        );
        const distB = RideService.calculateDistance(
          driverLocation.latitude,
          driverLocation.longitude,
          b.pickup.latitude,
          b.pickup.longitude
        );
        return distA - distB;
      });
    } catch (error) {
      console.error('Error getting available rides:', error);
    }

    return rides;
  }

  subscribeToAvailableRides(
    driverLocation: Location,
    radiusKm: number,
    callback: (rides: RideRequest[]) => void
  ): () => void {
    return this.ridesRef
      .where('status', '==', 'pending')
      .orderBy('createdAt', 'desc')
      .limit(50)
      .onSnapshot(
        (snapshot) => {
          const rides: RideRequest[] = [];
          
          snapshot.forEach((doc) => {
            const rideData = doc.data();
            const pickupLocation = rideData.pickup;
            
            if (pickupLocation) {
              const distance = RideService.calculateDistance(
                driverLocation.latitude,
                driverLocation.longitude,
                pickupLocation.latitude,
                pickupLocation.longitude
              );

              if (distance <= radiusKm) {
                rides.push({
                  id: doc.id,
                  ...rideData,
                  pickup: pickupLocation,
                } as RideRequest);
              }
            }
          });

          rides.sort((a, b) => {
            const distA = RideService.calculateDistance(
              driverLocation.latitude,
              driverLocation.longitude,
              a.pickup.latitude,
              a.pickup.longitude
            );
            const distB = RideService.calculateDistance(
              driverLocation.latitude,
              driverLocation.longitude,
              b.pickup.latitude,
              b.pickup.longitude
            );
            return distA - distB;
          });

          callback(rides);
        },
        (error) => {
          console.error('Error subscribing to available rides:', error);
          callback([]);
        }
      );
  }

  async updateDriverLocation(driverId: string, location: Location): Promise<void> {
    await this.driversRef.doc(driverId).update({
      currentLocation: {
        latitude: location.latitude,
        longitude: location.longitude,
        address: location.address,
      },
      lastLocationUpdate: firestore.FieldValue.serverTimestamp(),
    });
  }

  async setDriverOnlineStatus(driverId: string, isOnline: boolean): Promise<void> {
    await this.driversRef.doc(driverId).update({
      isOnline,
      isAvailable: isOnline,
      lastOnlineUpdate: firestore.FieldValue.serverTimestamp(),
    });
  }

  async acceptRide(rideId: string, driverId: string): Promise<void> {
    await this.ridesRef.doc(rideId).update({
      driverId,
      status: 'accepted',
      updatedAt: firestore.FieldValue.serverTimestamp(),
    });

    await this.driversRef.doc(driverId).update({
      isAvailable: false,
    });
  }

  async updateRideStatus(
    rideId: string,
    status: Ride['status']
  ): Promise<void> {
    await this.ridesRef.doc(rideId).update({
      status,
      updatedAt: firestore.FieldValue.serverTimestamp(),
    });

    if (status === 'completed' || status === 'cancelled') {
      const rideDoc = await this.ridesRef.doc(rideId).get();
      const rideData = rideDoc.data();
      
      if (rideData?.driverId) {
        await this.driversRef.doc(rideData.driverId).update({
          isAvailable: true,
        });
      }
    }
  }

  subscribeToRide(rideId: string, callback: (ride: Ride | null) => void): () => void {
    return this.ridesRef.doc(rideId).onSnapshot(
      (doc) => {
        if (doc.exists) {
          const rideData = doc.data();
          callback({
            id: doc.id,
            ...rideData,
            createdAt: rideData.createdAt?.toDate() || new Date(),
            updatedAt: rideData.updatedAt?.toDate() || new Date(),
          } as Ride);
        } else {
          callback(null);
        }
      },
      (error) => {
        console.error('Error subscribing to ride:', error);
        callback(null);
      }
    );
  }

  subscribeToDriverLocation(
    driverId: string,
    callback: (location: Location | null) => void
  ): () => void {
    return this.driversRef.doc(driverId).onSnapshot(
      (doc) => {
        if (doc.exists) {
          const driverData = doc.data();
          callback(driverData.currentLocation || null);
        } else {
          callback(null);
        }
      },
      (error) => {
        console.error('Error subscribing to driver location:', error);
        callback(null);
      }
    );
  }

  async createDriverProfile(driverData: Omit<Driver, 'id'>): Promise<string> {
    const userId = auth().currentUser?.uid;
    if (!userId) {
      throw new Error('User not authenticated');
    }

    const driverDoc = {
      ...driverData,
      userId,
      isOnline: false,
      isAvailable: false,
      createdAt: firestore.FieldValue.serverTimestamp(),
      updatedAt: firestore.FieldValue.serverTimestamp(),
    };

    const docRef = await this.driversRef.add(driverDoc);
    return docRef.id;
  }

  async getDriverProfile(driverId: string): Promise<Driver | null> {
    try {
      const doc = await this.driversRef.doc(driverId).get();
      if (doc.exists) {
        return {
          id: doc.id,
          ...doc.data(),
        } as Driver;
      }
      return null;
    } catch (error) {
      console.error('Error getting driver profile:', error);
      return null;
    }
  }

  async getUserRides(userId: string): Promise<Ride[]> {
    const rides: Ride[] = [];
    
    try {
      const snapshot = await this.ridesRef
        .where('userId', '==', userId)
        .orderBy('createdAt', 'desc')
        .get();

      snapshot.forEach((doc) => {
        const rideData = doc.data();
        rides.push({
          id: doc.id,
          ...rideData,
          createdAt: rideData.createdAt?.toDate() || new Date(),
          updatedAt: rideData.updatedAt?.toDate() || new Date(),
        } as Ride);
      });
    } catch (error) {
      console.error('Error getting user rides:', error);
    }

    return rides;
  }

  async getDriverRides(driverId: string): Promise<Ride[]> {
    const rides: Ride[] = [];
    
    try {
      const snapshot = await this.ridesRef
        .where('driverId', '==', driverId)
        .orderBy('createdAt', 'desc')
        .get();

      snapshot.forEach((doc) => {
        const rideData = doc.data();
        rides.push({
          id: doc.id,
          ...rideData,
          createdAt: rideData.createdAt?.toDate() || new Date(),
          updatedAt: rideData.updatedAt?.toDate() || new Date(),
        } as Ride);
      });
    } catch (error) {
      console.error('Error getting driver rides:', error);
    }

    return rides;
  }
}

const rideServiceInstance = new RideService();
export default rideServiceInstance;
export { RideService };

