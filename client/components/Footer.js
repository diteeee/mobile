import React from 'react';
import { View, Text, TouchableOpacity, Linking, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

export default function Footer() {
  const router = useRouter();

  return (
    <View style={styles.footer}>

      <TouchableOpacity onPress={() => Linking.openURL('https://facebook.com')}>
        <Text style={styles.linkText}>Facebook</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => Linking.openURL('https://twitter.com')}>
        <Text style={styles.linkText}>Twitter</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    height: 60,
    backgroundColor: '#cd9faf',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '100%',
  },
  linkText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
