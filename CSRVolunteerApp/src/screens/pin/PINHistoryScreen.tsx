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
  ActivityIndicator,
  Searchbar,
  Button,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import ApiService from '../../services/api';
import {Match} from '../../types';
import {formatDate, getStatusColor} from '../../utils/helpers';

const PINHistoryScreen: React.FC = () => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const historyData = await ApiService.getPINHistory({
        page: 1,
        page_size: 50,
      });
      setMatches(historyData.data);
    } catch (error) {
      console.log('Error loading history:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadHistory();
    setRefreshing(false);
  };

  const filteredMatches = matches.filter(match =>
    match.request.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    match.csr_rep.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    match.csr_rep.last_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderMatch = ({item}: {item: Match}) => (
    <TouchableOpacity
      style={styles.matchCard}
      onPress={() => {
        // Navigate to match detail
      }}>
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.matchHeader}>
            <Text style={styles.matchTitle} numberOfLines={1}>
              {item.request.title}
            </Text>
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
          
          <Text style={styles.matchCategory}>
            {item.request.category.name}
          </Text>
          
          <View style={styles.matchInfo}>
            <View style={styles.infoItem}>
              <Icon name="person" size={16} color="#757575" />
              <Text style={styles.infoText}>
                {item.csr_rep.first_name} {item.csr_rep.last_name}
              </Text>
            </View>
            <View style={styles.infoItem}>
              <Icon name="business" size={16} color="#757575" />
              <Text style={styles.infoText}>
                {item.csr_rep.company.name}
              </Text>
            </View>
          </View>
          
          <View style={styles.matchFooter}>
            <Text style={styles.matchDate}>
              {formatDate(item.created_at)}
            </Text>
            {item.rating && (
              <View style={styles.ratingContainer}>
                <Icon name="star" size={16} color="#FFD700" />
                <Text style={styles.ratingText}>{item.rating}/5</Text>
              </View>
            )}
          </View>
          
          {item.feedback && (
            <Text style={styles.feedback} numberOfLines={2}>
              "{item.feedback}"
            </Text>
          )}
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2196F3" />
        <Text style={styles.loadingText}>Loading history...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Searchbar
        placeholder="Search history..."
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchbar}
      />
      
      <FlatList
        data={filteredMatches}
        renderItem={renderMatch}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Icon name="history" size={64} color="#BDBDBD" />
            <Text style={styles.emptyText}>No history found</Text>
            <Text style={styles.emptySubtext}>
              {searchQuery ? 'Try adjusting your search' : 'Your volunteer matches will appear here'}
            </Text>
          </View>
        }
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
  matchCard: {
    marginBottom: 16,
  },
  card: {
    elevation: 2,
  },
  matchHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  matchTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#212121',
    flex: 1,
    marginRight: 8,
  },
  matchCategory: {
    fontSize: 14,
    color: '#2196F3',
    marginBottom: 12,
  },
  matchInfo: {
    marginBottom: 12,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  infoText: {
    fontSize: 14,
    color: '#757575',
    marginLeft: 8,
  },
  matchFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  matchDate: {
    fontSize: 12,
    color: '#BDBDBD',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 12,
    color: '#757575',
    marginLeft: 4,
  },
  feedback: {
    fontSize: 14,
    color: '#757575',
    fontStyle: 'italic',
    marginTop: 8,
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
});

export default PINHistoryScreen;



