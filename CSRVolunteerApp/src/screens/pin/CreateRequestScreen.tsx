import React, {useState, useEffect} from 'react';
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
  Chip,
  ActivityIndicator,
} from 'react-native-paper';
import RNPickerSelect from 'react-native-picker-select';
import DatePicker from 'react-native-date-picker';
import {useAuth} from '../../contexts/AuthContext';
import ApiService from '../../services/api';
import {ServiceCategory, CreatePINRequest} from '../../types';
import {showAlert} from '../../utils/helpers';

const CreateRequestScreen: React.FC = () => {
  const {user} = useAuth();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [formData, setFormData] = useState<CreatePINRequest>({
    title: '',
    description: '',
    category_id: 0,
    urgency: 'medium',
    location: '',
    special_notes: '',
  });
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const categoriesData = await ApiService.getServiceCategories();
      setCategories(categoriesData);
    } catch (error) {
      console.log('Error loading categories:', error);
    }
  };

  const updateFormData = (field: keyof CreatePINRequest, value: any) => {
    setFormData(prev => ({...prev, [field]: value}));
  };

  const handleSubmit = async () => {
    if (!formData.title.trim() || !formData.description.trim()) {
      showAlert('Error', 'Please fill in title and description');
      return;
    }

    if (formData.category_id === 0) {
      showAlert('Error', 'Please select a category');
      return;
    }

    setLoading(true);
    try {
      const requestData = {
        ...formData,
        preferred_date: selectedDate?.toISOString(),
      };
      await ApiService.createPINRequest(requestData);
      showAlert('Success', 'Request created successfully!');
      // Navigate back
    } catch (error: any) {
      showAlert('Error', error.response?.data?.error || 'Failed to create request');
    } finally {
      setLoading(false);
    }
  };

  const urgencyOptions = [
    {label: 'Low', value: 'low'},
    {label: 'Medium', value: 'medium'},
    {label: 'High', value: 'high'},
    {label: 'Urgent', value: 'urgent'},
  ];

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView style={styles.scrollView}>
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.title}>Create Help Request</Title>

            <TextInput
              label="Title *"
              value={formData.title}
              onChangeText={value => updateFormData('title', value)}
              mode="outlined"
              style={styles.input}
              placeholder="Brief description of what you need help with"
            />

            <TextInput
              label="Description *"
              value={formData.description}
              onChangeText={value => updateFormData('description', value)}
              mode="outlined"
              style={styles.input}
              multiline
              numberOfLines={4}
              placeholder="Detailed description of your request"
            />

            <View style={styles.pickerContainer}>
              <Text style={styles.pickerLabel}>Category *</Text>
              <RNPickerSelect
                onValueChange={value => updateFormData('category_id', value)}
                items={categories.map(cat => ({
                  label: cat.name,
                  value: cat.id,
                }))}
                placeholder={{label: 'Select a category', value: 0}}
                style={pickerSelectStyles}
              />
            </View>

            <View style={styles.pickerContainer}>
              <Text style={styles.pickerLabel}>Urgency</Text>
              <RNPickerSelect
                onValueChange={value => updateFormData('urgency', value)}
                items={urgencyOptions}
                value={formData.urgency}
                style={pickerSelectStyles}
              />
            </View>

            <TextInput
              label="Location"
              value={formData.location}
              onChangeText={value => updateFormData('location', value)}
              mode="outlined"
              style={styles.input}
              placeholder="Where do you need help?"
            />

            <Button
              mode="outlined"
              onPress={() => setShowDatePicker(true)}
              style={styles.dateButton}>
              {selectedDate
                ? `Preferred Date: ${selectedDate.toLocaleDateString()}`
                : 'Select Preferred Date (Optional)'}
            </Button>

            <TextInput
              label="Special Notes"
              value={formData.special_notes}
              onChangeText={value => updateFormData('special_notes', value)}
              mode="outlined"
              style={styles.input}
              multiline
              numberOfLines={3}
              placeholder="Any additional information or special requirements"
            />

            <Button
              mode="contained"
              onPress={handleSubmit}
              loading={loading}
              disabled={loading}
              style={styles.submitButton}>
              Create Request
            </Button>
          </Card.Content>
        </Card>
      </ScrollView>

      <DatePicker
        modal
        open={showDatePicker}
        date={selectedDate || new Date()}
        mode="date"
        onConfirm={date => {
          setShowDatePicker(false);
          setSelectedDate(date);
        }}
        onCancel={() => {
          setShowDatePicker(false);
        }}
      />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollView: {
    flex: 1,
  },
  card: {
    margin: 16,
    elevation: 2,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#212121',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    marginBottom: 16,
  },
  pickerContainer: {
    marginBottom: 16,
  },
  pickerLabel: {
    fontSize: 16,
    color: '#212121',
    marginBottom: 8,
  },
  dateButton: {
    marginBottom: 16,
    borderColor: '#2196F3',
  },
  submitButton: {
    marginTop: 8,
    paddingVertical: 8,
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#BDBDBD',
    borderRadius: 8,
    color: '#212121',
    paddingRight: 30,
    backgroundColor: '#FFFFFF',
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#BDBDBD',
    borderRadius: 8,
    color: '#212121',
    paddingRight: 30,
    backgroundColor: '#FFFFFF',
  },
});

export default CreateRequestScreen;



