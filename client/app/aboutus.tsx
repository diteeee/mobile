import React from 'react';
import { useNavigation } from '@react-navigation/native';
import AboutScreen from '../screens/AboutScreen';

export default function About() {
  const navigation = useNavigation();
  return <AboutScreen navigation={navigation} />;
}
