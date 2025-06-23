import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useRouter } from 'expo-router';
import { showNotification } from '../utils/PushNotificationConfig';

const ProfileScreen = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    email: '',
  });
  const router = useRouter();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (!token) {
          Alert.alert('Error', 'You are not logged in.');
          return;
        }

        const response = await axios.get('http://192.168.1.5:5000/users/me', {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUser(response.data);
        setFormData({
          name: response.data.name,
          surname: response.data.surname,
          email: response.data.email,
        });
      } catch (error) {
        console.error('Error fetching user profile:', error);
        showNotification('Error', 'Failed to load profile.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const handleSaveProfile = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await axios.put(
        'http://192.168.1.5:5000/users/me',
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setUser(response.data.user);
      showNotification('Success', 'Profile updated successfully.');
      setEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      showNotification('Error', 'Failed to update profile.');
    }
  };

  const handleLogout = async () => {
    await AsyncStorage.clear();
    showNotification('Logged Out', 'You have been logged out successfully.');
    router.push('/');
  };

  const handleDeleteAccount = () => {
    const confirmDeletion = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        await axios.delete('http://192.168.1.5:5000/users/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        await AsyncStorage.clear();
        showNotification('Account Deleted', 'Your account has been deleted.');
        router.push('/');
      } catch (error) {
        console.error('Error deleting account:', error);
        showNotification('Error', 'Failed to delete account.');
      }
    };

    if (Platform.OS === 'web') {
      const isConfirmed = window.confirm(
        'Do you really want to delete your account? This action cannot be undone.'
      );
      if (isConfirmed) {
        confirmDeletion();
      }
    } else {
      Alert.alert(
        'Confirm Deletion',
        'Do you really want to delete your account? This action cannot be undone.',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Delete',
            style: 'destructive',
            onPress: confirmDeletion,
          },
        ],
        { cancelable: true }
      );
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#d6336c" />
        <Text style={styles.loadingText}>Loading your profile...</Text>
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.messageText}>
          Failed to load profile. Please try again.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>My Profile</Text>
      <View style={styles.profileCard}>
        <Text style={styles.label}>Name:</Text>
        {editing ? (
          <TextInput
            style={styles.input}
            value={formData.name}
            onChangeText={(text) => setFormData({ ...formData, name: text })}
            placeholder="Your fabulous name"
            placeholderTextColor="#d4a5b1"
          />
        ) : (
          <Text style={styles.value}>{user.name}</Text>
        )}

        <Text style={styles.label}>Surname:</Text>
        {editing ? (
          <TextInput
            style={styles.input}
            value={formData.surname}
            onChangeText={(text) => setFormData({ ...formData, surname: text })}
            placeholder="Your lovely surname"
            placeholderTextColor="#d4a5b1"
          />
        ) : (
          <Text style={styles.value}>{user.surname}</Text>
        )}

        <Text style={styles.label}>Email:</Text>
        {editing ? (
          <TextInput
            style={styles.input}
            value={formData.email}
            onChangeText={(text) => setFormData({ ...formData, email: text })}
            keyboardType="email-address"
            placeholder="you@example.com"
            placeholderTextColor="#d4a5b1"
          />
        ) : (
          <Text style={styles.value}>{user.email}</Text>
        )}
      </View>

      {editing ? (
        <TouchableOpacity style={styles.saveButton} onPress={handleSaveProfile}>
          <Text style={styles.saveButtonText}>Save Changes</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => setEditing(true)}
        >
          <Text style={styles.editButtonText}>Edit Profile</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity
        style={styles.editButton}
        onPress={() => router.push('/yourreviews')}
      >
        <Text style={styles.editButtonText}>My Reviews</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Log Out</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteAccount}>
        <Text style={styles.deleteButtonText}>Delete Account</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'linear-gradient(135deg, #fce4ec, #f8bbd0)',
    paddingTop: 20,
    paddingHorizontal: 25,
    backgroundColor: '#ffe6f0',
  },
  heading: {
    fontSize: 30,
    fontWeight: '900',
    color: '#ad1457',
    textAlign: 'center',
    marginBottom: 25,
    fontFamily: 'Cochin',
    textShadowColor: '#f48fb1',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 5,
  },
  profileCard: {
    backgroundColor: '#fff0f6',
    borderRadius: 20,
    padding: 25,
    shadowColor: '#f48fb1',
    shadowOpacity: 0.5,
    shadowRadius: 15,
    shadowOffset: { width: 0, height: 6 },
    elevation: 10,
    marginBottom: 30,
  },
  label: {
    fontSize: 16,
    color: '#880e4f',
    fontWeight: '700',
    marginBottom: 6,
    letterSpacing: 0.7,
  },
  value: {
    fontSize: 19,
    color: '#4a148c',
    marginBottom: 18,
    fontWeight: '600',
    fontFamily: 'Georgia',
  },
  input: {
    fontSize: 18,
    color: '#880e4f',
    marginBottom: 18,
    borderWidth: 1.8,
    borderColor: '#f48fb1',
    borderRadius: 15,
    padding: 12,
    backgroundColor: '#fff0f6',
    fontWeight: '600',
    shadowColor: '#f8bbd0',
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  editButton: {
    backgroundColor: '#d81b60',
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 35,
    alignItems: 'center',
    marginBottom: 15,
    shadowColor: '#f48fb1',
    shadowOpacity: 0.6,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
  },
  editButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '800',
    fontFamily: 'Cochin',
  },
  saveButton: {
    backgroundColor: '#ce93d8',
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 35,
    alignItems: 'center',
    marginBottom: 15,
    shadowColor: '#ba68c8',
    shadowOpacity: 0.6,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
  },
  saveButtonText: {
    color: '#4a148c',
    fontSize: 20,
    fontWeight: '800',
    fontFamily: 'Cochin',
  },
  logoutButton: {
    backgroundColor: '#f48fb1',
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 35,
    alignItems: 'center',
    marginBottom: 15,
    shadowColor: '#ec407a',
    shadowOpacity: 0.5,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
  },
  logoutButtonText: {
    color: '#880e4f',
    fontSize: 20,
    fontWeight: '700',
    fontFamily: 'Cochin',
  },
  deleteButton: {
    backgroundColor: '#880e4f',
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 35,
    alignItems: 'center',
    shadowColor: '#4a148c',
    shadowOpacity: 0.7,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
    fontFamily: 'Cochin',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffe6f0',
  },
  loadingText: {
    marginTop: 15,
    fontSize: 16,
    color: '#ad1457',
    fontWeight: '600',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
    backgroundColor: '#ffe6f0',
  },
  messageText: {
    fontSize: 18,
    color: '#ad1457',
    fontWeight: '700',
    textAlign: 'center',
  },
});

export default ProfileScreen;
