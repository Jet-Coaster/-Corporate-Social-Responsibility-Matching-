import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createStackNavigator} from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialIcons';

import CSRHomeScreen from '../screens/csr/CSRHomeScreen';
import SearchRequestsScreen from '../screens/csr/SearchRequestsScreen';
import ShortlistScreen from '../screens/csr/ShortlistScreen';
import MatchesScreen from '../screens/csr/MatchesScreen';
import CSRProfileScreen from '../screens/csr/CSRProfileScreen';
import RequestDetailScreen from '../screens/csr/RequestDetailScreen';
import MatchDetailScreen from '../screens/csr/MatchDetailScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const CSRHomeStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="CSRHome"
      component={CSRHomeScreen}
      options={{title: 'Home'}}
    />
  </Stack.Navigator>
);

const SearchRequestsStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="SearchRequests"
      component={SearchRequestsScreen}
      options={{title: 'Volunteer Opportunities'}}
    />
    <Stack.Screen
      name="RequestDetail"
      component={RequestDetailScreen}
      options={{title: 'Request Details'}}
    />
  </Stack.Navigator>
);

const ShortlistStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="Shortlist"
      component={ShortlistScreen}
      options={{title: 'My Shortlist'}}
    />
  </Stack.Navigator>
);

const MatchesStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="Matches"
      component={MatchesScreen}
      options={{title: 'My Matches'}}
    />
    <Stack.Screen
      name="MatchDetail"
      component={MatchDetailScreen}
      options={{title: 'Match Details'}}
    />
  </Stack.Navigator>
);

const CSRNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarIcon: ({focused, color, size}) => {
          let iconName: string;

          switch (route.name) {
            case 'Home':
              iconName = 'home';
              break;
            case 'Search':
              iconName = 'search';
              break;
            case 'Shortlist':
              iconName = 'favorite';
              break;
            case 'Matches':
              iconName = 'handshake';
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
      <Tab.Screen name="Home" component={CSRHomeStack} />
      <Tab.Screen name="Search" component={SearchRequestsStack} />
      <Tab.Screen name="Shortlist" component={ShortlistStack} />
      <Tab.Screen name="Matches" component={MatchesStack} />
      <Tab.Screen name="Profile" component={CSRProfileScreen} />
    </Tab.Navigator>
  );
};

export default CSRNavigator;



