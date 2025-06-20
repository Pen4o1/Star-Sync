import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { ZODIAC_SIGNS } from '../../constants/zodiacData'
import {
  getDailyHoroscope,
  getWeeklyHoroscope,
  getYearlyHoroscope,
} from '../../services/horoscopeApi'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { getUserZodiacSign } from '../../constants/userData'
import HoroscopeSection from '../../components/DetailComponents/HoroscopeSection'

export default function DailyHoroscopeScreen() {
  const [horoscope, setHoroscope] = useState(null)
  const [loading, setLoading] = useState(true)
  const [birthdate, setBirthdate] = useState(null)
  const [zodiacId, setZodiacId] = useState(null)
  const [selectedPeriod, setSelectedPeriod] = useState('daily')

  useEffect(() => {
    const loadUserZodiac = async () => {
      try {
        const storedBirthdate = await AsyncStorage.getItem('userBirthDate')
        setBirthdate(storedBirthdate)
        if (storedBirthdate) {
          const zodiac = getUserZodiacSign(storedBirthdate)
          setZodiacId(zodiac)
        }
      } catch (error) {
        console.error('Error loading user birthdate:', error)
      }
    }
    loadUserZodiac()
  }, [])

  const fetchHoroscope = async () => {
    try {
      if (!zodiacId) return

      setLoading(true)
      let data = null

      const today = new Date().toISOString().split('T')[0]

      if (selectedPeriod === 'daily') {
        data = await getDailyHoroscope(zodiacId, today)
      } else if (selectedPeriod === 'weekly') {
        data = await getWeeklyHoroscope(zodiacId)
      } else if (selectedPeriod === 'yearly') {
        data = await getYearlyHoroscope(zodiacId)
      }

      setHoroscope(data)
    } catch (error) {
      console.error('Error fetching horoscope:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchHoroscope()
  }, [zodiacId, selectedPeriod])

  const userSign = ZODIAC_SIGNS.find((sign) => sign.id === zodiacId)

  const renderPeriodSelector = () => {
    const periods = ['daily', 'weekly', 'yearly']

    return (
      <View style={styles.periodSelector}>
        {periods.map((period) => (
          <TouchableOpacity
            key={period}
            style={[
              styles.periodButton,
              selectedPeriod === period && styles.selectedButton,
            ]}
            onPress={() => setSelectedPeriod(period)}
          >
            <Text
              style={[
                styles.periodButtonText,
                selectedPeriod === period && styles.selectedButtonText,
              ]}
            >
              {period.charAt(0).toUpperCase() + period.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#1a1a1a', '#2a2a2a']} style={styles.gradient}>
        <ScrollView style={styles.scrollView}>
          <Text style={styles.title}>Your {selectedPeriod} Horoscope</Text>

          {userSign && (
            <View style={styles.signContainer}>
              <Text style={styles.signSymbol}>{userSign.symbol}</Text>
              <Text style={styles.signName}>{userSign.name}</Text>
              <Text style={styles.birthdate}>Born on {birthdate}</Text>
            </View>
          )}

          {renderPeriodSelector()}

          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#FFAA1E" />
              <Text style={styles.loadingText}>Loading your horoscope...</Text>
            </View>
          ) : horoscope ? (
            <View style={styles.horoscopeContainer}>
              <Text style={styles.date}>{horoscope.date}</Text>

              {horoscope.horoscopes ? (
                horoscope.horoscopes.map((section) => (
                  <HoroscopeSection
                    key={section.name}
                    title={section.name}
                    text={section.text}
                  />
                ))
              ) : (
                <Text style={styles.singleText}>{horoscope.horoscope}</Text>
              )}
            </View>
          ) : (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>Failed to load horoscope</Text>
              <TouchableOpacity
                style={styles.retryButton}
                onPress={fetchHoroscope}
              >
                <Text style={styles.retryButtonText}>Retry</Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      </LinearGradient>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  gradient: { flex: 1 },
  scrollView: { flex: 1 },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFAA1E',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  signContainer: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    margin: 10,
    borderRadius: 10,
  },
  signSymbol: {
    fontSize: 48,
    color: '#FFAA1E',
    marginBottom: 10,
  },
  signName: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  birthdate: {
    color: '#FFAA1E',
    fontSize: 16,
  },
  periodSelector: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 10,
  },
  periodButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginHorizontal: 6,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  selectedButton: {
    backgroundColor: '#FFAA1E',
  },
  periodButtonText: {
    color: '#fff',
    fontSize: 14,
  },
  selectedButtonText: {
    color: '#000',
    fontWeight: 'bold',
  },
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 200,
  },
  loadingText: {
    color: '#fff',
    fontSize: 16,
    marginTop: 10,
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
    textAlign: 'center',
  },
  singleText: {
    color: '#fff',
    fontSize: 16,
    lineHeight: 24,
  },
  errorContainer: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 200,
  },
  errorText: {
    color: '#ff4444',
    fontSize: 16,
    marginBottom: 10,
  },
  retryButton: {
    backgroundColor: '#FFAA1E',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
})
