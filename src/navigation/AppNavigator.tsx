import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/FontAwesome';

import { useAuth } from '../contexts/AuthContext';
import UserHomeScreen from '../screens/UserHomeScreen';
import UserRidesScreen from '../screens/UserRidesScreen';
import UserProfileScreen from '../screens/UserProfileScreen';
import RiderHomeScreen from '../screens/RiderHomeScreen';
import RiderRidesScreen from '../screens/RiderRidesScreen';
import RiderProfileScreen from '../screens/RiderProfileScreen';
import AuthNavigator from './AuthNavigator';
import LoadingScreen from '../components/LoadingScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const getTabBarIcon = (routeName: string, color: string, size: number) => {
  let iconName: string;

  if (routeName === 'Home' || routeName === 'RiderHome') {
    iconName = 'home';
  } else if (routeName === 'Rides' || routeName === 'RiderRides') {
    iconName = 'car';
  } else if (routeName === 'Profile' || routeName === 'RiderProfile') {
    iconName = 'user';
  } else {
    iconName = 'question';
  }

  return <Icon name={iconName} size={size} color={color} />;
};

const MainTabNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused: _focused, color, size }) =>
          getTabBarIcon(route.name, color, size),
        tabBarActiveTintColor: '#FF6B35',
        tabBarInactiveTintColor: '#666',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#E0E0E0',
          height: 80,
          paddingBottom: 20,
          paddingTop: 10,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
          marginTop: 4,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={UserHomeScreen}
        options={{ title: 'Home' }}
      />
      <Tab.Screen 
        name="Rides" 
        component={UserRidesScreen}
        options={{ title: 'My Rides' }}
      />
      <Tab.Screen 
        name="Profile" 
        component={UserProfileScreen}
        options={{ title: 'Profile' }}
      />
    </Tab.Navigator>
  );
};

const RiderTabNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused: _focused, color, size }) =>
          getTabBarIcon(route.name, color, size),
        tabBarActiveTintColor: '#FF6B35',
        tabBarInactiveTintColor: '#666',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#E0E0E0',
          height: 80,
          paddingBottom: 20,
          paddingTop: 10,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
          marginTop: 4,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen 
        name="RiderHome" 
        component={RiderHomeScreen}
        options={{ title: 'Home' }}
      />
      <Tab.Screen 
        name="RiderRides" 
        component={RiderRidesScreen}
        options={{ title: 'My Rides' }}
      />
      <Tab.Screen 
        name="RiderProfile" 
        component={RiderProfileScreen}
        options={{ title: 'Profile' }}
      />
    </Tab.Navigator>
  );
};

const AppNavigator: React.FC = () => {
  const { user, loading, userRole } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  // Determine if user is a rider based on their role
  const isRider = userRole === 'rider';

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          isRider ? (
            <Stack.Screen name="RiderMain" component={RiderTabNavigator} />
          ) : (
            <Stack.Screen name="Main" component={MainTabNavigator} />
          )
        ) : (
          <Stack.Screen name="Auth" component={AuthNavigator} initialParams={{ initialRoute: 'RoleSelection' }} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator; 