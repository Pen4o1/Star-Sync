import React from 'react'
import { View, StyleSheet, ScrollView, TouchableOpacity, Text, Alert } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import DailyHoroscope from '../../components/HomeComponents/DailyHoroscope'
import ChineseHoroscope from '../../components/HomeComponents/ChineseHoroscope'
import FeatureButtons from '../../components/HomeComponents/FeatureButtons'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { getEntitlements } from '../../services/horoscopeSubService'
import { restorePurchasesForUid } from '../../services/iapService';
import { getUid } from '../../services/uidService'

function formatApiError(err) {
  try {
    const status = err?.response?.status
    const data = err?.response?.data
    const message = err?.message || 'Unknown error'
    const body = data ? (typeof data === 'string' ? data : JSON.stringify(data, null, 2)) : ''
    return [
      status ? `Status: ${status}` : null,
      message ? `Message: ${message}` : null,
      body ? `Response: ${body}` : null,
    ].filter(Boolean).join('\n\n') || 'Unexpected error'
  } catch (_) {
    return String(err)
  }
}

export default function HomeScreen() {
  const handleTestEntitlements = async () => {
    try {
      // Use device UID to match restore behavior
      const deviceUid = await getUid()
      const result = await getEntitlements(deviceUid)
      Alert.alert('Entitlements', `${JSON.stringify(result, null, 2)}\n\nUID: ${deviceUid}`)
    } catch (err) {
      const details = formatApiError(err)
      const storedUid = await AsyncStorage.getItem('uid')
      Alert.alert('Entitlements Error', `${details}\n\nStored UID: ${storedUid || 'n/a'}`)
      console.warn('Entitlements error:', err, storedUid)
    }
  }

  const handleRestorePurchases = async () => {
    try {
      const uid = await getUid();
      const restored = await restorePurchasesForUid(uid);
      if (restored.length > 0) {
        Alert.alert('Success', `Restored purchases: ${restored.length}\n\nUID: ${uid}`);
      } else {
        Alert.alert('Info', 'No purchases found to restore.');
      }
    } catch (err) {
      const details = formatApiError(err)
      const uid = await getUid();
      console.warn(err);
      Alert.alert('Restore Error', `${details}\n\nUID: ${uid}`);
    }
  }

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#1a1a1a', '#2a2a2a']} style={styles.gradient}>
        <ScrollView style={styles.scrollView}>
          <DailyHoroscope />
          <ChineseHoroscope />
          <FeatureButtons />
          <TouchableOpacity style={styles.testButton} onPress={handleTestEntitlements}>
            <Text style={styles.testButtonText}>Test Entitlements</Text>
          </TouchableOpacity>
          {/* Restore Purchases Button */}
          <TouchableOpacity
              style={styles.restoreButton}
              onPress={handleRestorePurchases}
            >
              <Text style={styles.restoreButtonText}>Restore Purchases</Text>
            </TouchableOpacity>
        </ScrollView>
      </LinearGradient>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  testButton: {
    backgroundColor: '#6A5ACD',
    padding: 14,
    borderRadius: 16,
    alignItems: 'center',
    marginHorizontal: 16,
    marginVertical: 20,
  },
  testButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  restoreButton: {
    backgroundColor: '#FFAA1E',
    padding: 14,
    borderRadius: 16,
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 30,
  },
  restoreButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
}) 
