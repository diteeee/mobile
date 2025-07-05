import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  StyleSheet,
  Platform,
} from 'react-native';
import axios from 'axios';
import { useRouter } from 'expo-router';
import Toast from 'react-native-toast-message';

const ForgotPasswordScreen = () => {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const [tokenDigits, setTokenDigits] = useState(['', '', '', '', '', '']);
  const inputsRef = useRef([]);

  const handleDigitChange = (text, index) => {
    if (text.length > 1) return; // only one digit per box
    const newTokenDigits = [...tokenDigits];
    newTokenDigits[index] = text;
    setTokenDigits(newTokenDigits);

    // auto-focus next input if input not empty and not last box
    if (text && index < 5) {
      inputsRef.current[index + 1].focus();
    }
    // if deleting and empty, focus previous
    else if (!text && index > 0) {
      inputsRef.current[index - 1].focus();
    }
  };

  const resetToken = tokenDigits.join('');
  const [step, setStep] = useState(1);

  const handleRequestReset = async () => {
    if (!email) {
      Toast.show({ type: 'error', text1: 'Error', text2: 'Please enter your email.' });
      return;
    }
    try {
      setLoading(true);
      await axios.post('http://192.168.1.2:5000/users/request-password-reset', { email });
      Toast.show({ type: 'success', text1: 'Success', text2: 'Reset code sent to your email.' });
      setStep(2);
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error.response?.data?.message || 'An error occurred. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyToken = async () => {
    if (!resetToken) {
      Toast.show({ type: 'error', text1: 'Error', text2: 'Please enter the reset token.' });
      return;
    }

    try {
      setLoading(true);
      // Call your backend verify-token endpoint (make sure it exists)
      await axios.post('http://192.168.1.2:5000/users/verify-token', { token: resetToken });
      Toast.show({ type: 'success', text1: 'Success', text2: 'Token verified. Please reset your password.' });
      setStep(3);
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error.response?.data?.message || 'Invalid or expired token.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!newPassword || !confirmNewPassword) {
      Toast.show({ type: 'error', text1: 'Error', text2: 'Please fill all password fields.' });
      return;
    }
    if (newPassword !== confirmNewPassword) {
      Toast.show({ type: 'error', text1: 'Error', text2: 'Passwords do not match.' });
      return;
    }

    try {
      setLoading(true);
      await axios.post('http://192.168.1.2:5000/users/reset-password', {
        token: resetToken,
        newPassword,
      });
      Toast.show({ type: 'success', text1: 'Success', text2: 'Password reset successfully.' });
      router.push('/signin');
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error.response?.data?.message || 'An error occurred. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      {/* Step 1: Request reset code */}
      {step === 1 && (
        <>
          <Text style={styles.title}>Request Password Reset</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your email"
            placeholderTextColor="#b88fb8"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />
          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleRequestReset}
            disabled={loading}
          >
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Request Reset Code</Text>}
          </TouchableOpacity>
        </>
      )}

      {/* Step 2: Verify token */}
      {step === 2 && (
        <>
          <Text style={styles.title}>Verify Reset Code</Text>
          <View style={styles.tokenContainer}>
            {tokenDigits.map((digit, index) => (
              <TextInput
                key={index}
                ref={el => (inputsRef.current[index] = el)}
                style={styles.tokenInput}
                keyboardType="number-pad"
                maxLength={1}
                value={digit}
                onChangeText={text => handleDigitChange(text, index)}
                autoFocus={index === 0}
                textAlign="center"
                returnKeyType="done"
              />
            ))}
          </View>
          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleVerifyToken}
            disabled={loading}
          >
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Verify Code</Text>}
          </TouchableOpacity>
        </>
      )}

      {/* Step 3: Reset password */}
      {step === 3 && (
        <>
          <Text style={styles.title}>Reset Password</Text>
          <TextInput
            style={styles.input}
            placeholder="New password"
            placeholderTextColor="#b88fb8"
            secureTextEntry
            value={newPassword}
            onChangeText={setNewPassword}
          />
          <TextInput
            style={styles.input}
            placeholder="Confirm new password"
            placeholderTextColor="#b88fb8"
            secureTextEntry
            value={confirmNewPassword}
            onChangeText={setConfirmNewPassword}
          />
          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleResetPassword}
            disabled={loading}
          >
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Reset Password</Text>}
          </TouchableOpacity>
        </>
      )}

      <Toast />
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
    fontSize: 24,
    fontWeight: '700',
    color: '#880e4f',
    marginBottom: 20,
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
  },
  button: {
    backgroundColor: '#880e4f',
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonDisabled: {
    backgroundColor: '#a97ca0',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  tokenContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  tokenInput: {
    backgroundColor: '#f8bbd0',
    borderRadius: 10,
    width: 40,
    height: 50,
    fontSize: 24,
    color: '#4a148c',
    textAlign: 'center',
  },
});

export default ForgotPasswordScreen;
