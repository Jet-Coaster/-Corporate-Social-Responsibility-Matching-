import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Text, Card, Title} from 'react-native-paper';

const CategoriesScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title>Service Categories</Title>
          <Text>Categories management screen implementation</Text>
        </Card.Content>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    padding: 16,
  },
  card: {
    elevation: 2,
  },
});

export default CategoriesScreen;



