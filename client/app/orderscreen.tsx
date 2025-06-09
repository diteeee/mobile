import React from 'react';
import { useNavigation } from '@react-navigation/native';
import OrderScreen from '../screens/OrderScreen';

export default function Order() {
  const navigation = useNavigation();
  return <OrderScreen navigation={navigation} />;
}