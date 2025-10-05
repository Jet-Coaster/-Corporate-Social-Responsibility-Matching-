import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import {
  Text,
  Card,
  Title,
  TextInput,
  Button,
  Divider,
  List,
  Switch,
} from 'react-native-paper';
import {useAuth} from '../../contexts/AuthContext';
import ApiService from '../../services/api';
import {PIN} from '../../types';

const PINProfileScreen: React.FC = () => {
  const {user, logout} = useAuth();
  const [profile, setProfile] = useState<PIN | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    phone: '',
    address: '',
    emergency_contact: '',
    medical_info: '',
    special_needs: '',
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const profileData = await ApiService.getPINProfile();
      setProfile(profileData);
      setFormData({
        first_name: profileData.first_name,
        last_name: profileData.last_name,
        phone: profileData.phone,
        address: profileData.address,
        emergency_contact: profileData.emergency_contact,
        medical_info: profileData.medical_info,
        special_needs: profileData.special_needs,
      });
    } catch (error) {
      console.log('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      await ApiService.updatePINProfile(formData);
      setProfile(prev => prev ? {...prev, ...formData} : null);
      setEditing(false);
      Alert.alert('Success', 'Profile updated successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile');
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {text: 'Cancel', style: 'cancel'},
        {text: 'Logout', onPress: logout},
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading profile...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.title}>Profile Information</Title>
          
          <TextInput
            label="First Name"
            value={formData.first_name}
            onChangeText={value => setFormData(prev => ({...prev, first_name: value}))}
            mode="outlined"
            style={styles.input}
            editable={editing}
          />
          
          <TextInput
            label="Last Name"
            value={formData.last_name}
            onChangeText={value => setFormData(prev => ({...prev, last_name: value}))}
            mode="outlined"
            style={styles.input}
            editable={editing}
          />
          
          <TextInput
            label="Phone"
            value={formData.phone}
            onChangeText={value => setFormData(prev => ({...prev, phone: value}))}
            mode="outlined"
            style={styles.input}
            editable={editing}
            keyboardType="phone-pad"
          />
          
          <TextInput
            label="Address"
            value={formData.address}
            onChangeText={value => setFormData(prev => ({...prev, address: value}))}
            mode="outlined"
            style={styles.input}
            editable={editing}
            multiline
          />
          
          <TextInput
            label="Emergency Contact"
            value={formData.emergency_contact}
            onChangeText={value => setFormData(prev => ({...prev, emergency_contact: value}))}
            mode="outlined"
            style={styles.input}
            editable={editing}
          />
          
          <TextInput
            label="Medical Information"
            value={formData.medical_info}
            onChangeText={value => setFormData(prev => ({...prev, medical_info: value}))}
            mode="outlined"
            style={styles.input}
            editable={editing}
            multiline
          />
          
          <TextInput
            label="Special Needs"
            value={formData.special_needs}
            onChangeText={value => setFormData(prev => ({...prev, special_needs: value}))}
            mode="outlined"
            style={styles.input}
            editable={editing}
            multiline
          />
          
          <View style={styles.buttonContainer}>
            {editing ? (
              <>
                <Button
                  mode="contained"
                  onPress={handleSave}
                  style={styles.button}>
                  Save Changes
                </Button>
                <Button
                  mode="outlined"
                  onPress={() => {
                    setEditing(false);
                    loadProfile();
                  }}
                  style={styles.button}>
                  Cancel
                </Button>
              </>
            ) : (
              <Button
                mode="contained"
                onPress={() => setEditing(true)}
                style={styles.button}>
                Edit Profile
              </Button>
            )}
          </View>
        </Card.Content>
      </Card>
      
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.title}>Account Settings</Title>
          <List.Item
            title="Username"
            description={user?.username}
            left={props => <List.Icon {...props} icon="account" />}
          />
          <List.Item
            title="Email"
            description={user?.email}
            left={props => <List.Icon {...props} icon="email" />}
          />
          <Divider style={styles.divider} />
          <Button
            mode="outlined"
            onPress={handleLogout}
            style={styles.logoutButton}
            textColor="#F44336">
            Logout
          </Button>
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    margin: 16,
    elevation: 2,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#212121',
    marginBottom: 16,
  },
  input: {
    marginBottom: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  button: {
    flex: 1,
    marginHorizontal: 4,
  },
  divider: {
    marginVertical: 16,
  },
  logoutButton: {
    borderColor: '#F44336',
  },
});

export default PINProfileScreen;



