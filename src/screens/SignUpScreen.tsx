import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useAuth } from '../contexts/AuthContext';

interface SignUpScreenProps {
  navigation: any;
}

const { width } = Dimensions.get('window');

const SignUpScreen: React.FC<SignUpScreenProps> = ({ navigation }) => {
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signUp, signInWithGoogle } = useAuth();

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string) => {
    return password.length >= 6;
  };

  const handleSignUp = async () => {
    if (!name || !mobile || !email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (!validateEmail(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    if (!validatePassword(password)) {
      Alert.alert('Error', 'Password must be at least 6 characters long');
      return;
    }

    setLoading(true);
    try {
      await signUp(email, password);
      Alert.alert('Success', 'Account created successfully!');
      // Navigation will be handled by AuthNavigator
    } catch (error: any) {
      Alert.alert('Sign Up Failed', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setLoading(true);
    try {
      await signInWithGoogle();
      Alert.alert('Success', 'Google sign up successful!');
    } catch (error: any) {
      Alert.alert('Google Sign Up Failed', error.message || 'Failed to sign up with Google');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Icon name="arrow-left" size={20} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Sign up</Text>
          <View style={styles.placeholder} />
        </View>

        {/* Illustration Banner */}
        <View style={styles.bannerContainer}>
          <View style={styles.banner}>
            <View style={styles.truckContainer}>
              <View style={styles.truck}>
                <View style={styles.truckBody} />
                <View style={styles.truckCab} />
                <View style={styles.truckWheels}>
                  <View style={styles.wheel} />
                  <View style={styles.wheel} />
                </View>
                <Text style={styles.truckText}>Truckola SHIPPING</Text>
              </View>
              <View style={styles.globeContainer}>
                <View style={styles.globe}>
                  <View style={styles.globeLines}>
                    <View style={styles.globeLine} />
                    <View style={styles.globeLine} />
                    <View style={styles.globeLine} />
                  </View>
                </View>
              </View>
              <View style={styles.character}>
                <View style={styles.characterBody} />
                <View style={styles.characterHead} />
                <View style={styles.package} />
                <View style={styles.clipboard} />
              </View>
              <View style={styles.boxes}>
                <View style={styles.box} />
                <View style={styles.box} />
                <View style={styles.box} />
              </View>
            </View>
          </View>
        </View>

        {/* Form Container */}
        <View style={styles.formContainer}>
          <View style={styles.inputContainer}>
            <View style={styles.inputWrapper}>
              <Icon name="user" size={20} color="#666" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Your Name"
                placeholderTextColor="#999"
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
              />
            </View>
          </View>

          <View style={styles.inputContainer}>
            <View style={styles.inputWrapper}>
              <Icon name="phone" size={20} color="#666" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Mobile Number"
                placeholderTextColor="#999"
                value={mobile}
                onChangeText={setMobile}
                keyboardType="phone-pad"
              />
            </View>
          </View>

          <View style={styles.inputContainer}>
            <View style={styles.inputWrapper}>
              <Icon name="envelope" size={20} color="#666" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Email ID"
                placeholderTextColor="#999"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
          </View>

          <View style={styles.inputContainer}>
            <View style={styles.inputWrapper}>
              <Icon name="lock" size={20} color="#666" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="#999"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoCapitalize="none"
              />
            </View>
          </View>

          <TouchableOpacity
            style={[styles.registerButton, loading && styles.buttonDisabled]}
            onPress={handleSignUp}
            disabled={loading}
          >
            <Text style={styles.registerButtonText}>
              {loading ? 'Creating Account...' : 'Register'}
            </Text>
          </TouchableOpacity>

          <Text style={styles.orText}>Or, register with</Text>

          <View style={styles.socialButtons}>
            <TouchableOpacity 
              style={[styles.socialButton, loading && styles.buttonDisabled]} 
              onPress={handleGoogleSignUp}
              disabled={loading}
            >
              <Icon name="google" size={24} color="#4285F4" />
              <Text style={styles.googleText}>
                {loading ? 'Signing Up...' : 'Google'}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.linkText}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E8F4FD',
  },
  scrollContainer: {
    flexGrow: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  placeholder: {
    width: 40,
  },
  bannerContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  banner: {
    backgroundColor: '#F5F5F5',
    borderRadius: 15,
    padding: 20,
    height: 120,
    justifyContent: 'center',
  },
  truckContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  truck: {
    position: 'relative',
  },
  truckBody: {
    width: 60,
    height: 25,
    backgroundColor: '#FFD700',
    borderRadius: 5,
  },
  truckCab: {
    position: 'absolute',
    top: -5,
    left: 45,
    width: 20,
    height: 20,
    backgroundColor: '#FFD700',
    borderRadius: 3,
  },
  truckWheels: {
    position: 'absolute',
    top: 20,
    left: 5,
    flexDirection: 'row',
  },
  wheel: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#333',
    marginRight: 15,
  },
  truckText: {
    position: 'absolute',
    top: 5,
    left: 5,
    fontSize: 8,
    fontWeight: 'bold',
    color: '#333',
  },
  globeContainer: {
    alignItems: 'center',
  },
  globe: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  globeLines: {
    position: 'absolute',
  },
  globeLine: {
    width: 30,
    height: 1,
    backgroundColor: '#999',
    marginVertical: 2,
  },
  character: {
    position: 'relative',
  },
  characterHead: {
    width: 15,
    height: 15,
    borderRadius: 7.5,
    backgroundColor: '#FFD700',
  },
  characterBody: {
    width: 20,
    height: 25,
    backgroundColor: '#FFD700',
    borderRadius: 3,
    marginTop: 5,
  },
  package: {
    position: 'absolute',
    top: 10,
    left: 25,
    width: 12,
    height: 12,
    backgroundColor: '#8B4513',
    borderRadius: 2,
  },
  clipboard: {
    position: 'absolute',
    top: 15,
    left: 30,
    width: 8,
    height: 10,
    backgroundColor: '#666',
    borderRadius: 1,
  },
  boxes: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  box: {
    width: 15,
    height: 15,
    backgroundColor: '#8B4513',
    borderRadius: 2,
    marginBottom: 3,
  },
  formContainer: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    padding: 30,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    backgroundColor: '#F9F9F9',
    paddingHorizontal: 15,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    paddingVertical: 15,
    fontSize: 16,
    color: '#333',
  },
  registerButton: {
    backgroundColor: '#1E3A8A',
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  registerButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  orText: {
    textAlign: 'center',
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
  },
  socialButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: 'white',
    marginHorizontal: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  googleText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4285F4',
    marginLeft: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  footerText: {
    fontSize: 14,
    color: '#666',
  },
  linkText: {
    fontSize: 14,
    color: '#1E3A8A',
    fontWeight: 'bold',
  },
});

export default SignUpScreen;
