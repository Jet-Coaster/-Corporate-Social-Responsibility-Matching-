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
} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import {useAuth} from '../../contexts/AuthContext';
import {validateEmail} from '../../utils/helpers';

const LoginScreen: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showError, setShowError] = useState(false);

  const {login} = useAuth();
  const navigation = useNavigation();

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      setError('Please fill in all fields');
      setShowError(true);
      return;
    }

    setLoading(true);
    setError('');

    try {
      await login({username: username.trim(), password});
    } catch (err: any) {
      setError(err.response?.data?.error || 'Login failed');
      setShowError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Title style={styles.title}>CSR Volunteer Matching</Title>
          <Paragraph style={styles.subtitle}>
            Connect with those who need help
          </Paragraph>
        </View>

        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.cardTitle}>Sign In</Title>

            <TextInput
              label="Username"
              value={username}
              onChangeText={setUsername}
              mode="outlined"
              style={styles.input}
              autoCapitalize="none"
              autoCorrect={false}
            />

            <TextInput
              label="Password"
              value={password}
              onChangeText={setPassword}
              mode="outlined"
              style={styles.input}
              secureTextEntry
              autoCapitalize="none"
            />

            <Button
              mode="contained"
              onPress={handleLogin}
              loading={loading}
              disabled={loading}
              style={styles.button}>
              Sign In
            </Button>

            <Button
              mode="text"
              onPress={() => navigation.navigate('Register' as never)}
              style={styles.registerButton}>
              Don't have an account? Sign Up
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
  cardTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#212121',
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginTop: 8,
    paddingVertical: 8,
  },
  registerButton: {
    marginTop: 16,
  },
});

export default LoginScreen;
