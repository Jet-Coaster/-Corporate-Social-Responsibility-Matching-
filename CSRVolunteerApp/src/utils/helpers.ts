import {Alert} from 'react-native';

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const formatDateTime = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const getUrgencyColor = (urgency: string): string => {
  switch (urgency) {
    case 'urgent':
      return '#F44336';
    case 'high':
      return '#FF9800';
    case 'medium':
      return '#2196F3';
    case 'low':
      return '#4CAF50';
    default:
      return '#757575';
  }
};

export const getStatusColor = (status: string): string => {
  switch (status) {
    case 'completed':
      return '#4CAF50';
    case 'in_progress':
      return '#2196F3';
    case 'pending':
      return '#FF9800';
    case 'cancelled':
      return '#F44336';
    case 'open':
      return '#4CAF50';
    default:
      return '#757575';
  }
};

export const getPriorityColor = (priority: string): string => {
  switch (priority) {
    case 'high':
      return '#F44336';
    case 'medium':
      return '#FF9800';
    case 'low':
      return '#4CAF50';
    default:
      return '#757575';
  }
};

export const showAlert = (title: string, message: string, onPress?: () => void) => {
  Alert.alert(title, message, [
    {
      text: 'OK',
      onPress: onPress,
    },
  ]);
};

export const showConfirmAlert = (
  title: string,
  message: string,
  onConfirm: () => void,
  onCancel?: () => void,
) => {
  Alert.alert(title, message, [
    {
      text: 'Cancel',
      onPress: onCancel,
      style: 'cancel',
    },
    {
      text: 'Confirm',
      onPress: onConfirm,
      style: 'destructive',
    },
  ]);
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): boolean => {
  return password.length >= 6;
};

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) {
    return text;
  }
  return text.substring(0, maxLength) + '...';
};

export const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};



