import React from 'react';
import { useNavigation } from '@react-navigation/native';
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';

export default function ForgotPassword() {
  const navigation = useNavigation();
  return <ForgotPasswordScreen navigation={navigation} />;
}
