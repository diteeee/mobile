import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';

const PlaceOrderCard = ({ cartItems, onPlaceOrder }) => {
  const totalPrice = cartItems.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  );

  const handlePlaceOrder = () => {
    if (cartItems.length === 0) {
      Alert.alert('Error', 'Your cart is empty.');
      return;
    }

    onPlaceOrder(totalPrice);
  };

  const renderItem = ({ item }) => (
    <View style={styles.itemRow}>
      <Text style={styles.itemName}>{item.product.name}</Text>
      <Text style={styles.itemQuantity}>x{item.quantity}</Text>
      <Text style={styles.itemPrice}>
        ${item.product.price.toFixed(2)}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Review Your Order</Text>
      <FlatList
        data={cartItems}
        renderItem={renderItem}
        keyExtractor={(item) => item.product._id}
        contentContainerStyle={styles.list}
      />
      <View style={styles.totalRow}>
        <Text style={styles.totalText}>Total Price:</Text>
        <Text style={styles.totalPrice}>${totalPrice.toFixed(2)}</Text>
      </View>
      <TouchableOpacity style={styles.placeOrderButton} onPress={handlePlaceOrder}>
        <Text style={styles.buttonText}>Place Order</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginVertical: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  heading: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 16,
    textAlign: 'center',
    color: '#6200ea',
  },
  list: {
    marginBottom: 12,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#4a148c',
  },
  itemQuantity: {
    fontSize: 16,
    fontWeight: '500',
    color: '#8e24aa',
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1b5e20',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    marginTop: 12,
  },
  totalText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#4a148c',
  },
  totalPrice: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1b5e20',
  },
  placeOrderButton: {
    backgroundColor: '#880e4f',
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 16,
  },
  buttonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: '600',
  },
});

export default PlaceOrderCard;
