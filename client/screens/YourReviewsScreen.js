import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Alert,
  ScrollView,
  Image,
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';

const YourReviewsScreen = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchUserIdAndReviews = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem('userId');
        if (!storedUserId) {
          setErrorMessage('User not logged in.');
          setLoading(false);
          return;
        }
        setUserId(storedUserId);

        const response = await axios.get(`http://192.168.1.4:5000/reviews/user/${storedUserId}`);
        setReviews(response.data);
      } catch (error) {
        console.error('Error fetching user reviews:', error);
        Alert.alert('Error', 'Failed to load your reviews.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserIdAndReviews();
  }, []);

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#880e4f" />
      </View>
    );
  }

  if (errorMessage) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{errorMessage}</Text>
      </View>
    );
  }

  if (!reviews.length) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>You have not submitted any reviews yet.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>My Reviews</Text>

      {reviews.map((review) => (
        <View key={review._id} style={styles.reviewCard}>
          <Image
            source={{ uri: review.product?.imageUrl || 'https://via.placeholder.com/150' }}
            style={styles.productImage}
            resizeMode="contain"
          />
          <View style={styles.reviewContent}>
            <Text style={styles.productName}>{review.product?.name || 'Product'}</Text>
            <Text style={styles.rating}>Rating: {review.rating} / 5</Text>
            <Text style={styles.comment}>{review.comment || review.text || 'No comment'}</Text>
          </View>
        </View>
      ))}

      <Toast />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fce4ec',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  errorText: {
    fontSize: 18,
    color: '#880e4f',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  emptyText: {
    fontSize: 18,
    color: '#880e4f',
    fontStyle: 'italic',
  },
  container: {
    flexGrow: 1,
    backgroundColor: '#fce4ec',
    padding: 20,
    alignItems: 'center',
  },
  heading: {
    fontSize: 26,
    fontWeight: '700',
    color: '#880e4f',
    marginBottom: 20,
  },
  reviewCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 16,
    width: '100%',
    padding: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  productImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginRight: 16,
    backgroundColor: '#eee',
  },
  reviewContent: {
    flex: 1,
    justifyContent: 'center',
  },
  productName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 6,
    color: '#880e4f',
  },
  rating: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 6,
  },
  comment: {
    fontSize: 14,
    color: '#333',
  },
});

export default YourReviewsScreen;
