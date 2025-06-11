import { Platform } from 'react-native';
import PushNotification from 'react-native-push-notification';
import Toast from 'react-native-toast-message';

export const showNotification = (title, message) => {
  if (Platform.OS === 'android' || Platform.OS === 'ios') {
    PushNotification.localNotification({
      channelId: 'test-channel',
      title,
      message,
    });
  } else {
    // Optionally, show a web fallback e.g. alert or toast for web
    Toast.show({
      type: 'info',
      text1: title,
      text2: message,
    });
  }
};
