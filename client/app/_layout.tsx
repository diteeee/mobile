import React, { useState, useRef } from 'react';
import { Stack, useRouter } from 'expo-router';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Pressable,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

const MenuItem = ({ label, route, closeMenu }) => {
  const router = useRouter();

  const handleNavigation = () => {
    closeMenu();
    router.push(route);
  };

  return (
    <Pressable onPress={handleNavigation} style={styles.menuItem}>
      <Text style={styles.menuItemText}>{label}</Text>
    </Pressable>
  );
};

export default function RootLayout() {
  const [menuVisible, setMenuVisible] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, right: 16 });
  const iconRef = useRef(null);

  const menuOptions = [
    { label: 'Home', route: '/' },
    { label: 'Sign In', route: '/signin' },
    { label: 'Sign Up', route: '/signup' },
  ];

  const handleIconLayout = () => {
    iconRef.current.measureInWindow((x, y, width, height) => {
      setDropdownPosition({ top: y + height, right: 16 });
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Navbar */}
      <View style={styles.navbar}>
        <Text style={styles.navbarTitle}>My App</Text>
        <TouchableOpacity
          ref={iconRef}
          onPress={() => {
            handleIconLayout();
            setMenuVisible((v) => !v);
          }}
        >
          <MaterialIcons name="more-vert" size={28} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* This overlay closes menu if you tap anywhere outside */}
      {menuVisible && (
        <Pressable
          style={StyleSheet.absoluteFill}
          onPress={() => setMenuVisible(false)}
        />
      )}

      {/* Dropdown Menu */}
      {menuVisible && (
        <View style={[styles.dropdownMenu, { top: dropdownPosition.top, right: dropdownPosition.right }]}>
          <FlatList
            data={menuOptions}
            keyExtractor={(item) => item.route}
            renderItem={({ item }) => (
              <MenuItem
                label={item.label}
                route={item.route}
                closeMenu={() => setMenuVisible(false)}
              />
            )}
          />
        </View>
      )}

      {/* Main Stack */}
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
    backgroundColor: '#ffcdf5', // navbar bg match
  },
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#ffcdf5', // purple navbar
  },
  navbarTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
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
    zIndex: 1000,
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
});
