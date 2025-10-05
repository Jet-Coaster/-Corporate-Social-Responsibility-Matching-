import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {Provider as PaperProvider} from 'react-native-paper';
import {StatusBar} from 'react-native';
import Toast from 'react-native-toast-message';

import {AuthProvider} from './src/contexts/AuthContext';
import AppNavigator from './src/navigation/AppNavigator';
import {theme} from './src/utils/theme';

const App = (): JSX.Element => {
  return (
    <PaperProvider theme={theme}>
      <AuthProvider>
        <NavigationContainer>
          <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
          <AppNavigator />
          <Toast />
        </NavigationContainer>
      </AuthProvider>
    </PaperProvider>
  );
};

export default App;
