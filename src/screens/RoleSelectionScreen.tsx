import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

interface RoleSelectionScreenProps {
  navigation: any;
}

const { width, height } = Dimensions.get('window');

const RoleSelectionScreen: React.FC<RoleSelectionScreenProps> = ({ navigation }) => {
  const handleGetRide = () => {
    navigation.navigate('Login');
  };

  const handleBecomeRider = () => {
    navigation.navigate('RiderSignUp');
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Icon name="car" size={40} color="#FF6B35" />
          <Text style={styles.logoText}>GaadiSathi</Text>
        </View>
        <Text style={styles.tagline}>Your Journey, Our Priority</Text>
      </View>

      {/* Main Content */}
      <View style={styles.content}>
        <Text style={styles.title}>Choose Your Role</Text>
        <Text style={styles.subtitle}>How would you like to use our platform?</Text>

        {/* Role Selection Buttons */}
        <View style={styles.buttonsContainer}>
          {/* Get a Ride Button */}
          <TouchableOpacity style={styles.roleButton} onPress={handleGetRide}>
            <View style={styles.buttonIconContainer}>
              <Icon name="user" size={24} color="#FF6B35" />
            </View>
            <View style={styles.buttonContent}>
              <Text style={styles.buttonTitle}>Get a Ride</Text>
              <Text style={styles.buttonDescription}>Book rides quickly and safely</Text>
            </View>
            <Icon name="arrow-right" size={16} color="#FF6B35" />
          </TouchableOpacity>

          {/* Become a Rider Button */}
          <TouchableOpacity style={styles.roleButton} onPress={handleBecomeRider}>
            <View style={styles.buttonIconContainer}>
              <Icon name="motorcycle" size={24} color="#FF6B35" />
            </View>
            <View style={styles.buttonContent}>
              <Text style={styles.buttonTitle}>Become a Rider</Text>
              <Text style={styles.buttonDescription}>Earn money by driving</Text>
            </View>
            <Icon name="arrow-right" size={16} color="#FF6B35" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          By continuing, you agree to our Terms of Service and Privacy Policy
        </Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    alignItems: 'center',
    paddingTop: 40,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  logoText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FF6B35',
    marginLeft: 12,
  },
  tagline: {
    fontSize: 16,
    color: '#666',
    fontStyle: 'italic',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 40,
  },
  buttonsContainer: {
    gap: 16,
  },
  roleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  buttonIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 107, 53, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  buttonContent: {
    flex: 1,
  },
  buttonTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  buttonDescription: {
    fontSize: 14,
    color: '#666',
  },
  footer: {
    padding: 20,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    lineHeight: 18,
  },
});

export default RoleSelectionScreen;
