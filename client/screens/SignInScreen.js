import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import axios from 'axios';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { showNotification } from '../utils/PushNotificationConfig';
import Toast from 'react-native-toast-message';

const SignInScreen = () => {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    if (!email || !password) {
      Toast.show({
        type: 'error',
        text1: 'Please fill out all the fields.',
      });
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post('http://192.168.1.2:5000/users/login', {
        email,
        password,
      });

      const { token, user } = response.data;

      await AsyncStorage.setItem('token', token);
      await AsyncStorage.setItem('userId', user.id);

      Alert.alert('Success', 'You are now signed in!');
      showNotification('Welcome', 'You have successfully signed in.');
      router.push('/');
    } catch (error) {
      Alert.alert(
        'Login Failed',
        error.response?.data?.message || 'An error occurred. Please try again.'
      );
      showNotification('Error', 'Failed to login.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <Text style={styles.title}>Welcome Back 💄</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#b88fb8"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#b88fb8"
        secureTextEntry
        autoCapitalize="none"
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleSignIn}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Sign In</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push('/forgotpassword')} style={styles.forgotPasswordBtn}>
        <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push('/signup')} style={styles.signupBtn}>
        <Text style={styles.signupText}>Don't have an account? <Text style={{fontWeight: 'bold'}}>Sign Up</Text></Text>
      </TouchableOpacity>
      <Toast position="bottom" /> 
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fce4ec',
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#880e4f',
    marginBottom: 30,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#f8bbd0',
    borderRadius: 25,
    paddingVertical: 14,
    paddingHorizontal: 20,
    fontSize: 16,
    marginBottom: 20,
    color: '#4a148c',
    shadowColor: '#ad1457',
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 5 },
    elevation: 5,
  },
  button: {
    backgroundColor: '#880e4f',
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#4a148c',
    shadowOpacity: 0.7,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 7,
  },
  buttonDisabled: {
    backgroundColor: '#a97ca0',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  signupBtn: {
    marginTop: 25,
    alignItems: 'center',
  },
  signupText: {
    color: '#880e4f',
    fontSize: 15,
  },
  forgotPasswordBtn: {
  marginTop: 15,
  alignItems: 'center',
  },
  forgotPasswordText: {
    color: '#880e4f',
    fontSize: 15,
    textDecorationLine: 'underline',
  },
});

export default SignInScreen;
