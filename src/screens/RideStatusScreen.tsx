import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';

const RideStatusScreen: React.FC = () => {
  const [rideStatus, setRideStatus] = useState<'searching' | 'found' | 'arriving' | 'arrived' | 'in-progress'>('searching');
  const [driverInfo, _setDriverInfo] = useState({
    name: 'John Smith',
    rating: 4.8,
    vehicle: 'Toyota Camry',
    plateNumber: 'ABC-123',
    eta: 3,
  });

  useEffect(() => {
    // Simulate ride status progression
    const timer = setTimeout(() => {
      setRideStatus('found');
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const getStatusText = () => {
    switch (rideStatus) {
      case 'searching': return 'Looking for your driver...';
      case 'found': return 'Driver found!';
      case 'arriving': return 'Driver is on the way';
      case 'arrived': return 'Driver has arrived';
      case 'in-progress': return 'On the way to destination';
      default: return '';
    }
  };

  const getStatusColor = () => {
    switch (rideStatus) {
      case 'searching': return '#FFA500';
      case 'found': return '#4CAF50';
      case 'arriving': return '#2196F3';
      case 'arrived': return '#4CAF50';
      case 'in-progress': return '#4CAF50';
      default: return '#666';
    }
  };

  const handleCallDriver = () => {
    Alert.alert('Call Driver', 'Calling driver...');
  };

  const handleMessageDriver = () => {
    Alert.alert('Message Driver', 'Opening chat...');
  };

  const handleCancelRide = () => {
    Alert.alert(
      'Cancel Ride',
      'Are you sure you want to cancel this ride?',
      [
        { text: 'No', style: 'cancel' },
        { text: 'Yes', onPress: () => console.log('Ride cancelled') },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Futuristic Background */}
      <View style={styles.backgroundGradient} />
      <View style={styles.backgroundPattern} />
      
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        region={{
          latitude: 37.78825,
          longitude: -122.4324,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        showsUserLocation
        mapType="standard"
      >
        <Marker
          coordinate={{ latitude: 37.78825, longitude: -122.4324 }}
          title="Your Location"
          pinColor="blue"
        />
        <Marker
          coordinate={{ latitude: 37.7849, longitude: -122.4094 }}
          title="Destination"
          pinColor="red"
        />
      </MapView>

      {/* Status Header */}
      <View style={styles.statusHeader}>
        <View style={styles.statusContent}>
          <View style={styles.statusIconContainer}>
            <View style={[styles.statusIndicator, { backgroundColor: getStatusColor() }]} />
            <View style={[styles.statusGlow, { backgroundColor: getStatusColor() + '40' }]} />
          </View>
          <Text style={styles.statusText}>{getStatusText()}</Text>
        </View>
        <TouchableOpacity style={styles.cancelButton} onPress={handleCancelRide}>
          <Icon name="close" size={20} color="#FF6B35" />
        </TouchableOpacity>
      </View>

      {/* Driver Info Card */}
      {rideStatus !== 'searching' && (
        <View style={styles.driverCard}>
          <View style={styles.driverInfo}>
            <View style={styles.driverAvatarContainer}>
              <View style={styles.driverAvatar}>
                <Icon name="person" size={40} color="white" />
              </View>
              <View style={styles.driverAvatarGlow} />
            </View>
            <View style={styles.driverDetails}>
              <Text style={styles.driverName}>{driverInfo.name}</Text>
              <View style={styles.ratingContainer}>
                <Icon name="star" size={16} color="#FFD700" />
                <Text style={styles.rating}>{driverInfo.rating}</Text>
              </View>
              <Text style={styles.vehicleInfo}>{driverInfo.vehicle} • {driverInfo.plateNumber}</Text>
            </View>
          </View>
          
          <View style={styles.driverActions}>
            <TouchableOpacity style={styles.actionButton} onPress={handleCallDriver}>
              <Icon name="phone" size={24} color="#00D4FF" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton} onPress={handleMessageDriver}>
              <Icon name="message" size={24} color="#00D4FF" />
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* ETA Card */}
      {rideStatus !== 'searching' && (
        <View style={styles.etaCard}>
          <View style={styles.etaInfo}>
            <View style={styles.etaIconContainer}>
              <Icon name="access-time" size={20} color="#00D4FF" />
            </View>
            <Text style={styles.etaText}>ETA: {driverInfo.eta} minutes</Text>
          </View>
          <View style={styles.etaInfo}>
            <View style={styles.etaIconContainer}>
              <Icon name="straighten" size={20} color="#00D4FF" />
            </View>
            <Text style={styles.etaText}>2.5 km away</Text>
          </View>
        </View>
      )}

      {/* Ride Progress */}
      <View style={styles.progressContainer}>
        <View style={styles.progressStep}>
          <View style={styles.progressDotContainer}>
            <View style={[styles.progressDot, rideStatus !== 'searching' && styles.progressDotActive]} />
            {rideStatus !== 'searching' && <View style={styles.progressDotGlow} />}
          </View>
          <Text style={styles.progressText}>Driver Found</Text>
        </View>
        <View style={styles.progressLine} />
        <View style={styles.progressStep}>
          <View style={styles.progressDotContainer}>
            <View style={[styles.progressDot, ['arriving', 'arrived', 'in-progress'].includes(rideStatus) && styles.progressDotActive]} />
            {['arriving', 'arrived', 'in-progress'].includes(rideStatus) && <View style={styles.progressDotGlow} />}
          </View>
          <Text style={styles.progressText}>On the Way</Text>
        </View>
        <View style={styles.progressLine} />
        <View style={styles.progressStep}>
          <View style={styles.progressDotContainer}>
            <View style={[styles.progressDot, ['arrived', 'in-progress'].includes(rideStatus) && styles.progressDotActive]} />
            {['arrived', 'in-progress'].includes(rideStatus) && <View style={styles.progressDotGlow} />}
          </View>
          <Text style={styles.progressText}>Arrived</Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0A',
  },
  // Futuristic Background
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
  map: {
    flex: 1,
  },
  statusHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(26, 26, 26, 0.95)',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  statusContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusIconContainer: {
    position: 'relative',
    marginRight: 12,
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  statusGlow: {
    position: 'absolute',
    top: -4,
    left: -4,
    right: -4,
    bottom: -4,
    borderRadius: 10,
    opacity: 0.6,
  },
  statusText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  cancelButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 107, 53, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FF6B35',
  },
  driverCard: {
    position: 'absolute',
    bottom: 200,
    left: 20,
    right: 20,
    backgroundColor: '#1A1A1A',
    borderRadius: 20,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#333',
    shadowColor: '#00D4FF',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 8,
  },
  driverInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  driverAvatarContainer: {
    position: 'relative',
    marginRight: 16,
  },
  driverAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#00D4FF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#333',
  },
  driverAvatarGlow: {
    position: 'absolute',
    top: -3,
    left: -3,
    right: -3,
    bottom: -3,
    borderRadius: 28,
    backgroundColor: 'rgba(0, 212, 255, 0.2)',
  },
  driverDetails: {
    flex: 1,
  },
  driverName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  rating: {
    marginLeft: 6,
    fontSize: 16,
    color: '#FFD700',
    fontWeight: '700',
  },
  vehicleInfo: {
    fontSize: 14,
    color: '#B0B0B0',
    fontWeight: '500',
  },
  driverActions: {
    flexDirection: 'row',
  },
  actionButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0, 212, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
    borderWidth: 1,
    borderColor: '#00D4FF',
  },
  etaCard: {
    position: 'absolute',
    bottom: 140,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(26, 26, 26, 0.95)',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#00D4FF',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 1,
    borderColor: '#333',
  },
  etaInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  etaText: {
    marginLeft: 12,
    fontSize: 16,
    color: '#00D4FF',
    fontWeight: '700',
  },
  progressContainer: {
    position: 'absolute',
    bottom: 80,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(26, 26, 26, 0.95)',
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#00D4FF',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 1,
    borderColor: '#333',
  },
  progressStep: {
    alignItems: 'center',
    flex: 1,
  },
  progressDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#333',
    marginBottom: 6,
    borderWidth: 2,
    borderColor: '#555',
  },
  progressDotActive: {
    backgroundColor: '#00D4FF',
    borderColor: '#00D4FF',
    shadowColor: '#00D4FF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 4,
  },
  progressText: {
    fontSize: 12,
    color: '#B0B0B0',
    textAlign: 'center',
    fontWeight: '600',
  },
  progressLine: {
    height: 3,
    backgroundColor: '#333',
    flex: 1,
    marginHorizontal: 12,
    borderRadius: 2,
  },
});

export default RideStatusScreen; 