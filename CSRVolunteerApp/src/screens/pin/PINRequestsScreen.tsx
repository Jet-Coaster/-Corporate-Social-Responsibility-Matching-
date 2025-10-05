import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import {
  Text,
  Card,
  Title,
  Chip,
  FAB,
  ActivityIndicator,
  Searchbar,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import ApiService from '../../services/api';
import {PINRequest} from '../../types';
import {formatDate, getUrgencyColor, getStatusColor} from '../../utils/helpers';

const PINRequestsScreen: React.FC = () => {
  const [requests, setRequests] = useState<PINRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    try {
      const requestsData = await ApiService.getPINRequests();
      setRequests(requestsData);
    } catch (error) {
      console.log('Error loading requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadRequests();
    setRefreshing(false);
  };

  const filteredRequests = requests.filter(request =>
    request.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    request.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderRequest = ({item}: {item: PINRequest}) => (
    <TouchableOpacity
      style={styles.requestCard}
      onPress={() => {
        // Navigate to request detail
      }}>
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.requestHeader}>
            <Text style={styles.requestTitle} numberOfLines={1}>
              {item.title}
            </Text>
            <Chip
              mode="outlined"
              textStyle={{
                color: getUrgencyColor(item.urgency),
                fontSize: 12,
              }}
              style={{
                borderColor: getUrgencyColor(item.urgency),
              }}>
              {item.urgency}
            </Chip>
          </View>
          
          <Text style={styles.requestCategory}>
            {item.category.name}
          </Text>
          
          <Text style={styles.requestDescription} numberOfLines={2}>
            {item.description}
          </Text>
          
          <View style={styles.requestFooter}>
            <Text style={styles.requestDate}>
              {formatDate(item.created_at)}
            </Text>
            <View style={styles.requestStats}>
              <View style={styles.statItem}>
                <Icon name="visibility" size={16} color="#757575" />
                <Text style={styles.statText}>{item.view_count}</Text>
              </View>
              <View style={styles.statItem}>
                <Icon name="favorite" size={16} color="#757575" />
                <Text style={styles.statText}>{item.shortlist_count}</Text>
              </View>
            </View>
          </View>
          
          <View style={styles.statusContainer}>
            <Chip
              mode="outlined"
              textStyle={{
                color: getStatusColor(item.status),
                fontSize: 12,
              }}
              style={{
                borderColor: getStatusColor(item.status),
              }}>
              {item.status.replace('_', ' ').toUpperCase()}
            </Chip>
          </View>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2196F3" />
        <Text style={styles.loadingText}>Loading requests...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Searchbar
        placeholder="Search requests..."
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchbar}
      />
      
      <FlatList
        data={filteredRequests}
        renderItem={renderRequest}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Icon name="assignment" size={64} color="#BDBDBD" />
            <Text style={styles.emptyText}>No requests found</Text>
            <Text style={styles.emptySubtext}>
              {searchQuery ? 'Try adjusting your search' : 'Create your first request to get started'}
            </Text>
          </View>
        }
      />
      
      <FAB
        style={styles.fab}
        icon="plus"
        onPress={() => {
          // Navigate to create request
        }}
      />
    </View>
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
    backgroundColor: '#F5F5F5',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#757575',
  },
  searchbar: {
    margin: 16,
    elevation: 2,
  },
  listContainer: {
    padding: 16,
    paddingTop: 0,
  },
  requestCard: {
    marginBottom: 16,
  },
  card: {
    elevation: 2,
  },
  requestHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  requestTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#212121',
    flex: 1,
    marginRight: 8,
  },
  requestCategory: {
    fontSize: 14,
    color: '#2196F3',
    marginBottom: 8,
  },
  requestDescription: {
    fontSize: 14,
    color: '#757575',
    marginBottom: 12,
    lineHeight: 20,
  },
  requestFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  requestDate: {
    fontSize: 12,
    color: '#BDBDBD',
  },
  requestStats: {
    flexDirection: 'row',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 16,
  },
  statText: {
    fontSize: 12,
    color: '#757575',
    marginLeft: 4,
  },
  statusContainer: {
    alignItems: 'flex-start',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 64,
  },
  emptyText: {
    fontSize: 18,
    color: '#757575',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#BDBDBD',
    marginTop: 8,
    textAlign: 'center',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#2196F3',
  },
});

export default PINRequestsScreen;



