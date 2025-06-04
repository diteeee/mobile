import React from 'react';
import { useNavigation } from '@react-navigation/native';
import WishlistScreen from '../screens/WishlistScreen';

export default function Wishlist() {
  const navigation = useNavigation();
  return <WishlistScreen navigation={navigation} />;
}
