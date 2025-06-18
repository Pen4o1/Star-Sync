import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { CHINESE_ZODIAC } from '../../constants/zodiacData'
import { getChineseDailyHoroscope } from '../../services/horoscopeApi'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { getUserChineseZodiac } from '../../constants/userData'

export default function ChineseHoroscope() {
  const [horoscope, setHoroscope] = useState(null)
  const [loading, setLoading] = useState(true)
  const [userBirthdate, setUserBirthdate] = useState(null)
  const [chineseZodiacId, setChineseZodiacId] = useState(null)

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
    const fetchHoroscope = async () => {
      try {
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
    fetchHoroscope()
  }, [chineseZodiacId])

  const userAnimal = CHINESE_ZODIAC.find(animal => animal.id === chineseZodiacId)

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#1a1a1a', '#2a2a2a']} style={styles.gradient}>
        <ScrollView style={styles.scrollView}>
          <Text style={styles.title}>Your Chinese Horoscope</Text>

          {userAnimal && (
            <View style={styles.animalContainer}>
              <Text style={styles.animalName}>{userAnimal.name}</Text>
              <Text style={styles.animalElement}>{userAnimal.element}</Text>
              <Text style={styles.birthdate}>Born on {userBirthdate}</Text>
            </View>
          )}

          {loading ? (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>Loading...</Text>
            </View>
          ) : horoscope ? (
            <View style={styles.horoscopeContainer}>
              <Text style={styles.date}>{horoscope.date}</Text>
              <Text style={styles.horoscopeText}>{horoscope.horoscope}</Text>
            </View>
          ) : (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>Failed to load horoscope</Text>
            </View>
          )}
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
  },
  date: {
    color: '#FFAA1E',
    fontSize: 16,
    marginBottom: 10,
  },
  horoscopeText: {
    color: '#fff',
    fontSize: 16,
    lineHeight: 24,
  },
  errorContainer: {
    padding: 20,
    alignItems: 'center',
  },
  errorText: {
    color: '#ff4444',
    fontSize: 16,
  },
})
