import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createStackNavigator} from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialIcons';

import PINHomeScreen from '../screens/pin/PINHomeScreen';
import PINRequestsScreen from '../screens/pin/PINRequestsScreen';
import PINHistoryScreen from '../screens/pin/PINHistoryScreen';
import PINProfileScreen from '../screens/pin/PINProfileScreen';
import CreateRequestScreen from '../screens/pin/CreateRequestScreen';
import RequestDetailScreen from '../screens/pin/RequestDetailScreen';
import EditRequestScreen from '../screens/pin/EditRequestScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const PINHomeStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="PINHome"
      component={PINHomeScreen}
      options={{title: 'Home'}}
    />
    <Stack.Screen
      name="CreateRequest"
      component={CreateRequestScreen}
      options={{title: 'Create Request'}}
    />
  </Stack.Navigator>
);

const PINRequestsStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="PINRequests"
      component={PINRequestsScreen}
      options={{title: 'My Requests'}}
    />
    <Stack.Screen
      name="RequestDetail"
      component={RequestDetailScreen}
      options={{title: 'Request Details'}}
    />
    <Stack.Screen
      name="EditRequest"
      component={EditRequestScreen}
      options={{title: 'Edit Request'}}
    />
  </Stack.Navigator>
);

const PINNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarIcon: ({focused, color, size}) => {
          let iconName: string;

          switch (route.name) {
            case 'Home':
              iconName = 'home';
              break;
            case 'Requests':
              iconName = 'assignment';
              break;
            case 'History':
              iconName = 'history';
              break;
            case 'Profile':
              iconName = 'person';
              break;
            default:
              iconName = 'help';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#2196F3',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}>
      <Tab.Screen name="Home" component={PINHomeStack} />
      <Tab.Screen name="Requests" component={PINRequestsStack} />
      <Tab.Screen name="History" component={PINHistoryScreen} />
      <Tab.Screen name="Profile" component={PINProfileScreen} />
    </Tab.Navigator>
  );
};

export default PINNavigator;



