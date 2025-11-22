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

const UserProfileScreen: React.FC = () => {
  const { user, signOut } = useAuth();

  const menuItems = [
    { icon: 'user', title: 'Personal Information', subtitle: 'Edit your profile' },
    { icon: 'credit-card', title: 'Payment Methods', subtitle: 'Manage your cards' },
    { icon: 'map-marker', title: 'Saved Places', subtitle: 'Your frequent locations' },
    { icon: 'bell', title: 'Notifications', subtitle: 'Manage notifications' },
    { icon: 'shield', title: 'Privacy & Security', subtitle: 'Account security settings' },
    { icon: 'question-circle', title: 'Help & Support', subtitle: 'Get help and contact us' },
    { icon: 'info-circle', title: 'About', subtitle: 'App version and legal info' },
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
      {/* Futuristic Background */}
      <View style={styles.backgroundGradient} />
      <View style={styles.backgroundPattern} />
      
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.profileInfo}>
            <View style={styles.avatarContainer}>
              <View style={styles.avatar}>
                <Icon name="user" size={40} color="white" />
              </View>
              <View style={styles.avatarGlow} />
            </View>
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{user?.displayName || 'User'}</Text>
              <Text style={styles.userEmail}>{user?.email || 'user@example.com'}</Text>
              <View style={styles.ratingContainer}>
                <Icon name="star" size={16} color="#FFD700" />
                <Text style={styles.rating}>4.8</Text>
                <Text style={styles.ratingLabel}>Rating</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <View style={styles.statIconContainer}>
              <Icon name="car" size={20} color="#FF6B35" />
            </View>
            <Text style={styles.statNumber}>24</Text>
            <Text style={styles.statLabel}>Total Rides</Text>
          </View>
          <View style={styles.statItem}>
            <View style={styles.statIconContainer}>
              <Icon name="road" size={20} color="#FF6B35" />
            </View>
            <Text style={styles.statNumber}>156</Text>
            <Text style={styles.statLabel}>Miles Traveled</Text>
          </View>
          <View style={styles.statItem}>
            <View style={styles.statIconContainer}>
              <Icon name="money" size={20} color="#FF6B35" />
            </View>
            <Text style={styles.statNumber}>₹2,450</Text>
            <Text style={styles.statLabel}>Total Spent</Text>
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
            <View style={styles.logoutButtonGlow} />
          </View>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  // Light Background
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
    position: 'relative',
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
  avatarGlow: {
    position: 'absolute',
    top: -5,
    left: -5,
    right: -5,
    bottom: -5,
    borderRadius: 45,
    backgroundColor: 'rgba(255, 107, 53, 0.2)',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 24,
    fontWeight: '800',
    color: '#333333',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    color: '#666666',
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
    color: '#666666',
    fontWeight: '500',
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    margin: 20,
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    shadowColor: '#FF6B35',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 8,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 107, 53, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FF6B35',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666666',
    textAlign: 'center',
    fontWeight: '500',
  },
  menuContainer: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    shadowColor: '#FF6B35',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  menuIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 107, 53, 0.1)',
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
    color: '#333333',
    marginBottom: 2,
  },
  menuSubtitle: {
    fontSize: 14,
    color: '#666666',
  },
  menuArrow: {
    marginLeft: 8,
  },
  logoutButton: {
    backgroundColor: '#FFFFFF',
    margin: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#FF6B35',
    shadowColor: '#FF6B35',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
    position: 'relative',
    overflow: 'hidden',
  },
  logoutButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    position: 'relative',
    zIndex: 2,
  },
  logoutIconContainer: {
    marginRight: 12,
  },
  logoutText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FF6B35',
    letterSpacing: 0.5,
  },
  logoutButtonGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 107, 53, 0.1)',
    borderRadius: 20,
  },
});

export default UserProfileScreen; 