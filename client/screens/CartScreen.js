import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Alert,
  Button,
  TouchableOpacity,
} from 'react-native';
import axios from 'axios';
import { useIsFocused } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ProductCard from '../components/ProductCard';

const CartScreen = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);
  const [userId, setUserId] = useState(null);
  const isFocused = useIsFocused();

  useEffect(() => {
    const fetchTokenAndCart = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('token');
        const storedUserId = await AsyncStorage.getItem('userId');
        setToken(storedToken);
        setUserId(storedUserId);

        if (storedToken && storedUserId) {
          await fetchCart(storedUserId, storedToken);
        } else {
          setLoading(false);
        }
      } catch (error) {
        console.error('Error fetching token or cart:', error);
        setLoading(false);
      }
    };

    if (isFocused) {
      fetchTokenAndCart();
    }
  }, [isFocused]);

  const fetchCart = async (userId, authToken) => {
    try {
      setLoading(true);
      const response = await axios.get(`http://192.168.1.4:5000/carts/${userId}`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      setCartItems(response.data.products || []);
    } catch (error) {
      console.error('Error fetching cart:', error);
      Alert.alert('Error', 'Failed to load cart.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuantityChange = async (productId, change) => {
    // Find current quantity for productId in cartItems
    const currentItem = cartItems.find(item => item.product._id === productId);
    if (!currentItem) return; // item not found

    // If change is zero, remove the item from cart
    if (change === 0) {
      try {
        await axios.post(
          'http://192.168.1.4:5000/carts/remove',
          { user: userId, product: productId },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        await fetchCart(userId, token);
      } catch (error) {
        console.error('Error removing product:', error);
        Alert.alert('Error', 'Failed to remove product.');
      }
      return;
    }

    const newQuantity = currentItem.quantity + change;
    if (newQuantity < 1) {
      Alert.alert('Quantity cannot be less than 1');
      return;
    }

    try {
      await axios.put(
        'http://192.168.1.4:5000/carts/update-quantity',
        { user: userId, product: productId, quantity: newQuantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Refetch the full cart after update to get complete product info
      await fetchCart(userId, token);
    } catch (error) {
      console.error('Error updating quantity:', error);
      Alert.alert('Error', 'Failed to update quantity.');
    }
  };

  const renderCartItem = ({ item }) => (
    <View style={styles.cartItem}>
      <ProductCard product={item.product} showAddToCart={false} hideWishlistButton={true}/>
      <View style={styles.quantityWrapper}>
        <TouchableOpacity
          style={styles.quantityButton}
          onPress={() => handleQuantityChange(item.product._id, -1)}
        >
          <Text style={styles.quantityButtonText}>-</Text>
        </TouchableOpacity>
        <Text style={styles.quantityText}>{item.quantity}</Text>
        <TouchableOpacity
          style={styles.quantityButton}
          onPress={() => handleQuantityChange(item.product._id, 1)}
        >
          <Text style={styles.quantityButtonText}>+</Text>
        </TouchableOpacity>
      </View>
      <Button
        title="Remove"
        onPress={() => handleQuantityChange(item.product._id, 0)}
        color="#000000"
      />
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#880e4f" />
        <Text style={styles.loadingText}>Loading your cart...</Text>
      </View>
    );
  }

  if (!token) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.messageText}>
          Please sign in to view your cart.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>My Cart</Text>
      {cartItems.length === 0 ? (
        <View style={styles.centerContainer}>
          <Text style={styles.messageText}>
            Your cart is empty. Add products to see them here!
          </Text>
        </View>
      ) : (
        <FlatList
          data={cartItems}
          renderItem={renderCartItem}
          keyExtractor={(item) => item.product._id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fce4ec',
    paddingTop: 16,
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
  cartItem: {
    marginBottom: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  quantityWrapper: {
    flexDirection: 'row',
    justifyContent: 'center', // center horizontally
    alignItems: 'center',
    marginVertical: 12,
    gap: 20, // spacing between buttons and text (if unsupported, remove and rely on margins)
  },
  quantityButton: {
    backgroundColor: '#ab47bc', // softer purple
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 25, // pill shape
    shadowColor: '#6200ea',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  quantityButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 20,
    lineHeight: 20,
  },
  quantityText: {
    fontSize: 22,
    color: '#4a148c',
    fontWeight: '700',
    marginHorizontal: 15,
    minWidth: 30,
    textAlign: 'center',
  },
});

export default CartScreen;
