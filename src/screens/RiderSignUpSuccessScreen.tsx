import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { CommonActions } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useAuth } from '../contexts/AuthContext';

interface RiderSignUpSuccessScreenProps {
  navigation: any;
}

const RiderSignUpSuccessScreen: React.FC<RiderSignUpSuccessScreenProps> = ({ navigation }) => {
  const { user, testSignIn, setUserRole } = useAuth();
  
  // Development mode flag
  const isDevelopment = __DEV__;

  const handleGoToHome = () => {
    // Navigate to RoleSelection screen (choose rider or user to book ride)
    navigation.reset({
      index: 0,
      routes: [{ name: 'RoleSelection' }],
    });
  };

  const handleViewProfile = () => {
    if (user) {
      // User is logged in - navigate to Main/Profile
      let rootNavigator = navigation;
      let parent = navigation.getParent();
      
      // Traverse up to find the root navigator
      while (parent) {
        rootNavigator = parent;
        parent = parent.getParent();
      }
      
      rootNavigator.navigate('Main', {
        screen: 'Profile',
      });
    } else {
      // User is not logged in - navigate to login
      navigation.navigate('Login');
    }
  };

  // Development bypass: Navigate to rider dashboard (as if verified)
  const handleDevGoToDashboard = async () => {
    if (!isDevelopment) return;
    
    // If user is not logged in, auto-login with test account as rider for development
    if (!user) {
      await testSignIn('rider');
      console.log('🚀 Development Mode: Auto-logged in test user as RIDER for dashboard access');
    } else {
      // If user is already logged in, set their role to rider
      await setUserRole('rider');
      console.log('🚀 Development Mode: Set user role to RIDER');
    }
    
    // Small delay to ensure auth state updates
    setTimeout(() => {
      // Navigate to RiderMain/Home (rider dashboard) via root navigator
      let rootNavigator = navigation;
      let parent = navigation.getParent();
      
      // Traverse up to find the root navigator (AppNavigator)
      while (parent) {
        rootNavigator = parent;
        parent = parent.getParent();
      }
      
      // Navigate to RiderMain/Home (rider dashboard)
      try {
        rootNavigator.navigate('RiderMain', {
          screen: 'RiderHome',
        });
      } catch (error) {
        console.log('Navigation error, AppNavigator will handle routing after auth state change');
        // If navigation fails, AppNavigator will automatically show RiderMain/Home after auth state updates
      }
    }, 100);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Success Icon */}
        <View style={styles.iconContainer}>
          <Icon name="check-circle" size={80} color="#4CAF50" />
        </View>

        {/* Success Message */}
        <Text style={styles.title}>Registration Successful!</Text>
        <Text style={styles.subtitle}>
          Your rider application has been submitted successfully. We'll review your details and get back to you within 24-48 hours.
        </Text>

        {/* Status Info */}
        <View style={styles.statusContainer}>
          <View style={styles.statusItem}>
            <Icon name="clock-o" size={20} color="#FF6B35" />
            <Text style={styles.statusText}>Under Review</Text>
          </View>
          <View style={styles.statusItem}>
            <Icon name="envelope" size={20} color="#FF6B35" />
            <Text style={styles.statusText}>Email Notification</Text>
          </View>
          <View style={styles.statusItem}>
            <Icon name="phone" size={20} color="#FF6B35" />
            <Text style={styles.statusText}>SMS Update</Text>
          </View>
        </View>

        {/* Next Steps */}
        <View style={styles.nextStepsContainer}>
          <Text style={styles.nextStepsTitle}>What's Next?</Text>
          <View style={styles.stepItem}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>1</Text>
            </View>
            <Text style={styles.stepText}>We'll verify your documents and vehicle details</Text>
          </View>
          <View style={styles.stepItem}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>2</Text>
            </View>
            <Text style={styles.stepText}>Background check and license verification</Text>
          </View>
          <View style={styles.stepItem}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>3</Text>
            </View>
            <Text style={styles.stepText}>You'll receive approval notification</Text>
          </View>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.primaryButton} onPress={handleGoToHome}>
          <Icon name="home" size={20} color="white" />
          <Text style={styles.primaryButtonText}>Go to Home</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.secondaryButton} onPress={handleViewProfile}>
          <Icon name="user" size={20} color="#FF6B35" />
          <Text style={styles.secondaryButtonText}>View Profile</Text>
        </TouchableOpacity>

        {/* Development Test Button - Only visible in dev mode */}
        {isDevelopment && (
          <TouchableOpacity style={styles.devButton} onPress={handleDevGoToDashboard}>
            <Icon name="check-circle" size={18} color="#4CAF50" />
            <Text style={styles.devButtonText}>🚀 DEV: Go to Dashboard (Verified)</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
    alignItems: 'center',
  },
  iconContainer: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  statusContainer: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 20,
    marginBottom: 32,
    width: '100%',
  },
  statusItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  statusText: {
    fontSize: 14,
    color: '#333',
    marginLeft: 12,
    fontWeight: '500',
  },
  nextStepsContainer: {
    width: '100%',
  },
  nextStepsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FF6B35',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  stepNumberText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: 'white',
  },
  stepText: {
    flex: 1,
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  buttonContainer: {
    padding: 24,
    gap: 12,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF6B35',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    marginLeft: 8,
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#FF6B35',
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF6B35',
    marginLeft: 8,
  },
  devButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E8F5E9',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#4CAF50',
    marginTop: 8,
  },
  devButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2E7D32',
    marginLeft: 8,
  },
});

export default RiderSignUpSuccessScreen;