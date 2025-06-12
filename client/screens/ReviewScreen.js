import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  ScrollView,
  Image,
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import { useRouter } from 'expo-router';
import { showNotification } from '../utils/PushNotificationConfig';

const ReviewScreen = () => {
  const searchParams = new URLSearchParams(window.location.search);
  const productId = searchParams.get('productId') || 'No ID';

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState('');
  const [reviewText, setReviewText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const isFocused = useIsFocused();
  const [errorMessage, setErrorMessage] = useState('');
  const [token, setToken] = useState(null);
  const [userId, setUserId] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('token');
        const storedUserId = await AsyncStorage.getItem('userId');
        setToken(storedToken);
        setUserId(storedUserId);

      } catch (error) {
        console.error('Error fetching token:', error);
        setErrorMessage('Failed to load data. Please try again later.');
        showNotification('Error', 'Failed to load data.');
        setLoading(false);
      }
    };

    if (isFocused) {
      fetchData();
    }
  }, [isFocused]);

  console.log("review prod", productId);
  console.log("review user", userId);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://192.168.1.11:5000/products/${productId}`);
        setProduct(response.data);
      } catch (error) {
        Alert.alert('Error', 'Failed to load product details.');
        showNotification('Error', 'Failed to load product details.');
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  const handleSubmitReview = async () => {
    if (!rating || isNaN(rating) || rating < 1 || rating > 5) {
      Toast.show({
        type: 'error',
        text1: 'Please enter a rating between 1 and 5.'
      });
      return;
    }
    if (!reviewText.trim()) {
      Toast.show({
        type: 'error',
        text1: 'Please enter a text.'
      });
      return;
    }

    setSubmitting(true);
    try {
      await axios.post(`http://192.168.1.11:5000/reviews`, {
        product: productId,
        user: userId,
        rating: Number(rating),
        comment: reviewText.trim(),
      });

      Toast.show({
        type: 'success',
        text1: 'Thank you for your review!',
        text2: 'Tap here to see your reviews.',
        onPress: () => {
          router.push('/yourreviews');
        },
      });
      showNotification('Thank you', 'You left a review.');
    } catch (error) {
      console.error('Error in addReview:', error);
      Toast.show({
        type: 'error',
        text1: 'Failed to submit review.'
      });
      showNotification('Error', 'Failed to submit review.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#880e4f" />
      </View>
    );
  }

  if (!product) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Product not found.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Leave a Review</Text>

      <Image source={{ uri: product.imageUrl }} style={styles.image} resizeMode="contain" />
      <Text style={styles.productName}>{product.name}</Text>

      <Text style={styles.label}>Rating (1 to 5):</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        maxLength={1}
        placeholder="Enter rating"
        value={rating}
        onChangeText={setRating}
      />

      <Text style={styles.label}>Review:</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        multiline
        numberOfLines={5}
        placeholder="Write your review here..."
        value={reviewText}
        onChangeText={setReviewText}
      />

      <TouchableOpacity
        style={[styles.submitButton, submitting && { opacity: 0.6 }]}
        onPress={handleSubmitReview}
        disabled={submitting}
      >
        <Text style={styles.submitButtonText}>
          {submitting ? 'Submitting...' : 'Submit Review'}
        </Text>
      </TouchableOpacity>
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
  image: {
    width: 180,
    height: 180,
    borderRadius: 10,
    marginBottom: 16,
  },
  productName: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 24,
    textAlign: 'center',
  },
  label: {
    alignSelf: 'flex-start',
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 6,
    color: '#444',
  },
  input: {
    width: '100%',
    borderColor: '#880e4f',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 16,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: '#880e4f',
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 30,
    marginTop: 12,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
});

export default ReviewScreen;
