import React from 'react';
import { useNavigation } from '@react-navigation/native';
import SignInScreen from '../screens/SignInScreen';

export default function SignIn() {
  const navigation = useNavigation();
  return <SignInScreen navigation={navigation} />;
}
