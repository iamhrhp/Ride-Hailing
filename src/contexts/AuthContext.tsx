import React, { createContext, useContext, useEffect, useState } from 'react';
import '../config/firebaseInit';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { configureGoogleSignIn } from '../config/googleSignIn';
import { setUserRole, getUserRole, clearUserRole, UserRole } from '../utils/userRole';

interface AuthContextType {
  user: FirebaseAuthTypes.User | null;
  loading: boolean;
  userRole: UserRole;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  testSignIn: (role?: 'passenger' | 'rider') => void;
  signInWithGoogle: () => Promise<void>;
  setUserRole: (role: UserRole) => Promise<void>;
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
  const [userRole, setUserRoleState] = useState<UserRole>(null);

  useEffect(() => {
    console.log('AuthProvider: Initializing Firebase Auth...');
    console.log('Auth object:', auth);
    configureGoogleSignIn();
    
    const loadUserRole = async () => {
      const role = await getUserRole();
      setUserRoleState(role);
    };
    
    try {
      const unsubscribe = auth().onAuthStateChanged(async (user: FirebaseAuthTypes.User | null) => {
        console.log('Auth state changed:', user ? 'User logged in' : 'User logged out');
        setUser(user);
        if (user) {
          await loadUserRole();
        } else {
          setUserRoleState(null);
        }
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
      await setUserRole('passenger');
      setUserRoleState('passenger');
    } catch (error) {
      throw error;
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      await auth().createUserWithEmailAndPassword(email, password);
      await setUserRole('passenger');
      setUserRoleState('passenger');
    } catch (error) {
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await clearUserRole();
      setUserRoleState(null);
      
      if (user?.uid === 'test-user-id') {
        setUser(null);
        setLoading(false);
        return;
      }
      await auth().signOut();
    } catch (error) {
      throw error;
    }
  };

  const signInWithGoogle = async () => {
    try {
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      await GoogleSignin.signIn();
      const { idToken } = await GoogleSignin.getTokens();
      if (!idToken) {
        throw new Error('No ID token received from Google Sign-In');
      }
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);
      await auth().signInWithCredential(googleCredential);
      await setUserRole('passenger');
      setUserRoleState('passenger');
    } catch (error: any) {
      console.error('Google Sign-In Error:', error);
      
      if (error?.message?.includes('DEVELOPER_ERROR')) {
        const helpfulError = new Error(
          'Google Sign-In Configuration Error (DEVELOPER_ERROR):\n\n' +
          'This usually means your Web Client ID is not configured correctly.\n\n' +
          'To fix:\n' +
          '1. Go to Firebase Console > Authentication > Sign-in method > Google\n' +
          '2. Copy the "Web client ID"\n' +
          '3. Open src/config/googleSignIn.ts\n' +
          '4. Replace YOUR_WEB_CLIENT_ID_HERE with your actual Web Client ID\n' +
          '5. Restart the app\n\n' +
          'For more help, see: https://react-native-google-signin.github.io/docs/troubleshooting'
        );
        throw helpfulError;
      }
      
      throw error;
    }
  };

  const testSignIn = async (role: 'passenger' | 'rider' = 'passenger') => {
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
    await setUserRole(role);
    setUserRoleState(role);
    setLoading(false);
  };

  const handleSetUserRole = async (role: UserRole) => {
    await setUserRole(role);
    setUserRoleState(role);
  };

  const value = {
    user,
    loading,
    userRole,
    signIn,
    signUp,
    signOut,
    testSignIn,
    signInWithGoogle,
    setUserRole: handleSetUserRole,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
