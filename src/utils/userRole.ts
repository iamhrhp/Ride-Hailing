import AsyncStorage from '@react-native-async-storage/async-storage';

const USER_ROLE_KEY = '@user_role';

export type UserRole = 'passenger' | 'rider' | null;

export const setUserRole = async (role: UserRole): Promise<void> => {
  if (role) {
    await AsyncStorage.setItem(USER_ROLE_KEY, role);
  } else {
    await AsyncStorage.removeItem(USER_ROLE_KEY);
  }
};

export const getUserRole = async (): Promise<UserRole> => {
  try {
    const role = await AsyncStorage.getItem(USER_ROLE_KEY);
    return (role as UserRole) || null;
  } catch (error) {
    console.error('Error getting user role:', error);
    return null;
  }
};

export const clearUserRole = async (): Promise<void> => {
  await AsyncStorage.removeItem(USER_ROLE_KEY);
};

