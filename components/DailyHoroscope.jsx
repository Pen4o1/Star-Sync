import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { ZODIAC_SIGNS } from '../constants/zodiacData'
import { getDailyHoroscope } from '../services/horoscopeApi'
import { USER_ZODIAC_SIGN_ID, USER_BIRTHDATE } from '../constants/userData'

export default function DailyHoroscope() {
  const [horoscope, setHoroscope] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isExpanded, setIsExpanded] = useState(false)

  useEffect(() => {
    fetchHoroscope()
  }, [])

  const fetchHoroscope = async () => {
    try {
      setLoading(true)
      const today = new Date().toISOString().split('T')[0]
      const data = await getDailyHoroscope(USER_ZODIAC_SIGN_ID, today)
      setHoroscope(data)
    } catch (error) {
      console.error('Error fetching daily horoscope:', error)
    } finally {
      setLoading(false)
    }
  }

  const userSign = ZODIAC_SIGNS.find(sign => sign.id === USER_ZODIAC_SIGN_ID)
  const overviewSection = horoscope?.horoscopes?.find(section => section.name === 'Overview')

  const toggleExpand = () => {
    setIsExpanded(!isExpanded)
  }

  const truncateText = (text, maxLength = 150) => {
    if (!text) return ''
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength) + '...'
  }

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#1a1a1a', '#2a2a2a']} style={styles.gradient}>
        <ScrollView style={styles.scrollView}>
          <Text style={styles.title}>Your Daily Horoscope</Text>

          <View style={styles.signContainer}>
            <Text style={styles.signSymbol}>{userSign.symbol}</Text>
            <Text style={styles.signName}>{userSign.name}</Text>
            <Text style={styles.birthdate}>Born on {USER_BIRTHDATE}</Text>
          </View>

          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#FFAA1E" />
              <Text style={styles.loadingText}>
                Loading your daily horoscope...
              </Text>
            </View>
          ) : horoscope && overviewSection ? (
            <View style={styles.horoscopeContainer}>
              <Text style={styles.date}>{horoscope.date}</Text>
              <Text style={styles.sectionTitle}>Overview</Text>
              <Text style={styles.horoscopeText}>
                {isExpanded ? overviewSection.text : truncateText(overviewSection.text)}
              </Text>
              <TouchableOpacity
                style={styles.viewMoreButton}
                onPress={toggleExpand}
              >
                <Text style={styles.viewMoreText}>
                  {isExpanded ? 'Show Less' : 'View More'}
                </Text>
              </TouchableOpacity>
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
    marginBottom: 5,
    textAlign: 'center',
  },
  sectionTitle: {
    color: '#FFAA1E',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  horoscopeText: {
    color: '#fff',
    fontSize: 16,
    lineHeight: 24,
  },
  viewMoreButton: {
    marginTop: 15,
    alignItems: 'center',
  },
  viewMoreText: {
    color: '#FFAA1E',
    fontSize: 16,
    fontWeight: 'bold',
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