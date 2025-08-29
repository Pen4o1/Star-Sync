import DeviceInfo from 'react-native-device-info';

/**
 * Get device-unique ID (per device / per install)
 */
export async function getUid(): Promise<string> {
  try {

    return DeviceInfo.getUniqueId(); 
  } catch (err) {
    console.warn('UID error:', err);
    return Math.random().toString(36).substring(2);
  }
}
