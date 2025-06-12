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
import PlaceOrderCard from '../components/PlaceOrderCard';
import Toast from 'react-native-toast-message';
import { useRouter } from 'expo-router';
import { showNotification } from '../utils/PushNotificationConfig';

const CartScreen = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);
  const [userId, setUserId] = useState(null);
  const isFocused = useIsFocused();
  const router = useRouter();

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
      const response = await axios.get(`http://192.168.1.11:5000/carts/${userId}`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      setCartItems(response.data.products || []);
    } catch (error) {
      console.error('Error fetching cart:', error);
        showNotification('Error', 'Failed to load cart.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuantityChange = async (productId, change) => {
    const currentItemIndex = cartItems.findIndex(item => item.product._id === productId);
    if (currentItemIndex === -1) return;

    const currentItem = cartItems[currentItemIndex];
    const newQuantity = currentItem.quantity + change;

    if (newQuantity < 1) {
      showNotification('Invalid quantity', 'Quantity cannot be less than 1');
      return;
    }

    try {
      await axios.put(
        'http://192.168.1.11:5000/carts/update-quantity',
        { user: userId, product: productId, quantity: newQuantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const updatedCartItems = [...cartItems];
      updatedCartItems[currentItemIndex] = {
        ...currentItem,
        quantity: newQuantity,
      };
      setCartItems(updatedCartItems);
      showNotification('Success', 'Quantity updated.');
    } catch (error) {
      console.error('Error updating quantity:', error);
      showNotification('Error', 'Failed to update quantity.');
    }
  };

  const handlePlaceOrder = (totalPrice) => {
    router.push('/orderscreen');
  };

  const handleRemoveFromCart = async (productId) => {
    try {
      await axios.post(
        'http://192.168.1.11:5000/carts/remove',
        { user: userId, product: productId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const updatedCartItems = cartItems.filter(item => item.product._id !== productId);
      setCartItems(updatedCartItems);
      showNotification('Success', 'Item removed from cart.');
    } catch (error) {
      console.error('Error removing item from cart:', error);
      showNotification('Error', 'Failed to remove item from cart.');
    }
  };

  const renderCartItem = ({ item }) => (
    <View style={styles.cartItem}>
      <ProductCard product={item.product} showAddToCart={false} hideWishlistButton={true} hideReviewButton={true}/>
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
        onPress={() => handleRemoveFromCart(item.product._id)}
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
          <TouchableOpacity
            style={styles.seeProductsButton}
            onPress={() => router.push('/')}
          >
            <Text style={styles.seeProductsButtonText}>See Products</Text>
          </TouchableOpacity>
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
      {cartItems.length > 0 && <PlaceOrderCard cartItems={cartItems} onPlaceOrder={handlePlaceOrder} />}
      <Toast />
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
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 12,
    gap: 20,
  },
  quantityButton: {
    backgroundColor: '#ab47bc',
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 25,
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
  seeProductsButton: {
    marginTop: 20,
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: '#f48fb1',
    borderRadius: 30,
    shadowColor: '#c2185b',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 4,
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

export default CartScreen;
