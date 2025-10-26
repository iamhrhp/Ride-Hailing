// Firebase initialization file
import { initializeApp } from '@react-native-firebase/app';

// Initialize Firebase App
try {
  initializeApp();
  console.log('Firebase App initialized successfully');
} catch (error) {
  console.error('Firebase App initialization error:', error);
}

export default initializeApp;
