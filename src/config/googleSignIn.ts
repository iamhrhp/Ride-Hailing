import { GoogleSignin } from '@react-native-google-signin/google-signin';

export const configureGoogleSignIn = () => {
  const webClientId = '327137806934-98fhkbb6vpseurgtfojr5q491256u7pp.apps.googleusercontent.com';
  
  GoogleSignin.configure({
    webClientId: webClientId,
    offlineAccess: true,
    hostedDomain: '',
    forceCodeForRefreshToken: true,
    accountName: '',
    iosClientId: 'YOUR_IOS_CLIENT_ID_HERE',
  });
};

export const checkGooglePlayServices = async () => {
  try {
    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
    return true;
  } catch (error) {
    console.error('Google Play Services not available:', error);
    return false;
  }
};

export const getCurrentGoogleUser = async () => {
  try {
    const userInfo = await GoogleSignin.signInSilently();
    return userInfo;
  } catch (error) {
    console.error('Error getting current Google user:', error);
    return null;
  }
};

export const signOutFromGoogle = async () => {
  try {
    await GoogleSignin.signOut();
    return true;
  } catch (error) {
    console.error('Error signing out from Google:', error);
    return false;
  }
};

