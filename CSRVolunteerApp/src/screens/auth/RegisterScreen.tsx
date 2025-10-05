import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {
  Text,
  TextInput,
  Button,
  Card,
  Title,
  Paragraph,
  Snackbar,
  RadioButton,
} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import {useAuth} from '../../contexts/AuthContext';
import {validateEmail, validatePassword} from '../../utils/helpers';

const RegisterScreen: React.FC = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'pin',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showError, setShowError] = useState(false);
  const [success, setSuccess] = useState(false);

  const {register} = useAuth();
  const navigation = useNavigation();

  const handleRegister = async () => {
    console.log('Register button clicked!');
    const {username, email, password, confirmPassword, role} = formData;

    // Validation
    if (!username.trim() || !email.trim() || !password.trim()) {
      setError('Please fill in all fields');
      setShowError(true);
      return;
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      setShowError(true);
      return;
    }

    if (!validatePassword(password)) {
      setError('Password must be at least 6 characters long');
      setShowError(true);
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setShowError(true);
      return;
    }

    setLoading(true);
    setError('');

    try {
      console.log('Attempting registration with:', {
        username: username.trim(),
        email: email.trim(),
        password: '***',
        role,
      });
      
      await register({
        username: username.trim(),
        email: email.trim(),
        password,
        role,
      });
      
      console.log('Registration successful!');
      setSuccess(true);
      setError('Registration successful! Please sign in.');
      setShowError(true);
    } catch (err: any) {
      console.log('Registration error:', err);
      console.log('Error response:', err.response?.data);
      console.log('Error status:', err.response?.status);
      
      setError(err.response?.data?.error || err.message || 'Registration failed');
      setShowError(true);
    } finally {
      setLoading(false);
    }
  };

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({...prev, [field]: value}));
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Title style={styles.title}>Create Account</Title>
          <Paragraph style={styles.subtitle}>
            Join the CSR volunteer community
          </Paragraph>
        </View>

        <Card style={styles.card}>
          <Card.Content>
            <TextInput
              label="Username"
              value={formData.username}
              onChangeText={value => updateFormData('username', value)}
              mode="outlined"
              style={styles.input}
              autoCapitalize="none"
              autoCorrect={false}
            />

            <TextInput
              label="Email"
              value={formData.email}
              onChangeText={value => updateFormData('email', value)}
              mode="outlined"
              style={styles.input}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />

            <TextInput
              label="Password"
              value={formData.password}
              onChangeText={value => updateFormData('password', value)}
              mode="outlined"
              style={styles.input}
              secureTextEntry
              autoCapitalize="none"
            />

            <TextInput
              label="Confirm Password"
              value={formData.confirmPassword}
              onChangeText={value => updateFormData('confirmPassword', value)}
              mode="outlined"
              style={styles.input}
              secureTextEntry
              autoCapitalize="none"
            />

            <View style={styles.roleContainer}>
              <Text style={styles.roleLabel}>Account Type:</Text>
              <RadioButton.Group
                onValueChange={value => updateFormData('role', value)}
                value={formData.role}>
                <View style={styles.radioRow}>
                  <RadioButton value="pin" />
                  <Text>Person in Need (PIN)</Text>
                </View>
                <View style={styles.radioRow}>
                  <RadioButton value="csr_rep" />
                  <Text>CSR Representative</Text>
                </View>
              </RadioButton.Group>
            </View>

            <Button
              mode="contained"
              onPress={handleRegister}
              loading={loading}
              disabled={loading}
              style={styles.button}>
              Create Account
            </Button>

            <Button
              mode="text"
              onPress={() => navigation.navigate('Login' as never)}
              style={styles.loginButton}>
              Already have an account? Sign In
            </Button>
          </Card.Content>
        </Card>
      </ScrollView>

      <Snackbar
        visible={showError}
        onDismiss={() => setShowError(false)}
        duration={4000}>
        {error}
      </Snackbar>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2196F3',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#757575',
    textAlign: 'center',
    marginTop: 8,
  },
  card: {
    elevation: 4,
    borderRadius: 12,
  },
  input: {
    marginBottom: 16,
  },
  roleContainer: {
    marginBottom: 20,
  },
  roleLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
    color: '#212121',
  },
  radioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  button: {
    marginTop: 8,
    paddingVertical: 8,
  },
  loginButton: {
    marginTop: 16,
  },
});

export default RegisterScreen;
