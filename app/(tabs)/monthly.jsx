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
import { ZODIAC_SIGNS } from '../../constants/zodiacData'
import { getMonthlyHoroscope } from '../../services/horoscopeApi'

export default function MonthlyHoroscopeScreen() {
  const [selectedSign, setSelectedSign] = useState(1)
  const [horoscope, setHoroscope] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeSection, setActiveSection] = useState('Overview')

  useEffect(() => {
    fetchHoroscope()
  }, [selectedSign])

  const fetchHoroscope = async () => {
    try {
      setLoading(true)
      const data = await getMonthlyHoroscope(selectedSign)
      setHoroscope(data)
    } catch (error) {
      console.error('Error fetching monthly horoscope:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSignSelect = (signId) => {
    setSelectedSign(signId)
  }

  const toggleSection = (sectionName) => {
    setActiveSection(sectionName)
  }

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#1a1a1a', '#2a2a2a']} style={styles.gradient}>
        <ScrollView style={styles.scrollView}>
          <Text style={styles.title}>Monthly Horoscope</Text>

          <View style={styles.signsContainer}>
            {ZODIAC_SIGNS.map((sign) => (
              <TouchableOpacity
                key={sign.id}
                style={[
                  styles.signButton,
                  selectedSign === sign.id && styles.selectedSign,
                ]}
                onPress={() => handleSignSelect(sign.id)}
              >
                <Text style={styles.signSymbol}>{sign.symbol}</Text>
                <Text style={styles.signName}>{sign.name}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#FFAA1E" />
              <Text style={styles.loadingText}>
                Loading your monthly horoscope...
              </Text>
            </View>
          ) : horoscope ? (
            <View style={styles.horoscopeContainer}>
              <Text style={styles.date}>{horoscope.date}</Text>
              <Text style={styles.signName}>{horoscope.sign_name}</Text>

              <View style={styles.sectionsContainer}>
                {horoscope.horoscopes.map((section) => (
                  <TouchableOpacity
                    key={section.name}
                    style={[
                      styles.sectionButton,
                      activeSection === section.name &&
                        styles.activeSectionButton,
                    ]}
                    onPress={() => toggleSection(section.name)}
                  >
                    <Text
                      style={[
                        styles.sectionButtonText,
                        activeSection === section.name &&
                          styles.activeSectionButtonText,
                      ]}
                    >
                      {section.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <View style={styles.sectionContent}>
                {horoscope.horoscopes
                  .filter((section) => section.name === activeSection)
                  .map((section) => (
                    <Text key={section.name} style={styles.horoscopeText}>
                      {section.text}
                    </Text>
                  ))}
              </View>

              <View style={styles.navigationContainer}>
                <TouchableOpacity
                  style={styles.navButton}
                  onPress={() => {
                    const currentIndex = horoscope.horoscopes.findIndex(
                      (s) => s.name === activeSection
                    )
                    const prevIndex =
                      currentIndex > 0
                        ? currentIndex - 1
                        : horoscope.horoscopes.length - 1
                    setActiveSection(horoscope.horoscopes[prevIndex].name)
                  }}
                >
                  <Text style={styles.navButtonText}>Previous</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.navButton}
                  onPress={() => {
                    const currentIndex = horoscope.horoscopes.findIndex(
                      (s) => s.name === activeSection
                    )
                    const nextIndex =
                      currentIndex < horoscope.horoscopes.length - 1
                        ? currentIndex + 1
                        : 0
                    setActiveSection(horoscope.horoscopes[nextIndex].name)
                  }}
                >
                  <Text style={styles.navButtonText}>Next</Text>
                </TouchableOpacity>
              </View>
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
  signsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    padding: 10,
  },
  signButton: {
    width: 80,
    height: 80,
    margin: 5,
    borderRadius: 40,
    backgroundColor: '#333',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedSign: {
    backgroundColor: '#FFAA1E',
  },
  signSymbol: {
    fontSize: 24,
    color: '#fff',
  },
  signName: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 15,
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
  sectionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 15,
    flexWrap: 'wrap',
  },
  sectionButton: {
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#333',
    marginBottom: 10,
    minWidth: '48%',
    alignItems: 'center',
  },
  activeSectionButton: {
    backgroundColor: '#FFAA1E',
  },
  sectionButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  activeSectionButtonText: {
    color: '#000',
  },
  sectionContent: {
    marginTop: 10,
    padding: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: 5,
  },
  navigationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  navButton: {
    backgroundColor: '#FFAA1E',
    padding: 10,
    borderRadius: 5,
    minWidth: 100,
    alignItems: 'center',
  },
  navButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
})
