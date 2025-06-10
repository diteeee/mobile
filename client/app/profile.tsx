import React from 'react';
import { useNavigation } from '@react-navigation/native';
import ProfileScreen from '../screens/ProfileScreen';

export default function Profile() {
  const navigation = useNavigation();
  return <ProfileScreen navigation={navigation} />;
}