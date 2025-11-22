import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useAuth } from '../contexts/AuthContext';

const RiderProfileScreen: React.FC = () => {
  const { user, signOut } = useAuth();

  const menuItems = [
    { icon: 'car', title: 'Vehicle Details', subtitle: 'Manage your vehicle info' },
    { icon: 'wallet', title: 'Earnings', subtitle: 'View earnings & payouts' },
    { icon: 'credit-card', title: 'Payment Methods', subtitle: 'Bank account & cards' },
    { icon: 'shield', title: 'Documents', subtitle: 'License, insurance & more' },
    { icon: 'bell', title: 'Notifications', subtitle: 'Manage notifications' },
    { icon: 'question-circle', title: 'Help & Support', subtitle: 'Get help and contact us' },
    { icon: 'cog', title: 'Settings', subtitle: 'App settings and preferences' },
  ];

  const handleLogout = () => {
    Alert.alert(
      'Log Out',
      'Are you sure you want to log out?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Log Out',
          style: 'destructive',
          onPress: async () => {
            try {
              await signOut();
            } catch (error) {
              Alert.alert('Error', 'Failed to log out. Please try again.');
            }
          },
        },
      ]
    );
  };

  const renderMenuItem = (item: any, index: number) => (
    <TouchableOpacity key={index} style={styles.menuItem}>
      <View style={styles.menuIconContainer}>
        <Icon name={item.icon} size={20} color="#FF6B35" />
      </View>
      <View style={styles.menuContent}>
        <Text style={styles.menuTitle}>{item.title}</Text>
        <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
      </View>
      <View style={styles.menuArrow}>
        <Icon name="chevron-right" size={16} color="#FF6B35" />
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.profileInfo}>
            <View style={styles.avatarContainer}>
              <View style={styles.avatar}>
                <Icon name="user" size={40} color="white" />
              </View>
            </View>
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{user?.displayName || 'Rider'}</Text>
              <Text style={styles.userEmail}>{user?.email || 'rider@example.com'}</Text>
              <View style={styles.ratingContainer}>
                <Icon name="star" size={16} color="#FFD700" />
                <Text style={styles.rating}>4.8</Text>
                <Text style={styles.ratingLabel}>Rating</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Vehicle Info Card */}
        <View style={styles.vehicleCard}>
          <View style={styles.vehicleHeader}>
            <Icon name="car" size={24} color="#FF6B35" />
            <Text style={styles.vehicleTitle}>Vehicle Information</Text>
          </View>
          <View style={styles.vehicleDetails}>
            <View style={styles.vehicleDetailRow}>
              <Text style={styles.vehicleLabel}>Vehicle Type:</Text>
              <Text style={styles.vehicleValue}>Car</Text>
            </View>
            <View style={styles.vehicleDetailRow}>
              <Text style={styles.vehicleLabel}>Model:</Text>
              <Text style={styles.vehicleValue}>Honda City</Text>
            </View>
            <View style={styles.vehicleDetailRow}>
              <Text style={styles.vehicleLabel}>Number:</Text>
              <Text style={styles.vehicleValue}>MH12AB1234</Text>
            </View>
          </View>
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <View style={styles.statIconContainer}>
              <Icon name="trophy" size={20} color="#FF6B35" />
            </View>
            <Text style={styles.statNumber}>4.8</Text>
            <Text style={styles.statLabel}>Rating</Text>
          </View>
          <View style={styles.statItem}>
            <View style={styles.statIconContainer}>
              <Icon name="car" size={20} color="#FF6B35" />
            </View>
            <Text style={styles.statNumber}>127</Text>
            <Text style={styles.statLabel}>Total Rides</Text>
          </View>
          <View style={styles.statItem}>
            <View style={styles.statIconContainer}>
              <Icon name="money" size={20} color="#FF6B35" />
            </View>
            <Text style={styles.statNumber}>₹18.5K</Text>
            <Text style={styles.statLabel}>This Month</Text>
          </View>
        </View>

        {/* Menu Items */}
        <View style={styles.menuContainer}>
          {menuItems.map(renderMenuItem)}
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <View style={styles.logoutButtonContent}>
            <View style={styles.logoutIconContainer}>
              <Icon name="sign-out" size={20} color="#FF6B35" />
            </View>
            <Text style={styles.logoutText}>Log Out</Text>
          </View>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    backgroundColor: '#FFFFFF',
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    marginRight: 20,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FF6B35',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#E0E0E0',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    marginLeft: 6,
    fontSize: 16,
    color: '#FFD700',
    fontWeight: '700',
  },
  ratingLabel: {
    marginLeft: 8,
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  vehicleCard: {
    backgroundColor: '#FFFFFF',
    margin: 20,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  vehicleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  vehicleTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 12,
  },
  vehicleDetails: {
    gap: 12,
  },
  vehicleDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  vehicleLabel: {
    fontSize: 14,
    color: '#666',
  },
  vehicleValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFF5F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FF6B35',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  menuContainer: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  menuIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFF5F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  menuContent: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  menuSubtitle: {
    fontSize: 12,
    color: '#666',
  },
  menuArrow: {
    marginLeft: 8,
  },
  logoutButton: {
    backgroundColor: '#FFFFFF',
    margin: 20,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#FF6B35',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  logoutButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  logoutIconContainer: {
    marginRight: 12,
  },
  logoutText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FF6B35',
  },
});

export default RiderProfileScreen;

