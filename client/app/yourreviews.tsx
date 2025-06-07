import React from 'react';
import { useNavigation } from '@react-navigation/native';
import YourReviewsScreen from '../screens/YourReviewsScreen';

export default function YourReviews() {
  const navigation = useNavigation();
  return <YourReviewsScreen navigation={navigation} />;
}
