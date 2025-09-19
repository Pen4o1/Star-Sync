import React, { useEffect, useState, useContext } from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { getChineseDailyHoroscope } from '../../services/horoscopeApi'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { getUserChineseZodiac } from '../../constants/userData'
import SubscriptionContext from '../../context/SubscriptionContext'
import { useRouter } from 'expo-router'

export default function ChineseHoroscope() {
  const [horoscope, setHoroscope] = useState(null)
  const [loading, setLoading] = useState(true)
  const [userBirthdate, setUserBirthdate] = useState(null)
  const [chineseZodiacId, setChineseZodiacId] = useState(null)
  const subscription = useContext(SubscriptionContext)
  const isSubscribed = !!subscription?.isSubscribed
  const openPaywall = subscription?.openPaywall
  const router = useRouter()

  const fetchHoroscope = async () => {
    try {
      if (!chineseZodiacId || !isSubscribed) return
      setLoading(true)
      const today = new Date().toISOString().split('T')[0]
      const data = await getChineseDailyHoroscope(chineseZodiacId, today)
      setHoroscope(data)
    } catch (error) {
      console.error('Error fetching Chinese horoscope:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const loadUserData = async () => {
      const birthdate = await AsyncStorage.getItem('userBirthDate')
      setUserBirthdate(birthdate)
      if (birthdate) {
        setChineseZodiacId(getUserChineseZodiac(birthdate))
      }
    }
    loadUserData()
  }, [])

  useEffect(() => {
    if (!chineseZodiacId) return
    if (!isSubscribed) return
    fetchHoroscope()
  }, [chineseZodiacId, isSubscribed])

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#1a1a1a', '#2a2a2a']} style={styles.gradient}>
        <ScrollView style={styles.scrollView}>
          <Text style={styles.title}>Your Chinese Horoscope</Text>

          {!isSubscribed && (
            <View style={{ paddingHorizontal: 16, paddingTop: 8, paddingBottom: 12, alignItems: 'center' }}>
              <TouchableOpacity
                onPress={() => openPaywall && openPaywall()}
                style={{ backgroundColor: '#FFAA1E', paddingVertical: 10, paddingHorizontal: 16, borderRadius: 8 }}
              >
                <Text style={{ color: '#000', fontWeight: 'bold', textAlign: 'center' }}>
                  Chinese Horoscope is a premium feature — Tap to upgrade 
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {isSubscribed && (loading ? (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>Loading...</Text>
            </View>
          ) : horoscope ? (
            <TouchableOpacity
              onPress={() => router.push('/chinese')}
              style={styles.horoscopeContainer}
              activeOpacity={0.8}
            >
              <Text style={styles.horoscopeText}>{horoscope.horoscope}</Text>
              <Text style={styles.tapHint}>Tap to view full Chinese horoscope</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>Failed to load horoscope</Text>
            </View>
          ))}
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFAA1E',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  animalContainer: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    margin: 10,
    borderRadius: 10,
  },
  animalName: {
    fontSize: 24,
    color: '#FFAA1E',
    fontWeight: 'bold',
    marginBottom: 5,
  },
  animalElement: {
    fontSize: 18,
    color: '#fff',
    marginBottom: 5,
  },
  birthdate: {
    color: '#FFAA1E',
    fontSize: 16,
  },
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
  },
  loadingText: {
    color: '#fff',
    fontSize: 16,
  },
  horoscopeContainer: {
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    margin: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 170, 30, 0.3)',
  },
  date: {
    color: '#FFAA1E',
    fontSize: 16,
    marginBottom: 10,
  },
  horoscopeText: {
    color: '#fff',
    fontSize: 18,
    lineHeight: 28,
  },
  errorContainer: {
    padding: 20,
    alignItems: 'center',
  },
  errorText: {
    color: '#ff4444',
    fontSize: 16,
  },
  tapHint: {
    color: '#FFAA1E',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
    fontStyle: 'italic',
  },
})
