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
import { CHINESE_ZODIAC } from '../../constants/zodiacData'
import {
  getChineseDailyHoroscope,
  getChineseYearlyHoroscope,
  getChineseFullHoroscope,
} from '../../services/horoscopeApi'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { getUserChineseZodiac } from '../../constants/userData'

export default function ChineseHoroscopeScreen() {
  const [selectedAnimal, setSelectedAnimal] = useState(null)
  const [horoscope, setHoroscope] = useState(null)
  const [loading, setLoading] = useState(true)
  const [birthdate, setBirthdate] = useState(null)
  const [selectedPeriod, setSelectedPeriod] = useState('daily')

  useEffect(() => {
    const loadUserChinese = async () => {
      try {
        const storedBirthdate = await AsyncStorage.getItem('userBirthDate')
        setBirthdate(storedBirthdate)
        if (storedBirthdate) {
          const animalId = getUserChineseZodiac(storedBirthdate)
          setSelectedAnimal(animalId)
        }
      } catch (error) {
        console.error('Error loading user birthdate:', error)
      }
    }
    loadUserChinese()
  }, [])

  useEffect(() => {
    if (selectedAnimal) {
      fetchHoroscope()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedAnimal, selectedPeriod])

  const fetchHoroscope = async () => {
    try {
      setLoading(true)
      let data = null
      const today = new Date().toISOString().split('T')[0]
      if (selectedPeriod === 'daily') {
        data = await getChineseDailyHoroscope(selectedAnimal, today)
      } else if (selectedPeriod === 'yearly') {
        data = await getChineseYearlyHoroscope(selectedAnimal)
      } else if (selectedPeriod === 'full') {
        data = await getChineseFullHoroscope(selectedAnimal)
      }
      setHoroscope(data)
    } catch (error) {
      console.error('Error fetching Chinese horoscope:', error)
      setHoroscope(null)
    } finally {
      setLoading(false)
    }
  }

  const userAnimal = CHINESE_ZODIAC.find((animal) => animal.id === selectedAnimal)

  const renderPeriodSelector = () => {
    const periods = [
      { key: 'daily', label: 'Daily' },
      { key: 'yearly', label: 'Yearly' },
      { key: 'full', label: 'Full' },
    ]
    return (
      <View style={styles.periodSelector}>
        {periods.map((period) => (
          <TouchableOpacity
            key={period.key}
            style={[
              styles.periodButton,
              selectedPeriod === period.key && styles.selectedButton,
            ]}
            onPress={() => setSelectedPeriod(period.key)}
          >
            <Text
              style={[
                styles.periodButtonText,
                selectedPeriod === period.key && styles.selectedButtonText,
              ]}
            >
              {period.label}
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
          {userAnimal && (
            <View style={styles.animalCard}>
              <Text style={styles.animalSymbol}>{userAnimal.symbol}</Text>
              <Text style={styles.animalName}>{userAnimal.name}</Text>
              <Text style={styles.animalElement}>{userAnimal.element}</Text>
              <Text style={styles.animalYears}>{userAnimal.years}</Text>
              {birthdate && (
                <Text style={styles.birthdate}>Born on {birthdate}</Text>
              )}
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
              {horoscope.date && (
                <Text style={styles.date}>{horoscope.date}</Text>
              )}
              {selectedPeriod === 'full' && (
                <Text style={[styles.horoscopeText, {fontWeight: 'bold', marginBottom: 8}]}>Full Horoscope</Text>
              )}
              {Array.isArray(horoscope.horoscopes)
                ? horoscope.horoscopes.map((section, idx) => (
                    <View key={section.num || section.name || idx} style={{marginBottom: 12}}>
                      {section.name && (
                        <Text style={[styles.horoscopeText, {fontWeight: 'bold', marginBottom: 4}]}>{section.name}</Text>
                      )}
                      <Text style={styles.horoscopeText}>{section.text}</Text>
                    </View>
                  ))
                : <Text style={styles.horoscopeText}>{horoscope.horoscopes || horoscope.horoscope || horoscope.text}</Text>
              }
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
  animalCard: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    margin: 10,
    borderRadius: 10,
  },
  animalSymbol: {
    fontSize: 48,
    color: '#FFAA1E',
    marginBottom: 10,
    textAlign: 'center',
  },
  animalName: {
    fontSize: 28,
    color: '#FFAA1E',
    fontWeight: 'bold',
    marginBottom: 5,
  },
  animalElement: {
    color: '#fff',
    fontSize: 18,
    marginBottom: 5,
  },
  animalYears: {
    color: '#fff',
    fontSize: 14,
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
  horoscopeText: {
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
})
