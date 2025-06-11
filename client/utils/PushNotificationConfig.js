import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import Toast from 'react-native-toast-message';

export const showNotification = async (title, message) => {
  if (Platform.OS === 'android' || Platform.OS === 'ios') {
    try {
      // Test fallback for Expo Go (replace trigger: null with a valid trigger in a standalone app)
      if (Platform.OS === 'ios' && !__DEV__) {
        // Only works in standalone builds, not in Expo Go
        await Notifications.scheduleNotificationAsync({
          content: {
            title,
            body: message,
          },
          trigger: null,
        });
      } else {
        Toast.show({
          type: 'info',
          text1: title,
          text2: message,
        });
      }
    } catch (error) {
      console.error('Notification error:', error);
    }
  } else if (Platform.OS === 'web') {
    // Web fallback using the Notification API
    if ("Notification" in window) {
      if (Notification.permission === "granted") {
        new Notification(title, { body: message });
      } else if (Notification.permission === "default") {
        Notification.requestPermission().then((permission) => {
          if (permission === "granted") {
            new Notification(title, { body: message });
          } else {
            Toast.show({
              type: 'info',
              text1: "Notification Permission Denied",
              text2: "Browser notifications are not enabled.",
            });
          }
        });
      } else {
        Toast.show({
          type: 'info',
          text1: "Notification Permission Denied",
          text2: "Browser notifications are not enabled.",
        });
      }
    } else {
      Toast.show({
        type: 'info',
        text1: "Notifications Not Supported",
        text2: "This browser does not support notifications.",
      });
    }
  } else {
    // Web fallback for unsupported platforms
    Toast.show({
      type: 'info',
      text1: title,
      text2: message,
    });
  }
};
