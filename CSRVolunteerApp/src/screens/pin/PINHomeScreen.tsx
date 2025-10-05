import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import {
  Text,
  Card,
  Title,
  Paragraph,
  Button,
  FAB,
  Chip,
  ActivityIndicator,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useAuth} from '../../contexts/AuthContext';
import ApiService from '../../services/api';
import {PINRequest, ServiceCategory} from '../../types';
import {formatDate, getUrgencyColor, getStatusColor} from '../../utils/helpers';

const PINHomeScreen: React.FC = () => {
  const {user} = useAuth();
  const [requests, setRequests] = useState<PINRequest[]>([]);
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [requestsData, categoriesData] = await Promise.all([
        ApiService.getPINRequests(),
        ApiService.getServiceCategories(),
      ]);
      setRequests(requestsData);
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

  const getCategoryName = (categoryId: number): string => {
    const category = categories.find(cat => cat.id === categoryId);
    return category?.name || 'Unknown Category';
  };

  const getStats = () => {
    const total = requests.length;
    const open = requests.filter(req => req.status === 'open').length;
    const inProgress = requests.filter(req => req.status === 'in_progress').length;
    const completed = requests.filter(req => req.status === 'completed').length;
    const totalViews = requests.reduce((sum, req) => sum + req.view_count, 0);
    const totalShortlists = requests.reduce((sum, req) => sum + req.shortlist_count, 0);

    return {total, open, inProgress, completed, totalViews, totalShortlists};
  };

  const stats = getStats();

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2196F3" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        {/* Welcome Section */}
        <Card style={styles.welcomeCard}>
          <Card.Content>
            <Title style={styles.welcomeTitle}>
              Welcome back, {user?.username}!
            </Title>
            <Paragraph style={styles.welcomeSubtitle}>
              Manage your help requests and track volunteer interest
            </Paragraph>
          </Card.Content>
        </Card>

        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <Card style={styles.statCard}>
            <Card.Content style={styles.statContent}>
              <Icon name="assignment" size={24} color="#2196F3" />
              <Text style={styles.statNumber}>{stats.total}</Text>
              <Text style={styles.statLabel}>Total Requests</Text>
            </Card.Content>
          </Card>

          <Card style={styles.statCard}>
            <Card.Content style={styles.statContent}>
              <Icon name="visibility" size={24} color="#4CAF50" />
              <Text style={styles.statNumber}>{stats.totalViews}</Text>
              <Text style={styles.statLabel}>Total Views</Text>
            </Card.Content>
          </Card>

          <Card style={styles.statCard}>
            <Card.Content style={styles.statContent}>
              <Icon name="favorite" size={24} color="#FF4081" />
              <Text style={styles.statNumber}>{stats.totalShortlists}</Text>
              <Text style={styles.statLabel}>Shortlisted</Text>
            </Card.Content>
          </Card>
        </View>

        {/* Recent Requests */}
        <Card style={styles.requestsCard}>
          <Card.Content>
            <Title style={styles.sectionTitle}>Recent Requests</Title>
            {requests.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Icon name="assignment" size={48} color="#BDBDBD" />
                <Text style={styles.emptyText}>No requests yet</Text>
                <Text style={styles.emptySubtext}>
                  Create your first help request to get started
                </Text>
              </View>
            ) : (
              requests.slice(0, 3).map(request => (
                <TouchableOpacity
                  key={request.id}
                  style={styles.requestItem}
                  onPress={() => {
                    // Navigate to request detail
                  }}>
                  <View style={styles.requestHeader}>
                    <Text style={styles.requestTitle} numberOfLines={1}>
                      {request.title}
                    </Text>
                    <Chip
                      mode="outlined"
                      textStyle={{
                        color: getUrgencyColor(request.urgency),
                        fontSize: 12,
                      }}
                      style={{
                        borderColor: getUrgencyColor(request.urgency),
                      }}>
                      {request.urgency}
                    </Chip>
                  </View>
                  <Text style={styles.requestCategory}>
                    {getCategoryName(request.category_id)}
                  </Text>
                  <View style={styles.requestFooter}>
                    <Text style={styles.requestDate}>
                      {formatDate(request.created_at)}
                    </Text>
                    <View style={styles.requestStats}>
                      <View style={styles.statItem}>
                        <Icon name="visibility" size={16} color="#757575" />
                        <Text style={styles.statText}>{request.view_count}</Text>
                      </View>
                      <View style={styles.statItem}>
                        <Icon name="favorite" size={16} color="#757575" />
                        <Text style={styles.statText}>{request.shortlist_count}</Text>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              ))
            )}
          </Card.Content>
        </Card>
      </ScrollView>

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
  scrollView: {
    flex: 1,
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
  welcomeCard: {
    margin: 16,
    elevation: 2,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#212121',
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: '#757575',
    marginTop: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginBottom: 16,
    justifyContent: 'space-between',
  },
  statCard: {
    flex: 1,
    marginHorizontal: 4,
    elevation: 2,
  },
  statContent: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#212121',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#757575',
    marginTop: 4,
    textAlign: 'center',
  },
  requestsCard: {
    margin: 16,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#212121',
    marginBottom: 16,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 32,
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
  requestItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  requestHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  requestTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#212121',
    flex: 1,
    marginRight: 8,
  },
  requestCategory: {
    fontSize: 14,
    color: '#757575',
    marginBottom: 8,
  },
  requestFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#2196F3',
  },
});

export default PINHomeScreen;



