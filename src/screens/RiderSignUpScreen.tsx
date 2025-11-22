import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  SafeAreaView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Modal,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useAuth } from '../contexts/AuthContext';

interface RiderSignUpScreenProps {
  navigation: any;
}

const RiderSignUpScreen: React.FC<RiderSignUpScreenProps> = ({ navigation }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  
  // Development mode flag
  const isDevelopment = __DEV__;

  // Form data
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    age: '',
    gender: '',
    aadharNumber: '',
    city: '',
    pincode: '',
    phoneNumber: '',
    // Vehicle details
    vehicleType: '',
    vehicleModel: '',
    vehicleNumber: '',
    vehicleYear: '',
    licenseNumber: '',
    licenseExpiry: '',
    insuranceNumber: '',
    insuranceExpiry: '',
  });

  // Validation errors
  const [errors, setErrors] = useState({
    firstName: '',
    lastName: '',
    age: '',
    gender: '',
    aadharNumber: '',
    city: '',
    pincode: '',
    phoneNumber: '',
    vehicleType: '',
    vehicleModel: '',
    vehicleNumber: '',
    vehicleYear: '',
    licenseNumber: '',
    licenseExpiry: '',
    insuranceNumber: '',
    insuranceExpiry: '',
  });

  const genders = [
    { id: 'male', label: 'Male' },
    { id: 'female', label: 'Female' },
    { id: 'other', label: 'Other' },
  ];

  const steps = [
    { number: 1, title: 'Personal Info' },
    { number: 2, title: 'Vehicle Details' },
    { number: 3, title: 'Identity' },
    { number: 4, title: 'Location' },
    { number: 5, title: 'Verification' },
  ];

  const vehicleTypes = [
    { id: 'car', name: 'Car', icon: 'car', description: '4-wheeler vehicle' },
    { id: 'bike', name: 'Bike', icon: 'motorcycle', description: '2-wheeler motorcycle' },
    { id: 'scooter', name: 'Scooter', icon: 'motorcycle', description: '2-wheeler scooter' },
    { id: 'auto', name: 'Auto', icon: 'taxi', description: '3-wheeler auto rickshaw' },
  ];

  // Test user data for development bypass
  const testUserData = {
    firstName: 'Test',
    lastName: 'User',
    age: '25',
    gender: 'male',
    aadharNumber: '123456789012',
    city: 'Mumbai',
    pincode: '400001',
    phoneNumber: '9876543210',
    vehicleType: 'car',
    vehicleModel: 'Honda City',
    vehicleNumber: 'MH12AB1234',
    vehicleYear: '2020',
    licenseNumber: 'DL1234567890',
    licenseExpiry: '2025-12-31',
    insuranceNumber: 'INS12345678',
    insuranceExpiry: '2025-12-31',
  };

  // Development bypass: Auto-fill test data on mount
  useEffect(() => {
    if (isDevelopment) {
      setFormData(testUserData);
      console.log('🚀 Development Mode: Test user data auto-filled');
    }
  }, []);

  // Development bypass: Skip all steps and complete signup instantly
  const handleDevBypass = () => {
    if (!isDevelopment) return;
    
    Alert.alert(
      'Development Bypass',
      'Skip all steps and complete signup with test data?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Skip & Complete',
          onPress: () => {
            setFormData(testUserData);
            setLoading(true);
            // Simulate instant completion
            setTimeout(() => {
              setLoading(false);
              navigation.navigate('RiderSignUpSuccess');
            }, 500);
          },
        },
      ]
    );
  };

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateField = (field: string, value: string): string => {
    switch (field) {
      case 'firstName':
        if (!value.trim()) return 'First name is required';
        if (value.trim().length < 2) return 'First name must be at least 2 characters';
        if (!/^[a-zA-Z\s]+$/.test(value.trim())) return 'First name can only contain letters';
        return '';
      
      case 'lastName':
        if (!value.trim()) return 'Last name is required';
        if (value.trim().length < 2) return 'Last name must be at least 2 characters';
        if (!/^[a-zA-Z\s]+$/.test(value.trim())) return 'Last name can only contain letters';
        return '';
      
      case 'age':
        if (!value.trim()) return 'Age is required';
        const age = parseInt(value);
        if (isNaN(age)) return 'Please enter a valid age';
        if (age < 18) return 'You must be at least 18 years old';
        if (age > 65) return 'Age must be 65 or below';
        return '';
      
      case 'aadharNumber':
        if (!value.trim()) return 'Aadhar number is required';
        if (value.length !== 12) return 'Aadhar number must be 12 digits';
        if (!/^\d+$/.test(value)) return 'Aadhar number must contain only digits';
        return '';
      
      case 'city':
        if (!value.trim()) return 'City is required';
        if (value.trim().length < 2) return 'City name must be at least 2 characters';
        return '';
      
      case 'pincode':
        if (!value.trim()) return 'Pincode is required';
        if (value.length !== 6) return 'Pincode must be 6 digits';
        if (!/^\d+$/.test(value)) return 'Pincode must contain only digits';
        return '';
      
      case 'phoneNumber':
        if (!value.trim()) return 'Phone number is required';
        if (value.length !== 10) return 'Phone number must be 10 digits';
        if (!/^\d+$/.test(value)) return 'Phone number must contain only digits';
        return '';
      
      case 'vehicleType':
        if (!value) return 'Please select a vehicle type';
        return '';
      
      case 'vehicleModel':
        if (!value.trim()) return 'Vehicle model is required';
        if (value.trim().length < 2) return 'Vehicle model must be at least 2 characters';
        return '';
      
      case 'vehicleNumber':
        if (!value.trim()) return 'Vehicle number is required';
        if (value.trim().length < 4) return 'Vehicle number must be at least 4 characters';
        return '';
      
      case 'vehicleYear':
        if (!value.trim()) return 'Vehicle year is required';
        const year = parseInt(value);
        const currentYear = new Date().getFullYear();
        if (isNaN(year)) return 'Please enter a valid year';
        if (year < 2000) return 'Vehicle year must be 2000 or later';
        if (year > currentYear) return 'Vehicle year cannot be in the future';
        return '';
      
      case 'licenseNumber':
        if (!value.trim()) return 'License number is required';
        if (value.trim().length < 8) return 'License number must be at least 8 characters';
        return '';
      
      case 'licenseExpiry':
        if (!value.trim()) return 'License expiry date is required';
        const licenseDate = new Date(value);
        if (isNaN(licenseDate.getTime())) return 'Please enter a valid date';
        if (licenseDate <= new Date()) return 'License must not be expired';
        return '';
      
      case 'insuranceNumber':
        if (!value.trim()) return 'Insurance number is required';
        if (value.trim().length < 8) return 'Insurance number must be at least 8 characters';
        return '';
      
      case 'insuranceExpiry':
        if (!value.trim()) return 'Insurance expiry date is required';
        const insuranceDate = new Date(value);
        if (isNaN(insuranceDate.getTime())) return 'Please enter a valid date';
        if (insuranceDate <= new Date()) return 'Insurance must not be expired';
        return '';
      
      default:
        return '';
    }
  };

  const validateFieldOnBlur = (field: string) => {
    const value = formData[field as keyof typeof formData];
    const error = validateField(field, value);
    setErrors(prev => ({ ...prev, [field]: error }));
  };

  const validateStep1 = () => {
    const fields = ['firstName', 'lastName', 'age', 'gender'];
    let hasErrors = false;
    
    fields.forEach(field => {
      const error = validateField(field, formData[field as keyof typeof formData]);
      if (error) {
        setErrors(prev => ({ ...prev, [field]: error }));
        hasErrors = true;
      }
    });
    
    if (hasErrors) {
      Alert.alert('Validation Error', 'Please fix the highlighted errors before proceeding');
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    const fields = ['vehicleType', 'vehicleModel', 'vehicleNumber', 'vehicleYear', 'licenseNumber', 'licenseExpiry', 'insuranceNumber', 'insuranceExpiry'];
    let hasErrors = false;
    
    fields.forEach(field => {
      const error = validateField(field, formData[field as keyof typeof formData]);
      if (error) {
        setErrors(prev => ({ ...prev, [field]: error }));
        hasErrors = true;
      }
    });
    
    if (hasErrors) {
      Alert.alert('Validation Error', 'Please fix the highlighted errors before proceeding');
      return false;
    }
    return true;
  };

  const validateStep3 = () => {
    const error = validateField('aadharNumber', formData.aadharNumber);
    if (error) {
      setErrors(prev => ({ ...prev, aadharNumber: error }));
      Alert.alert('Validation Error', error);
      return false;
    }
    return true;
  };

  const validateStep4 = () => {
    const fields = ['city', 'pincode'];
    let hasErrors = false;
    
    fields.forEach(field => {
      const error = validateField(field, formData[field as keyof typeof formData]);
      if (error) {
        setErrors(prev => ({ ...prev, [field]: error }));
        hasErrors = true;
      }
    });
    
    if (hasErrors) {
      Alert.alert('Validation Error', 'Please fix the highlighted errors before proceeding');
      return false;
    }
    return true;
  };

  const handleNext = () => {
    // Development bypass: Skip validation in dev mode
    if (isDevelopment) {
      if (currentStep < 5) {
        setCurrentStep(currentStep + 1);
      }
      return;
    }
    
    if (currentStep === 1 && validateStep1()) {
      setCurrentStep(2);
    } else if (currentStep === 2 && validateStep2()) {
      setCurrentStep(3);
    } else if (currentStep === 3 && validateStep3()) {
      setCurrentStep(4);
    } else if (currentStep === 4 && validateStep4()) {
      setCurrentStep(5);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSendOTP = () => {
    // Development bypass: Auto-verify in dev mode
    if (isDevelopment) {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        setOtpSent(true);
        setShowOTPModal(true);
        setOtp('123456'); // Pre-fill OTP in dev mode
        Alert.alert('Success', 'OTP sent to your phone number (Dev Mode: Use any OTP)');
      }, 500);
      return;
    }
    
    if (!formData.phoneNumber.trim()) {
      Alert.alert('Error', 'Please enter your phone number');
      return;
    }
    if (formData.phoneNumber.length !== 10 || !/^\d+$/.test(formData.phoneNumber)) {
      Alert.alert('Error', 'Please enter a valid 10-digit phone number');
      return;
    }
    
    setLoading(true);
    // Simulate OTP sending
    setTimeout(() => {
      setLoading(false);
      setOtpSent(true);
      setShowOTPModal(true);
      Alert.alert('Success', 'OTP sent to your phone number');
    }, 2000);
  };

  const handleVerifyOTP = () => {
    // Development bypass: Accept any OTP in dev mode
    if (isDevelopment && otp.length > 0) {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        setShowOTPModal(false);
        Alert.alert('Success', 'Phone number verified successfully! (Dev Mode)');
        navigation.navigate('RiderSignUpSuccess');
      }, 500);
      return;
    }
    
    if (otp.length !== 6) {
      Alert.alert('Error', 'Please enter a valid 6-digit OTP');
      return;
    }
    
    setLoading(true);
    // Simulate OTP verification
    setTimeout(() => {
      setLoading(false);
      setShowOTPModal(false);
      Alert.alert('Success', 'Phone number verified successfully!');
      // Navigate to success screen
      navigation.navigate('RiderSignUpSuccess');
    }, 2000);
  };

  const handleSubmit = () => {
    if (!formData.phoneNumber.trim()) {
      Alert.alert('Error', 'Please enter your phone number');
      return;
    }
    handleSendOTP();
  };

  const renderStep1 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Personal Information</Text>
      <Text style={styles.stepSubtitle}>Tell us about yourself</Text>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>First Name *</Text>
        <TextInput
          style={[styles.input, errors.firstName ? styles.inputError : null]}
          placeholder="Enter your first name"
          placeholderTextColor="#999"
          value={formData.firstName}
          onChangeText={(value) => updateFormData('firstName', value)}
          onBlur={() => validateFieldOnBlur('firstName')}
        />
        {errors.firstName ? <Text style={styles.errorText}>{errors.firstName}</Text> : null}
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Last Name *</Text>
        <TextInput
          style={[styles.input, errors.lastName ? styles.inputError : null]}
          placeholder="Enter your last name"
          placeholderTextColor="#999"
          value={formData.lastName}
          onChangeText={(value) => updateFormData('lastName', value)}
          onBlur={() => validateFieldOnBlur('lastName')}
        />
        {errors.lastName ? <Text style={styles.errorText}>{errors.lastName}</Text> : null}
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Age *</Text>
        <TextInput
          style={[styles.input, errors.age ? styles.inputError : null]}
          placeholder="Enter your age"
          placeholderTextColor="#999"
          value={formData.age}
          onChangeText={(value) => updateFormData('age', value)}
          onBlur={() => validateFieldOnBlur('age')}
          keyboardType="numeric"
        />
        {errors.age ? <Text style={styles.errorText}>{errors.age}</Text> : null}
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Gender *</Text>
        <View style={styles.genderContainer}>
          {genders.map((gender) => (
            <TouchableOpacity
              key={gender.id}
              style={[
                styles.genderOption,
                formData.gender === gender.id && styles.genderOptionSelected,
              ]}
              onPress={() => updateFormData('gender', gender.id)}
            >
              <Text
                style={[
                  styles.genderText,
                  formData.gender === gender.id && styles.genderTextSelected,
                ]}
              >
                {gender.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        {errors.gender ? <Text style={styles.errorText}>{errors.gender}</Text> : null}
      </View>
    </View>
  );

  const renderStep2 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Vehicle Details</Text>
      <Text style={styles.stepSubtitle}>Tell us about your vehicle</Text>

      {/* Vehicle Type Selection */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Vehicle Type *</Text>
        <View style={styles.vehicleTypeContainer}>
          {vehicleTypes.map((vehicle) => (
            <TouchableOpacity
              key={vehicle.id}
              style={[
                styles.vehicleTypeOption,
                formData.vehicleType === vehicle.id && styles.vehicleTypeOptionSelected,
              ]}
              onPress={() => updateFormData('vehicleType', vehicle.id)}
            >
              <Icon 
                name={vehicle.icon} 
                size={24} 
                color={formData.vehicleType === vehicle.id ? 'white' : '#666'} 
              />
              <Text
                style={[
                  styles.vehicleTypeName,
                  formData.vehicleType === vehicle.id && styles.vehicleTypeNameSelected,
                ]}
              >
                {vehicle.name}
              </Text>
              <Text
                style={[
                  styles.vehicleTypeDescription,
                  formData.vehicleType === vehicle.id && styles.vehicleTypeDescriptionSelected,
                ]}
              >
                {vehicle.description}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        {errors.vehicleType ? <Text style={styles.errorText}>{errors.vehicleType}</Text> : null}
      </View>

      {/* Vehicle Model */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Vehicle Model *</Text>
        <TextInput
          style={[styles.input, errors.vehicleModel ? styles.inputError : null]}
          placeholder="e.g., Honda City, Bajaj Pulsar"
          placeholderTextColor="#999"
          value={formData.vehicleModel}
          onChangeText={(value) => updateFormData('vehicleModel', value)}
          onBlur={() => validateFieldOnBlur('vehicleModel')}
        />
        {errors.vehicleModel ? <Text style={styles.errorText}>{errors.vehicleModel}</Text> : null}
      </View>

      {/* Vehicle Number */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Vehicle Number *</Text>
        <TextInput
          style={[styles.input, errors.vehicleNumber ? styles.inputError : null]}
          placeholder="e.g., MH12AB1234"
          placeholderTextColor="#999"
          value={formData.vehicleNumber}
          onChangeText={(value) => updateFormData('vehicleNumber', value.toUpperCase())}
          onBlur={() => validateFieldOnBlur('vehicleNumber')}
          autoCapitalize="characters"
        />
        {errors.vehicleNumber ? <Text style={styles.errorText}>{errors.vehicleNumber}</Text> : null}
      </View>

      {/* Vehicle Year */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Vehicle Year *</Text>
        <TextInput
          style={[styles.input, errors.vehicleYear ? styles.inputError : null]}
          placeholder="e.g., 2020"
          value={formData.vehicleYear}
          onChangeText={(value) => updateFormData('vehicleYear', value)}
          onBlur={() => validateFieldOnBlur('vehicleYear')}
          keyboardType="numeric"
          maxLength={4}
        />
        {errors.vehicleYear ? <Text style={styles.errorText}>{errors.vehicleYear}</Text> : null}
      </View>

      {/* License Details */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>License Details</Text>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>License Number *</Text>
        <TextInput
          style={[styles.input, errors.licenseNumber ? styles.inputError : null]}
          placeholder="Enter your driving license number"
          value={formData.licenseNumber}
          onChangeText={(value) => updateFormData('licenseNumber', value.toUpperCase())}
          onBlur={() => validateFieldOnBlur('licenseNumber')}
          autoCapitalize="characters"
        />
        {errors.licenseNumber ? <Text style={styles.errorText}>{errors.licenseNumber}</Text> : null}
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>License Expiry Date *</Text>
        <TextInput
          style={[styles.input, errors.licenseExpiry ? styles.inputError : null]}
          placeholder="YYYY-MM-DD"
          value={formData.licenseExpiry}
          onChangeText={(value) => updateFormData('licenseExpiry', value)}
          onBlur={() => validateFieldOnBlur('licenseExpiry')}
        />
        {errors.licenseExpiry ? <Text style={styles.errorText}>{errors.licenseExpiry}</Text> : null}
      </View>

      {/* Insurance Details */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Insurance Details</Text>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Insurance Number *</Text>
        <TextInput
          style={[styles.input, errors.insuranceNumber ? styles.inputError : null]}
          placeholder="Enter your vehicle insurance number"
          value={formData.insuranceNumber}
          onChangeText={(value) => updateFormData('insuranceNumber', value.toUpperCase())}
          onBlur={() => validateFieldOnBlur('insuranceNumber')}
          autoCapitalize="characters"
        />
        {errors.insuranceNumber ? <Text style={styles.errorText}>{errors.insuranceNumber}</Text> : null}
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Insurance Expiry Date *</Text>
        <TextInput
          style={[styles.input, errors.insuranceExpiry ? styles.inputError : null]}
          placeholder="YYYY-MM-DD"
          value={formData.insuranceExpiry}
          onChangeText={(value) => updateFormData('insuranceExpiry', value)}
          onBlur={() => validateFieldOnBlur('insuranceExpiry')}
        />
        {errors.insuranceExpiry ? <Text style={styles.errorText}>{errors.insuranceExpiry}</Text> : null}
      </View>

      <View style={styles.infoBox}>
        <Icon name="info-circle" size={20} color="#2196F3" />
        <Text style={styles.infoText}>
          All vehicle and license details will be verified before approval. Please ensure all information is accurate.
        </Text>
      </View>
    </View>
  );

  const renderStep3 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Identity Verification</Text>
      <Text style={styles.stepSubtitle}>We need your Aadhar details for verification</Text>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Aadhar Number *</Text>
        <TextInput
          style={[styles.input, errors.aadharNumber ? styles.inputError : null]}
          placeholder="Enter 12-digit Aadhar number"
          value={formData.aadharNumber}
          onChangeText={(value) => updateFormData('aadharNumber', value)}
          onBlur={() => validateFieldOnBlur('aadharNumber')}
          keyboardType="numeric"
          maxLength={12}
        />
        {errors.aadharNumber ? <Text style={styles.errorText}>{errors.aadharNumber}</Text> : null}
        <Text style={styles.helperText}>
          Your Aadhar details will be verified for driver registration
        </Text>
      </View>

      <View style={styles.infoBox}>
        <Icon name="info-circle" size={20} color="#2196F3" />
        <Text style={styles.infoText}>
          We use your Aadhar details only for verification purposes and maintain strict privacy standards.
        </Text>
      </View>
    </View>
  );

  const renderStep4 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Location Details</Text>
      <Text style={styles.stepSubtitle}>Where will you be operating from?</Text>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>City *</Text>
        <TextInput
          style={[styles.input, errors.city ? styles.inputError : null]}
          placeholder="Enter your city"
          value={formData.city}
          onChangeText={(value) => updateFormData('city', value)}
          onBlur={() => validateFieldOnBlur('city')}
        />
        {errors.city ? <Text style={styles.errorText}>{errors.city}</Text> : null}
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Pincode *</Text>
        <TextInput
          style={[styles.input, errors.pincode ? styles.inputError : null]}
          placeholder="Enter 6-digit pincode"
          value={formData.pincode}
          onChangeText={(value) => updateFormData('pincode', value)}
          onBlur={() => validateFieldOnBlur('pincode')}
          keyboardType="numeric"
          maxLength={6}
        />
        {errors.pincode ? <Text style={styles.errorText}>{errors.pincode}</Text> : null}
      </View>

      <View style={styles.infoBox}>
        <Icon name="map-marker" size={20} color="#4CAF50" />
        <Text style={styles.infoText}>
          This helps us assign you to the right service area and connect you with nearby passengers.
        </Text>
      </View>
    </View>
  );

  const renderStep5 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Phone Verification</Text>
      <Text style={styles.stepSubtitle}>Verify your phone number to complete registration</Text>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Phone Number *</Text>
        <View style={styles.phoneInputContainer}>
          <Text style={styles.countryCode}>+91</Text>
          <TextInput
            style={[styles.phoneInput, errors.phoneNumber ? styles.inputError : null]}
            placeholder="Enter 10-digit phone number"
            placeholderTextColor="#999"
            value={formData.phoneNumber}
            onChangeText={(value) => updateFormData('phoneNumber', value)}
            onBlur={() => validateFieldOnBlur('phoneNumber')}
            keyboardType="numeric"
            maxLength={10}
          />
        </View>
        {errors.phoneNumber ? <Text style={styles.errorText}>{errors.phoneNumber}</Text> : null}
      </View>

      <View style={styles.infoBox}>
        <Icon name="phone" size={20} color="#FF6B35" />
        <Text style={styles.infoText}>
          We'll send you an OTP to verify your phone number. This is required for driver verification.
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={20} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Become a Rider</Text>
        {isDevelopment ? (
          <TouchableOpacity style={styles.devBypassButton} onPress={handleDevBypass}>
            <Icon name="rocket" size={16} color="#FF6B35" />
            <Text style={styles.devBypassText}>DEV</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.placeholder} />
        )}
      </View>

      {/* Progress Steps */}
      <View style={styles.progressContainer}>
        {steps.map((step) => (
          <View key={step.number} style={styles.stepIndicator}>
            <View
              style={[
                styles.stepNumber,
                currentStep >= step.number && styles.stepNumberActive,
              ]}
            >
              <Text
                style={[
                  styles.stepNumberText,
                  currentStep >= step.number && styles.stepNumberTextActive,
                ]}
              >
                {step.number}
              </Text>
            </View>
            <Text
              style={[
                styles.stepLabel,
                currentStep >= step.number && styles.stepLabelActive,
              ]}
            >
              {step.title}
            </Text>
          </View>
        ))}
      </View>

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep2()}
        {currentStep === 3 && renderStep3()}
        {currentStep === 4 && renderStep4()}
        {currentStep === 5 && renderStep5()}
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <View style={styles.buttonContainer}>
          {currentStep > 1 && (
            <TouchableOpacity style={styles.previousButton} onPress={handlePrevious}>
              <Icon name="arrow-left" size={16} color="#666" />
              <Text style={styles.previousButtonText}>Previous</Text>
            </TouchableOpacity>
          )}
          
          <TouchableOpacity
            style={[styles.nextButton, currentStep === 1 && styles.nextButtonFull]}
            onPress={currentStep === 5 ? handleSubmit : handleNext}
            disabled={loading}
          >
            <Text style={styles.nextButtonText}>
              {loading ? 'Processing...' : currentStep === 5 ? 'Send OTP' : 'Next'}
            </Text>
            {currentStep < 5 && <Icon name="arrow-right" size={16} color="white" />}
          </TouchableOpacity>
        </View>
      </View>

      {/* OTP Modal */}
      <Modal visible={showOTPModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Icon name="mobile" size={40} color="#FF6B35" />
              <Text style={styles.modalTitle}>Verify Phone Number</Text>
              <Text style={styles.modalSubtitle}>
                Enter the 6-digit OTP sent to +91 {formData.phoneNumber}
              </Text>
            </View>

            <View style={styles.otpContainer}>
              <TextInput
                style={styles.otpInput}
                placeholder="000000"
                placeholderTextColor="#999"
                value={otp}
                onChangeText={setOtp}
                keyboardType="numeric"
                maxLength={6}
                textAlign="center"
              />
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.resendButton}
                onPress={() => {
                  setOtpSent(false);
                  handleSendOTP();
                }}
              >
                <Text style={styles.resendButtonText}>Resend OTP</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.verifyButton}
                onPress={handleVerifyOTP}
                disabled={loading}
              >
                <Text style={styles.verifyButtonText}>
                  {loading ? 'Verifying...' : 'Verify OTP'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  placeholder: {
    width: 40,
  },
  devBypassButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#FFF5F0',
    borderWidth: 1,
    borderColor: '#FF6B35',
  },
  devBypassText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FF6B35',
    marginLeft: 4,
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: '#F8F9FA',
  },
  stepIndicator: {
    alignItems: 'center',
    flex: 1,
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  stepNumberActive: {
    backgroundColor: '#FF6B35',
  },
  stepNumberText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#999',
  },
  stepNumberTextActive: {
    color: 'white',
  },
  stepLabel: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
  },
  stepLabelActive: {
    color: '#FF6B35',
    fontWeight: '600',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  stepContainer: {
    paddingVertical: 20,
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  stepSubtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    backgroundColor: '#F9F9F9',
  },
  genderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  genderOption: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    alignItems: 'center',
    marginHorizontal: 4,
  },
  genderOptionSelected: {
    backgroundColor: '#FF6B35',
    borderColor: '#FF6B35',
  },
  genderText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  genderTextSelected: {
    color: 'white',
  },
  helperText: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#F0F8FF',
    padding: 16,
    borderRadius: 12,
    marginTop: 20,
  },
  infoText: {
    fontSize: 14,
    color: '#333',
    marginLeft: 12,
    flex: 1,
    lineHeight: 20,
  },
  phoneInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    backgroundColor: '#F9F9F9',
  },
  countryCode: {
    fontSize: 16,
    color: '#333',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRightWidth: 1,
    borderRightColor: '#E0E0E0',
  },
  phoneInput: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  previousButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  previousButtonText: {
    fontSize: 16,
    color: '#666',
    marginLeft: 8,
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF6B35',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 12,
    flex: 1,
    justifyContent: 'center',
  },
  nextButtonFull: {
    marginLeft: 0,
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    marginRight: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 24,
    width: '90%',
    maxWidth: 400,
  },
  modalHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 12,
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  otpContainer: {
    marginBottom: 24,
  },
  otpInput: {
    borderWidth: 2,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    paddingVertical: 16,
    fontSize: 24,
    letterSpacing: 8,
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  resendButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  resendButtonText: {
    fontSize: 16,
    color: '#FF6B35',
    fontWeight: '600',
  },
  verifyButton: {
    backgroundColor: '#FF6B35',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  verifyButtonText: {
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold',
  },
  // Error styles
  inputError: {
    borderColor: '#FF4444',
    backgroundColor: '#FFF5F5',
  },
  errorText: {
    fontSize: 12,
    color: '#FF4444',
    marginTop: 4,
    marginLeft: 4,
  },
  // Vehicle type styles
  vehicleTypeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  vehicleTypeOption: {
    width: '48%',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    backgroundColor: '#F9F9F9',
    alignItems: 'center',
    marginBottom: 12,
  },
  vehicleTypeOptionSelected: {
    borderColor: '#FF6B35',
    backgroundColor: '#FF6B35',
  },
  vehicleTypeName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginTop: 8,
    marginBottom: 4,
  },
  vehicleTypeNameSelected: {
    color: 'white',
  },
  vehicleTypeDescription: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  vehicleTypeDescriptionSelected: {
    color: 'rgba(255, 255, 255, 0.8)',
  },
  // Section header styles
  sectionHeader: {
    marginTop: 24,
    marginBottom: 16,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
});

export default RiderSignUpScreen;

