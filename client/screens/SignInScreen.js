import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Button, Alert } from 'react-native';
import axios from 'axios';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SignInScreen = () => {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill out all fields.');
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post('http://192.168.1.14:5000/users/login', {
        email,
        password,
      });

      const { token, user } = response.data;

      console.log('Token:', token);
      console.log('User:', user);

      // Save token in AsyncStorage
      await AsyncStorage.setItem('token', token);

      Alert.alert('Success', 'You are now signed in!');
      router.push('/');
    } catch (error) {
      console.error('Login error:', error.response?.data || error.message);
      Alert.alert(
        'Login Failed',
        error.response?.data?.message || 'An error occurred. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign In</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        autoCapitalize="none"
        value={password}
        onChangeText={setPassword}
      />
      <Button
        title={loading ? 'Signing In...' : 'Sign In'}
        onPress={handleSignIn}
        disabled={loading}
      />
      <Button
        title="Sign Up"
        onPress={() => router.push('/signup')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', paddingHorizontal: 20, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  input: { width: '100%', padding: 10, marginBottom: 15, borderWidth: 1, borderColor: '#ccc', borderRadius: 5, backgroundColor: '#f9f9f9' },
});

export default SignInScreen;
