import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Toast from 'react-native-toast-message';
import HomeScreen from './screens/HomeScreen';
import WishlistScreen from './screens/WishlistScreen';
import SignInScreen from './screens/SignInScreen';
import SignUpScreen from './screens/SignUpScreen';
import YourReviewsScreen from './screens/YourReviewsScreen';
import Footer from './components/Footer';
import PushNotification from "react-native-push-notification";

const Stack = createStackNavigator();

export default function App() {
  useEffect(() => {
    // Create channel once on app mount
    PushNotification.createChannel(
      {
        channelId: 'test-channel',
        channelName: 'Test Channel',
        channelDescription: 'A channel for testing notifications',
        importance: 4,
        vibrate: true,
      },
      (created) => console.log(`createChannel returned '${created}'`)
    );

    PushNotification.configure({
      onNotification: function (notification) {
        console.log('NOTIFICATION:', notification);
      },
      // Only request permissions automatically on iOS
      requestPermissions: Platform.OS === 'ios',
    });

    // Example toast just to show app started
    Toast.show({
      type: 'success',
      text1: 'Toast Test',
      text2: 'This is a test toast message',
    });
  }, []);
  
  useEffect(() => {
    Toast.show({
      type: 'success',
      text1: 'Toast Test',
      text2: 'This is a test toast message',
    });
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: '#ffcdf5' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' },
        }}
      >
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Wishlist" component={WishlistScreen} />
        <Stack.Screen name="SignIn" component={SignInScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
        <Stack.Screen name="YourReviews" component={YourReviewsScreen} />
      </Stack.Navigator>
      <Toast />
      <Footer />
    </NavigationContainer>
  );
}
