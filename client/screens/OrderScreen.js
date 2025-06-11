import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import { showNotification } from '../utils/PushNotificationConfig'; // Import notification utility

const OrderScreen = () => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);
  const [userId, setUserId] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('card'); // default payment method
  const isFocused = useIsFocused();

  useEffect(() => {
    const fetchCartData = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('token');
        const storedUserId = await AsyncStorage.getItem('userId');
        setToken(storedToken);
        setUserId(storedUserId);

        if (storedUserId && storedToken) {
          const response = await axios.get(`http://192.168.1.12:5000/carts/${storedUserId}`, {
            headers: { Authorization: `Bearer ${storedToken}` },
          });
          setCart(response.data.products);
          console.log('Cart products:', response.data.products);
        }
      } catch (error) {
        console.error('Error fetching cart:', error);
        showNotification('Error', 'Failed to load cart data.');
      } finally {
        setLoading(false);
      }
    };

    if (isFocused) {
      fetchCartData();
    }
  }, [isFocused]);

  const placeOrder = async () => {
    console.log('Placing order...'); // Debugging
    try {
      if (cart.length === 0) {
        console.log('Cart is empty'); // Debugging
        showNotification('Info', 'Your cart is empty. Add products to place an order.');
        return;
      }

      const totalPrice = cart.reduce((sum, item) => {
        const price = typeof item.product.price === 'number' ? item.product.price : 0;
        const quantity = typeof item.quantity === 'number' ? item.quantity : 1;
        return sum + price * quantity;
      }, 0);

      console.log('Total price calculated:', totalPrice); // Debugging

      const response = await axios.post(
        'http://192.168.1.12:5000/orders',
        {
          user: userId,
          products: cart.map((item) => ({ product: item._id, quantity: item.quantity })),
          totalPrice,
          paymentMethod,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log('Order response:', response.data); // Debugging

      showNotification(
        'Success',
        `Order placed successfully! Payment method: ${paymentMethod}.`
      );

      await axios.post(
        'http://192.168.1.12:5000/carts/clear',
        { user: userId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCart([]);
    } catch (error) {
      console.error('Error placing order:', error); // Debugging
      showNotification('Error', 'Failed to place order. Please try again.');
    }
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#880e4f" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Your Cart</Text>
      {cart.length > 0 ? (
        <>
          <FlatList
            data={cart}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => {
              const price = typeof item.product.price === 'number' ? item.product.price : 0;
              const quantity = typeof item.quantity === 'number' ? item.quantity : 1;
              const totalItemPrice = price * quantity;

              return (
                <View style={styles.cartItem}>
                  <Text style={styles.productName}>{item.product.name || 'Unnamed Product'}</Text>
                  <Text style={styles.quantity}>Quantity: {quantity}</Text>
                  <Text style={styles.price}>
                    Price: ${price.toFixed(2)} — Total: ${totalItemPrice.toFixed(2)}
                  </Text>
                </View>
              );
            }}
          />

          {/* Payment Method Card */}
          <View style={styles.paymentCard}>
            <Text style={styles.paymentHeading}>Select Payment Method</Text>
            <TouchableOpacity
              style={[
                styles.paymentOption,
                paymentMethod === 'card' && styles.paymentOptionSelected,
              ]}
              onPress={() => setPaymentMethod('card')}
            >
              <Text
                style={[
                  styles.paymentOptionText,
                  paymentMethod === 'card' && styles.paymentOptionTextSelected,
                ]}
              >
                Pay by Card
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.paymentOption,
                paymentMethod === 'cash' && styles.paymentOptionSelected,
              ]}
              onPress={() => setPaymentMethod('cash')}
            >
              <Text
                style={[
                  styles.paymentOptionText,
                  paymentMethod === 'cash' && styles.paymentOptionTextSelected,
                ]}
              >
                Pay by Cash
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.orderButton} onPress={placeOrder}>
            <Text style={styles.orderButtonText}>Place Order</Text>
          </TouchableOpacity>
        </>
      ) : (
        <Text style={styles.emptyCartText}>Your cart is empty.</Text>
      )}

      <Toast position="bottom" />
    </View>
  );
};

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fce4ec',
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fce4ec',
  },
  heading: {
    fontSize: 26,
    fontWeight: '700',
    color: '#880e4f',
    marginBottom: 20,
  },
  cartItem: {
    padding: 15,
    borderWidth: 1,
    borderColor: '#880e4f',
    borderRadius: 8,
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  productName: {
    fontSize: 18,
    fontWeight: '600',
  },
  quantity: {
    marginTop: 5,
    color: '#444',
  },
  price: {
    marginTop: 5,
    color: '#880e4f',
    fontWeight: '700',
  },
  emptyCartText: {
    fontSize: 16,
    color: '#880e4f',
    textAlign: 'center',
    marginTop: 20,
  },
  orderButton: {
    backgroundColor: '#880e4f',
    padding: 15,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 20,
  },
  orderButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },

  paymentCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    marginVertical: 20,
    borderColor: '#880e4f',
    borderWidth: 2,
  },
  paymentHeading: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 15,
    color: '#880e4f',
  },
  paymentOption: {
    padding: 15,
    borderRadius: 10,
    borderColor: '#880e4f',
    borderWidth: 1,
    marginBottom: 12,
  },
  paymentOptionSelected: {
    backgroundColor: '#880e4f',
  },
  paymentOptionText: {
    color: '#880e4f',
    fontSize: 16,
    fontWeight: '600',
  },
  paymentOptionTextSelected: {
    color: '#fff',
  },
});

export default OrderScreen;
