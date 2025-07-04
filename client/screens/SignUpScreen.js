import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import axios from 'axios';
import { useRouter } from 'expo-router';
import { showNotification } from '../utils/PushNotificationConfig';
import Toast from 'react-native-toast-message';

const SignUpScreen = () => {
  const router = useRouter();

  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    if (!name || !surname || !email || !password) {
      Toast.show({
        type: 'error',
        text1: 'Please fill out all the fields.',
      });
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post('http://192.168.1.2:5000/users/register', {
        name,
        surname,
        email,
        password,
      });

      Alert.alert('Success', 'Registration successful! Please sign in.');
      showNotification('Success', 'You have successfully signed up!');
      router.push('/signin');
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'An error occurred. Please try again.';
      
      if (errorMessage === 'User with this email already exists.') {
        Toast.show({
        type: 'error',
        text1: 'User with this email already exists.'
      });
      } else {
        Toast.show({
        type: 'error',
        text1: 'Failed to register.'
      });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>Create Account</Text>

        <TextInput
          style={styles.input}
          placeholder="First Name"
          placeholderTextColor="#b88fb8"
          autoCapitalize="words"
          value={name}
          onChangeText={setName}
        />

        <TextInput
          style={styles.input}
          placeholder="Last Name"
          placeholderTextColor="#b88fb8"
          autoCapitalize="words"
          value={surname}
          onChangeText={setSurname}
        />

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
          onPress={handleSignUp}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Sign Up</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push('/signin')} style={styles.signupBtn}>
          <Text style={styles.signupText}>
            Already have an account? <Text style={{ fontWeight: 'bold' }}>Sign In</Text>
          </Text>
        </TouchableOpacity>
      </ScrollView>
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
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
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
});

export default SignUpScreen;
