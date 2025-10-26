import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import RoleSelectionScreen from '../screens/RoleSelectionScreen';
import LoginScreen from '../screens/LoginScreen';
import SignUpScreen from '../screens/SignUpScreen';
import RiderSignUpScreen from '../screens/RiderSignUpScreen';
import RiderSignUpSuccessScreen from '../screens/RiderSignUpSuccessScreen';

const Stack = createStackNavigator();

const AuthNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="RoleSelection" component={RoleSelectionScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="SignUp" component={SignUpScreen} />
      <Stack.Screen name="RiderSignUp" component={RiderSignUpScreen} />
      <Stack.Screen name="RiderSignUpSuccess" component={RiderSignUpSuccessScreen} />
    </Stack.Navigator>
  );
};

export default AuthNavigator;
