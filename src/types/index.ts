export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  rating: number;
  isOnline: boolean;
}

export interface Driver {
  id: string;
  name: string;
  vehicle: {
    model: string;
  };
  rating: number;
  isAvailable: boolean;
  currentLocation: Location;
}

export interface Location {
  latitude: number;
  longitude: number;
  address?: string;
}

export interface Ride {
  id: string;
  userId: string;
  driverId?: string;
  pickup: Location;
  destination: Location;
  status: 'pending' | 'accepted' | 'in-progress' | 'completed' | 'cancelled';
  price: number;
  distance: number;
  duration: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface RideRequest {
  pickup: Location;
  destination: Location;
  rideType: 'economy' | 'comfort' | 'premium';
}

export interface NavigationProps {
  navigation: any;
  route: any;
} 