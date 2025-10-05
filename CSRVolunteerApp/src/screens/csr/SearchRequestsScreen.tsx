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
  Button,
  Menu,
  Divider,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import ApiService from '../../services/api';
import {PINRequest, ServiceCategory, RequestFilter} from '../../types';
import {formatDate, getUrgencyColor} from '../../utils/helpers';

const SearchRequestsScreen: React.FC = () => {
  const [requests, setRequests] = useState<PINRequest[]>([]);
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<RequestFilter>({
    page: 1,
    page_size: 20,
  });
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [selectedUrgency, setSelectedUrgency] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [requestsData, categoriesData] = await Promise.all([
        ApiService.searchRequests(filters),
        ApiService.getServiceCategories(),
      ]);
      setRequests(requestsData.data);
      setCategories(categoriesData);
    } catch (error) {
      console.log('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const applyFilters = () => {
    const newFilters: RequestFilter = {
      ...filters,
      search: searchQuery || undefined,
      category_id: selectedCategory || undefined,
      urgency: selectedUrgency || undefined,
    };
    setFilters(newFilters);
    setShowFilters(false);
    loadData();
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory(null);
    setSelectedUrgency(null);
    setFilters({page: 1, page_size: 20});
    loadData();
  };

  const addToShortlist = async (requestId: number) => {
    try {
      await ApiService.addToShortlist({
        request_id: requestId,
        notes: '',
        priority: 'medium',
      });
      // Show success message
    } catch (error) {
      console.log('Error adding to shortlist:', error);
    }
  };

  const renderRequest = ({item}: {item: PINRequest}) => (
    <Card style={styles.requestCard}>
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
        
        <Text style={styles.requestDescription} numberOfLines={3}>
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
        
        <View style={styles.actionButtons}>
          <Button
            mode="outlined"
            onPress={() => {
              // Navigate to request detail
            }}
            style={styles.actionButton}>
            View Details
          </Button>
          <Button
            mode="contained"
            icon="favorite"
            onPress={() => addToShortlist(item.id)}
            style={styles.actionButton}>
            Add to Shortlist
          </Button>
        </View>
      </Card.Content>
    </Card>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2196F3" />
        <Text style={styles.loadingText}>Loading opportunities...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Searchbar
          placeholder="Search volunteer opportunities..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchbar}
        />
        <Button
          mode="outlined"
          icon="filter-list"
          onPress={() => setShowFilters(true)}
          style={styles.filterButton}>
          Filters
        </Button>
      </View>
      
      <FlatList
        data={requests}
        renderItem={renderRequest}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Icon name="search" size={64} color="#BDBDBD" />
            <Text style={styles.emptyText}>No opportunities found</Text>
            <Text style={styles.emptySubtext}>
              Try adjusting your search or filters
            </Text>
          </View>
        }
      />
      
      {/* Filter Modal */}
      <Menu
        visible={showFilters}
        onDismiss={() => setShowFilters(false)}
        anchor={{x: 0, y: 0}}>
        <Menu.Item
          onPress={() => setSelectedCategory(null)}
          title="All Categories"
        />
        {categories.map(category => (
          <Menu.Item
            key={category.id}
            onPress={() => setSelectedCategory(category.id)}
            title={category.name}
          />
        ))}
        <Divider />
        <Menu.Item
          onPress={() => setSelectedUrgency(null)}
          title="All Urgency Levels"
        />
        <Menu.Item
          onPress={() => setSelectedUrgency('low')}
          title="Low"
        />
        <Menu.Item
          onPress={() => setSelectedUrgency('medium')}
          title="Medium"
        />
        <Menu.Item
          onPress={() => setSelectedUrgency('high')}
          title="High"
        />
        <Menu.Item
          onPress={() => setSelectedUrgency('urgent')}
          title="Urgent"
        />
        <Divider />
        <Menu.Item onPress={applyFilters} title="Apply Filters" />
        <Menu.Item onPress={clearFilters} title="Clear All" />
      </Menu>
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
  searchContainer: {
    flexDirection: 'row',
    padding: 16,
    paddingBottom: 8,
  },
  searchbar: {
    flex: 1,
    marginRight: 8,
    elevation: 2,
  },
  filterButton: {
    elevation: 2,
  },
  listContainer: {
    padding: 16,
    paddingTop: 0,
  },
  requestCard: {
    marginBottom: 16,
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
    marginBottom: 12,
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
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 4,
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

export default SearchRequestsScreen;



