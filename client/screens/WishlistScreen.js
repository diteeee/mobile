import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Button,
  TouchableOpacity,
} from 'react-native';
import axios from 'axios';
import { useIsFocused } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ProductCard from '../components/ProductCard';
import Toast from 'react-native-toast-message';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { showNotification } from '../utils/PushNotificationConfig'; // Import notification utility

const WishlistScreen = () => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);
  const [userId, setUserId] = useState(null);
  const isFocused = useIsFocused();
  const router = useRouter();

  useEffect(() => {
    const fetchTokenAndWishlist = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('token');
        const storedUserId = await AsyncStorage.getItem('userId');
        setToken(storedToken);
        setUserId(storedUserId);

        if (storedToken && storedUserId) {
          await fetchWishlist(storedUserId, storedToken);
        } else {
          setLoading(false);
        }
      } catch (error) {
        console.error('Error fetching token or wishlist:', error);
        showNotification('Error', 'Failed to load data.');
        setLoading(false);
      }
    };

    if (isFocused) {
      fetchTokenAndWishlist();
    }
  }, [isFocused]);

  const fetchWishlist = async (userId, authToken) => {
    try {
      setLoading(true);
      const response = await axios.get(`http://192.168.1.11:5000/wishlists/${userId}`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      setWishlistItems(response.data.products || []);
    } catch (error) {
      console.error('Error fetching wishlist:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to load wishlist.',
      });
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = async (productId) => {
    try {
      await axios.delete(
        `http://192.168.1.11:5000/wishlists/${userId}/${productId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      Toast.show({
        type: 'info',
        text1: 'Removed',
        text2: 'Product removed from wishlist.',
      });
      await fetchWishlist(userId, token);
    } catch (error) {
      console.error('Error removing product:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to remove product from wishlist.',
      });
    }
  };

  const handleAddToCart = async (productId) => {
    try {
      await axios.post(
        `http://192.168.1.11:5000/carts/add`,
        { user: userId, product: productId, quantity: 1 },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      Toast.show({
        type: 'success',
        text1: 'Added to Cart',
        text2: 'Product added to cart successfully.',
      });
      showNotification('Success', 'Product added to cart!');
    } catch (error) {
      console.error('Error adding product to cart:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to add product to cart.',
      });
    }
  };

  const renderWishlistItem = ({ item }) => (
    <View style={styles.wishlistItem}>
      <ProductCard
        product={item}
        showAddToCart={true}
        onAddToCart={() => handleAddToCart(item._id)}
        hideWishlistButton={true}
        hideReviewButton={true}
      />
      <Button
        title="Remove"
        onPress={() => removeFromWishlist(item._id)}
        color="#000000"
      />
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#880e4f" />
        <Text style={styles.loadingText}>Loading your wishlist...</Text>
      </View>
    );
  }

  if (!token) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.messageText}>
          Please sign in to view your wishlist.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>My Wishlist</Text>
      {wishlistItems.length === 0 ? (
        <View style={styles.centerContainer}>
          <Text style={styles.messageText}>
            Your wishlist is empty. Add products to see them here!
          </Text>
          <TouchableOpacity
            style={styles.seeProductsButton}
            onPress={() => router.push('/')}
          >
            <Text style={styles.seeProductsButtonText}>See Products</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={wishlistItems}
          renderItem={renderWishlistItem}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}
      <TouchableOpacity
        style={styles.cartButton}
        onPress={() => router.push('/cart')}
      >
        <MaterialIcons name="shopping-cart" size={24} color="#fff" />
      </TouchableOpacity>
      <Toast position="bottom" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fce4ec',
    paddingTop: 16,
  },
    cartButton: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    backgroundColor: '#880e4f',
    borderRadius: 50,
    padding: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  heading: {
    fontSize: 28,
    fontWeight: '700',
    color: '#880e4f',
    textAlign: 'center',
    marginBottom: 12,
  },
  list: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fce4ec',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#880e4f',
    fontWeight: '500',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
    backgroundColor: '#fce4ec',
  },
  messageText: {
    fontSize: 18,
    color: '#880e4f',
    fontWeight: '600',
    textAlign: 'center',
  },
  wishlistItem: {
    marginBottom: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  seeProductsButton: {
    marginTop: 20,
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: '#f48fb1', // light pink
    borderRadius: 30,
    shadowColor: '#c2185b', // shadow color
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 4, // for Android shadow
    alignItems: 'center',
    justifyContent: 'center',
  },
  seeProductsButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
});

export default WishlistScreen;
