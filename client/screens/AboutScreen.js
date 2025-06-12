import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const AboutScreen = () => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image
        source={{ uri: 'https://via.placeholder.com/300x150.png?text=Celestia+Logo' }}
        style={styles.logo}
      />
      <Text style={styles.heading}>Welcome to Celestia!</Text>
      <Text style={styles.description}>
        At **Celestia**, we celebrate individuality and creativity. Our shop is a haven for makeup 
        enthusiasts and beauty lovers, offering a wide range of products designed to make you feel 
        confident and radiant. Whether you’re exploring new trends or creating your signature look, 
        we’re here to support you on your journey.
      </Text>

      <Text style={styles.description}>
        Visit us at our cozy store in the heart of the city! Our friendly staff is always ready to 
        help you find the perfect products tailored to your needs.
      </Text>

      <View style={styles.workingHours}>
        <Text style={styles.subHeading}>Our Working Hours</Text>
        <Text style={styles.workingHoursText}>Monday - Friday: 9:00 AM - 7:00 PM</Text>
        <Text style={styles.workingHoursText}>Saturday: 10:00 AM - 6:00 PM</Text>
        <Text style={styles.workingHoursText}>Sunday: Closed</Text>
      </View>

      <Text style={styles.footerText}>
        Thank you for choosing Celestia. We can’t wait to see you in-store and be a part of your 
        beauty journey!
      </Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#ffeefc',
    padding: 20,
    alignItems: 'center',
  },
  logo: {
    width: width * 0.8,
    height: 120,
    borderRadius: 10,
    marginBottom: 20,
  },
  heading: {
    fontSize: 26,
    fontWeight: '700',
    color: '#d63384',
    marginBottom: 10,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#6f42c1',
    lineHeight: 24,
    textAlign: 'center',
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  workingHours: {
    width: width * 0.9,
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    marginBottom: 20,
  },
  subHeading: {
    fontSize: 20,
    fontWeight: '700',
    color: '#d63384',
    marginBottom: 10,
    textAlign: 'center',
  },
  workingHoursText: {
    fontSize: 16,
    color: '#6f42c1',
    lineHeight: 22,
    textAlign: 'center',
  },
  footerText: {
    fontSize: 16,
    color: '#d63384',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default AboutScreen;
