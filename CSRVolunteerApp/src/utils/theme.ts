import {DefaultTheme} from 'react-native-paper';

export const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#2196F3',
    accent: '#FF4081',
    background: '#F5F5F5',
    surface: '#FFFFFF',
    text: '#212121',
    placeholder: '#757575',
    backdrop: 'rgba(0, 0, 0, 0.5)',
    onSurface: '#000000',
    disabled: '#BDBDBD',
    error: '#F44336',
    success: '#4CAF50',
    warning: '#FF9800',
  },
  roundness: 8,
  fonts: {
    ...DefaultTheme.fonts,
    regular: {
      fontFamily: 'System',
      fontWeight: '400' as const,
    },
    medium: {
      fontFamily: 'System',
      fontWeight: '500' as const,
    },
    light: {
      fontFamily: 'System',
      fontWeight: '300' as const,
    },
    thin: {
      fontFamily: 'System',
      fontWeight: '100' as const,
    },
  },
};

export const colors = {
  primary: '#2196F3',
  secondary: '#FF4081',
  background: '#F5F5F5',
  surface: '#FFFFFF',
  text: '#212121',
  placeholder: '#757575',
  disabled: '#BDBDBD',
  error: '#F44336',
  success: '#4CAF50',
  warning: '#FF9800',
  info: '#2196F3',
  light: '#F8F9FA',
  dark: '#343A40',
  white: '#FFFFFF',
  black: '#000000',
  gray: {
    100: '#F8F9FA',
    200: '#E9ECEF',
    300: '#DEE2E6',
    400: '#CED4DA',
    500: '#ADB5BD',
    600: '#6C757D',
    700: '#495057',
    800: '#343A40',
    900: '#212529',
  },
};



