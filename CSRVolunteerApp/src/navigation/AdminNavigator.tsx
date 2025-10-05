import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createStackNavigator} from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialIcons';

import AdminHomeScreen from '../screens/admin/AdminHomeScreen';
import CompaniesScreen from '../screens/admin/CompaniesScreen';
import CategoriesScreen from '../screens/admin/CategoriesScreen';
import ReportsScreen from '../screens/admin/ReportsScreen';
import AdminProfileScreen from '../screens/admin/AdminProfileScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const AdminHomeStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="AdminHome"
      component={AdminHomeScreen}
      options={{title: 'Dashboard'}}
    />
  </Stack.Navigator>
);

const AdminNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarIcon: ({focused, color, size}) => {
          let iconName: string;

          switch (route.name) {
            case 'Dashboard':
              iconName = 'dashboard';
              break;
            case 'Companies':
              iconName = 'business';
              break;
            case 'Categories':
              iconName = 'category';
              break;
            case 'Reports':
              iconName = 'assessment';
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
      <Tab.Screen name="Dashboard" component={AdminHomeStack} />
      <Tab.Screen name="Companies" component={CompaniesScreen} />
      <Tab.Screen name="Categories" component={CategoriesScreen} />
      <Tab.Screen name="Reports" component={ReportsScreen} />
      <Tab.Screen name="Profile" component={AdminProfileScreen} />
    </Tab.Navigator>
  );
};

export default AdminNavigator;



