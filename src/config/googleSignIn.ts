// Google Sign-In Configuration
// This file contains the configuration for Google Sign-In

import { GoogleSignin } from '@react-native-google-signin/google-signin';

// Configure Google Sign-In
export const configureGoogleSignIn = () => {
  GoogleSignin.configure({
    // Replace this with your actual Web Client ID from Google Cloud Console
    // You can find this in: Google Cloud Console > APIs & Services > Credentials
    // Format: XXXXXXXXXX-XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX.apps.googleusercontent.com
    webClientId: 'YOUR_WEB_CLIENT_ID_HERE', // Get this from Google Cloud Console
    
    // Optional: Set offline access to true
    offlineAccess: true,
    
    // Optional: Set hosted domain (for G Suite accounts)
    hostedDomain: '',
    
    // Optional: Force code for refresh token
    forceCodeForRefreshToken: true,
    
    // Optional: Account name for account selection
    accountName: '',
    
    // Optional: iOS specific configuration
    iosClientId: 'YOUR_IOS_CLIENT_ID_HERE', // Optional, only if you have iOS app
  });
};

// Helper function to check if Google Play Services are available
export const checkGooglePlayServices = async () => {
  try {
    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
    return true;
  } catch (error) {
    console.error('Google Play Services not available:', error);
    return false;
  }
};

// Helper function to get current user
export const getCurrentGoogleUser = async () => {
  try {
    const userInfo = await GoogleSignin.signInSilently();
    return userInfo;
  } catch (error) {
    console.error('Error getting current Google user:', error);
    return null;
  }
};

// Helper function to sign out from Google
export const signOutFromGoogle = async () => {
  try {
    await GoogleSignin.signOut();
    return true;
  } catch (error) {
    console.error('Error signing out from Google:', error);
    return false;
  }
};

