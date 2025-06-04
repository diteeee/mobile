import React from 'react';
import { useNavigation } from '@react-navigation/native';
import CartScreen from '../screens/CartScreen';

export default function Cart() {
  const navigation = useNavigation();
  return <CartScreen navigation={navigation} />;
}
