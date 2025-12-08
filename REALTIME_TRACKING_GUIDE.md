# Real-Time Driver & Ride Tracking Guide

## Overview

This app now has **real-time Firebase Firestore integration** for tracking drivers and rides. The system uses Firebase Firestore's real-time listeners to provide instant updates when drivers become available or when new ride requests are created.

## What's Implemented

### ✅ Services Created

1. **`src/services/rideService.ts`** - Main service for ride and driver operations
2. **`src/services/driverLocationService.ts`** - Service for tracking driver locations in real-time

### ✅ Key Features

- **Real-time driver tracking** - Find nearby available drivers
- **Real-time ride requests** - Drivers see new ride requests instantly
- **Location updates** - Driver locations update automatically
- **Ride status tracking** - Track ride status changes in real-time
- **Distance calculation** - Find nearest drivers/rides

## Firebase Setup Required

### 1. Enable Firestore in Firebase Console

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `gaadisathi-dd714`
3. Go to **Firestore Database**
4. Click **Create Database**
5. Choose **Start in test mode** (for development) or set up security rules
6. Select a location (choose closest to your users)

### 2. Security Rules (Important!)

Add these rules in Firestore > Rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Drivers collection
    match /drivers/{driverId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == resource.data.userId;
    }
    
    // Rides collection
    match /rides/{rideId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
      allow update: if request.auth != null && 
        (request.auth.uid == resource.data.userId || 
         request.auth.uid == resource.data.driverId);
    }
    
    // Users collection
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## How to Use

### For Passengers: Finding Nearby Drivers

```typescript
import RideService from '../services/rideService';
import { Location } from '../types';

// Get nearby drivers (one-time)
const location: Location = { latitude: 19.0760, longitude: 72.8777 };
const nearbyDrivers = await RideService.findNearbyDrivers(location, 5); // 5km radius

// Subscribe to nearby drivers (real-time updates)
const unsubscribe = RideService.subscribeToNearbyDrivers(
  location,
  5, // radius in km
  (drivers) => {
    console.log('Nearby drivers updated:', drivers);
    // Update your UI with the new list of drivers
  }
);

// Don't forget to unsubscribe when component unmounts
// unsubscribe();
```

### For Drivers: Getting Available Rides

```typescript
import RideService from '../services/rideService';
import { Location } from '../types';

// Get available rides (one-time)
const driverLocation: Location = { latitude: 19.0760, longitude: 72.8777 };
const availableRides = await RideService.getAvailableRides(driverLocation, 10);

// Subscribe to available rides (real-time updates)
const unsubscribe = RideService.subscribeToAvailableRides(
  driverLocation,
  10, // radius in km
  (rides) => {
    console.log('Available rides updated:', rides);
    // Update your UI with new ride requests
  }
);

// Don't forget to unsubscribe
// unsubscribe();
```

### For Drivers: Tracking Location

```typescript
import DriverLocationService from '../services/driverLocationService';

// Initialize driver profile (first time only)
const driverId = await DriverLocationService.initializeDriverProfile(
  'John Doe',
  'Toyota Camry',
  { latitude: 19.0760, longitude: 72.8777 }
);

// Set driver online and start tracking
await DriverLocationService.setDriverOnline(driverId, true);

// Set driver offline (stops tracking)
await DriverLocationService.setDriverOnline(driverId, false);
```

### Creating a Ride Request

```typescript
import RideService from '../services/rideService';
import { Location } from '../types';

const pickup: Location = {
  latitude: 19.0760,
  longitude: 72.8777,
  address: 'Andheri Station, Mumbai'
};

const destination: Location = {
  latitude: 19.1077,
  longitude: 72.8317,
  address: 'Bandra Kurla Complex, Mumbai'
};

const rideId = await RideService.createRideRequest({
  userId: '', // Will be set automatically from auth
  pickup,
  destination,
  price: 250,
  distance: 8.5,
  duration: 15,
});
```

### Accepting a Ride (Driver)

```typescript
import RideService from '../services/rideService';

await RideService.acceptRide(rideId, driverId);
```

### Tracking Ride Status (Real-time)

```typescript
import RideService from '../services/rideService';

const unsubscribe = RideService.subscribeToRide(rideId, (ride) => {
  if (ride) {
    console.log('Ride status:', ride.status);
    // Update UI based on ride status
    // Status can be: 'pending', 'accepted', 'in-progress', 'completed', 'cancelled'
  }
});
```

### Tracking Driver Location (Passenger)

```typescript
import RideService from '../services/rideService';

const unsubscribe = RideService.subscribeToDriverLocation(driverId, (location) => {
  if (location) {
    console.log('Driver location:', location);
    // Update map with driver's current location
  }
});
```

## Example: Updating RiderHomeScreen

Replace the mock data with real-time Firebase data:

```typescript
import { useEffect, useState } from 'react';
import RideService from '../services/rideService';
import LocationService from '../services/locationService';
import { Location, RideRequest } from '../types';

const RiderHomeScreen = () => {
  const [isOnline, setIsOnline] = useState(false);
  const [availableRides, setAvailableRides] = useState<RideRequest[]>([]);
  const [driverLocation, setDriverLocation] = useState<Location | null>(null);

  useEffect(() => {
    if (isOnline && driverLocation) {
      // Subscribe to real-time ride requests
      const unsubscribe = RideService.subscribeToAvailableRides(
        driverLocation,
        10, // 10km radius
        (rides) => {
          setAvailableRides(rides);
        }
      );

      return () => unsubscribe();
    } else {
      setAvailableRides([]);
    }
  }, [isOnline, driverLocation]);

  useEffect(() => {
    // Get current location when component mounts
    LocationService.getCurrentLocation().then(setDriverLocation);
  }, []);

  const handleToggleOnline = async (value: boolean) => {
    setIsOnline(value);
    // Here you would also update driver online status in Firebase
    // await DriverLocationService.setDriverOnline(driverId, value);
  };

  // ... rest of component
};
```

## Example: Updating UserHomeScreen (Passenger)

```typescript
import { useEffect, useState } from 'react';
import RideService from '../services/rideService';
import LocationService from '../services/locationService';
import { Driver } from '../types';

const UserHomeScreen = () => {
  const [nearbyDrivers, setNearbyDrivers] = useState<Driver[]>([]);
  const [userLocation, setUserLocation] = useState<Location | null>(null);

  useEffect(() => {
    LocationService.getCurrentLocation().then(setUserLocation);
  }, []);

  useEffect(() => {
    if (userLocation) {
      // Subscribe to nearby drivers in real-time
      const unsubscribe = RideService.subscribeToNearbyDrivers(
        userLocation,
        5, // 5km radius
        (drivers) => {
          setNearbyDrivers(drivers);
        }
      );

      return () => unsubscribe();
    }
  }, [userLocation]);

  // ... rest of component
};
```

## Data Structure

### Driver Document
```typescript
{
  userId: string;           // Firebase Auth UID
  name: string;
  vehicle: {
    model: string;
  };
  rating: number;
  isOnline: boolean;
  isAvailable: boolean;
  currentLocation: {
    latitude: number;
    longitude: number;
    address?: string;
  };
  lastLocationUpdate: Timestamp;
  lastOnlineUpdate: Timestamp;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

### Ride Document
```typescript
{
  userId: string;           // Passenger's Firebase Auth UID
  driverId?: string;        // Driver's Firebase Auth UID (set when accepted)
  pickup: {
    latitude: number;
    longitude: number;
    address?: string;
  };
  destination: {
    latitude: number;
    longitude: number;
    address?: string;
  };
  status: 'pending' | 'accepted' | 'in-progress' | 'completed' | 'cancelled';
  price: number;
  distance: number;         // in kilometers
  duration: number;         // in minutes
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

## Important Notes

1. **Indexes Required**: Firestore may require composite indexes for queries. If you see an error, click the link in the error message to create the index automatically.

2. **Location Updates**: Driver locations update every 5 seconds when online. Adjust `updateIntervalMs` in `driverLocationService.ts` if needed.

3. **Distance Calculation**: Uses Haversine formula for accurate distance calculation on Earth's surface.

4. **Real-time Listeners**: Always unsubscribe from listeners when components unmount to prevent memory leaks.

5. **Error Handling**: All services include error handling, but you should add user-facing error messages in your UI.

## Next Steps

1. ✅ Enable Firestore in Firebase Console
2. ✅ Set up security rules
3. ✅ Update screens to use real-time services
4. ✅ Test with multiple devices/users
5. ✅ Add error handling and loading states
6. ✅ Optimize queries with proper indexes

## Troubleshooting

- **"Missing or insufficient permissions"**: Check Firestore security rules
- **"Index required"**: Create the composite index as suggested in the error
- **No real-time updates**: Ensure listeners are properly set up and not unsubscribed too early
- **Location not updating**: Check location permissions and GPS settings

