import React from 'react';
import { useNavigation } from '@react-navigation/native';
import ReviewScreen from '../screens/ReviewScreen';

export default function Review() {
  const navigation = useNavigation();
  return <ReviewScreen navigation={navigation} />;
}