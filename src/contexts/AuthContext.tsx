import React, { createContext, useContext, useEffect, useState } from 'react';

// Import Firebase initialization first
import '../config/firebaseInit';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { configureGoogleSignIn } from '../config/googleSignIn';

interface AuthContextType {
  user: FirebaseAuthTypes.User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  testSignIn: () => void;
  signInWithGoogle: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('AuthProvider: Initializing Firebase Auth...');
    console.log('Auth object:', auth);
    
    // Configure Google Sign-In
    configureGoogleSignIn();
    
    try {
      const unsubscribe = auth().onAuthStateChanged((user: FirebaseAuthTypes.User | null) => {
        console.log('Auth state changed:', user ? 'User logged in' : 'User logged out');
        setUser(user);
        setLoading(false);
      });

      return unsubscribe;
    } catch (error) {
      console.error('Error setting up auth listener:', error);
      setLoading(false);
    }
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      await auth().signInWithEmailAndPassword(email, password);
    } catch (error) {
      throw error;
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      await auth().createUserWithEmailAndPassword(email, password);
    } catch (error) {
      throw error;
    }
  };

  const signOut = async () => {
    try {
      // If it's a test user, just clear the state
      if (user?.uid === 'test-user-id') {
        setUser(null);
        setLoading(false);
        return;
      }
      // Otherwise, use Firebase signOut
      await auth().signOut();
    } catch (error) {
      throw error;
    }
  };

  const signInWithGoogle = async () => {
    try {
      // Check if your device supports Google Play
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      
      // Get the users ID token
      const { idToken } = await GoogleSignin.signIn();
      
      // Create a Google credential with the token
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);
      
      // Sign-in the user with the credential
      await auth().signInWithCredential(googleCredential);
    } catch (error) {
      console.error('Google Sign-In Error:', error);
      throw error;
    }
  };

  const testSignIn = () => {
    // Create a minimal mock user object for testing
    const testUser = {
      uid: 'test-user-id',
      email: 'test@example.com',
      displayName: 'Test User',
      emailVerified: true,
      isAnonymous: false,
      phoneNumber: null,
      photoURL: null,
      providerId: 'firebase',
      metadata: {
        creationTime: new Date().toISOString(),
        lastSignInTime: new Date().toISOString(),
      },
      providerData: [],
      refreshToken: 'test-refresh-token',
      tenantId: null,
      multiFactor: {
        enrolledFactors: [],
        session: null,
      },
      delete: () => Promise.resolve(),
      getIdToken: () => Promise.resolve('test-id-token'),
      getIdTokenResult: () => Promise.resolve({
        token: 'test-id-token',
        authTime: new Date().toISOString(),
        issuedAtTime: new Date().toISOString(),
        expirationTime: new Date(Date.now() + 3600000).toISOString(),
        signInProvider: 'password',
        signInSecondFactor: null,
        claims: {},
      }),
      linkWithCredential: () => Promise.resolve({} as any),
      linkWithPhoneNumber: () => Promise.resolve({} as any),
      linkWithPopup: () => Promise.resolve({} as any),
      linkWithRedirect: () => Promise.resolve({} as any),
      reauthenticateWithCredential: () => Promise.resolve({} as any),
      reauthenticateWithPhoneNumber: () => Promise.resolve({} as any),
      reauthenticateWithPopup: () => Promise.resolve({} as any),
      reauthenticateWithRedirect: () => Promise.resolve({} as any),
      reauthenticateWithProvider: () => Promise.resolve({} as any),
      reload: () => Promise.resolve(),
      sendEmailVerification: () => Promise.resolve(),
      toJSON: () => ({}),
      unlink: () => Promise.resolve({} as any),
      updateEmail: () => Promise.resolve(),
      updatePassword: () => Promise.resolve(),
      updatePhoneNumber: () => Promise.resolve(),
      updateProfile: () => Promise.resolve(),
      verifyBeforeUpdateEmail: () => Promise.resolve(),
    } as unknown as FirebaseAuthTypes.User;

    setUser(testUser);
    setLoading(false);
  };

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    testSignIn,
    signInWithGoogle,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
