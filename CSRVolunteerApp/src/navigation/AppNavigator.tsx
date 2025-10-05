import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialIcons';

import {useAuth} from '../contexts/AuthContext';
import LoadingScreen from '../screens/LoadingScreen';
import AuthNavigator from './AuthNavigator';
import PINNavigator from './PINNavigator';
import CSRNavigator from './CSRNavigator';
import AdminNavigator from './AdminNavigator';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const AppNavigator: React.FC = () => {
  const {isAuthenticated, isLoading, user} = useAuth();

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    return <AuthNavigator />;
  }

  // Role-based navigation
  switch (user?.role) {
    case 'pin':
      return <PINNavigator />;
    case 'csr_rep':
      return <CSRNavigator />;
    case 'admin':
    case 'platform':
      return <AdminNavigator />;
    default:
      return <AuthNavigator />;
  }
};

export default AppNavigator;



