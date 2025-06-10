import React, { useState, useEffect, useRef } from 'react';
import { Stack, useRouter } from 'expo-router';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Pressable,
  Dimensions,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const MenuItem = ({ label, onPress }) => (
  <Pressable onPress={onPress} style={styles.menuItem}>
    <Text style={styles.menuItemText}>{label}</Text>
  </Pressable>
);

export default function RootLayout() {
  const [menuVisible, setMenuVisible] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, right: 16 });
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const iconRef = useRef(null);
  const router = useRouter();
  const navigation = useNavigation();

  const checkToken = async () => {
    const token = await AsyncStorage.getItem('token');
    setIsLoggedIn(!!token);
  };

  useEffect(() => {
    // Initial token check
    checkToken();

    // Add a navigation event listener to re-check token
    const unsubscribe = navigation.addListener('focus', checkToken);

    return unsubscribe;
  }, [navigation]);

  const handleIconLayout = () => {
    iconRef.current.measureInWindow((x, y, width, height) => {
      setDropdownPosition({ top: y + height, right: 16 });
    });
  };

  const handleSignOut = async () => {
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('userId');
    setMenuVisible(false);
    setIsLoggedIn(false);
    router.push('/signin');
  };

  const menuOptions = [
  ...(isLoggedIn
    ? [
        {
          label: 'Wishlist',
          action: () => {
            setMenuVisible(false); // Close dropdown
            router.push('/wishlist');
          },
        },
        {
          label: 'Profile',
          action: () => {
            setMenuVisible(false); // Close dropdown
            router.push('/profile');
          },
        },
        {
          label: 'Sign Out',
          action: async () => {
            setMenuVisible(false); // Close dropdown
            await handleSignOut();
          },
        },
      ]
    : [
        {
          label: 'Sign In',
          action: () => {
            setMenuVisible(false); // Close dropdown
            router.push('/signin');
          },
        },
        {
          label: 'Sign Up',
          action: () => {
            setMenuVisible(false); // Close dropdown
            router.push('/signup');
          },
        },
      ]),
    ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.navbar}>
        <TouchableOpacity onPress={() => router.push('/')}>
          <Text style={styles.navbarTitle}>Celestia</Text>
        </TouchableOpacity>
        <TouchableOpacity
          ref={iconRef}
          onPress={() => {
            handleIconLayout();
            checkToken(); // Re-check token when menu is opened
            setMenuVisible((v) => !v);
          }}
        >
          <MaterialIcons name="more-vert" size={28} color="#fff" />
        </TouchableOpacity>
      </View>

      {menuVisible && (
        <Pressable
          style={styles.overlay}
          onPress={() => setMenuVisible(false)} // Close dropdown on outside touch
        />
      )}

      {/* Dropdown Menu */}
      {menuVisible && (
        <View
          style={[
            styles.dropdownMenu,
            { top: dropdownPosition.top, right: dropdownPosition.right },
          ]}
        >
          <FlatList
            data={menuOptions}
            keyExtractor={(item) => item.label}
            renderItem={({ item }) => (
              <MenuItem label={item.label} onPress={item.action} />
            )}
          />
        </View>
      )}

      <Stack
        screenOptions={{
          headerShown: false,
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#cd9faf',
  },
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#cd9faf',
  },
  navbarTitle: {
    color: '#fff',
    fontSize: 20,
    // fontWeight: 'bold',
  },
  dropdownMenu: {
    position: 'absolute',
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingVertical: 8,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    zIndex: 10,
    width: 160,
  },
  menuItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  menuItemText: {
    fontSize: 16,
    color: '#333',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    backgroundColor: 'transparent',
    zIndex: 5, // Ensure overlay is above other elements but below the menu
  },
});
