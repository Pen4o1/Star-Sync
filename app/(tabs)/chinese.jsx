import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { router } from 'expo-router'
import { CHINESE_ZODIAC } from '../../constants/zodiacData'
import { getChineseDailyHoroscope } from '../../services/horoscopeApi'

export default function ChineseHoroscopeScreen() {
  const [selectedAnimal, setSelectedAnimal] = useState(1)
  const [horoscope, setHoroscope] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchHoroscope()
  }, [selectedAnimal])

  const fetchHoroscope = async () => {
    try {
      setLoading(true)
      const today = new Date().toISOString().split('T')[0]
      const data = await getChineseDailyHoroscope(selectedAnimal, today)
      setHoroscope(data)
    } catch (error) {
      console.error('Error fetching Chinese horoscope:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAnimalSelect = (animalId) => {
    setSelectedAnimal(animalId)
  }

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#1a1a1a', '#2a2a2a']} style={styles.gradient}>
        <ScrollView style={styles.scrollView}>
          <View style={styles.animalsContainer}>
            {CHINESE_ZODIAC.map((animal) => (
              <TouchableOpacity
                key={animal.id}
                style={[
                  styles.animalButton,
                  selectedAnimal === animal.id && styles.selectedAnimal,
                ]}
                onPress={() => handleAnimalSelect(animal.id)}
              >
                <Text style={styles.animalName}>{animal.name}</Text>
                <Text style={styles.animalElement}>{animal.element}</Text>
              </TouchableOpacity>
            ))}
          </View>

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
  animalsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    padding: 10,
  },
  animalButton: {
    width: 100,
    height: 100,
    margin: 5,
    borderRadius: 50,
    backgroundColor: '#333',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedAnimal: {
    backgroundColor: '#FFAA1E',
  },
  animalName: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
  animalElement: {
    fontSize: 12,
    color: '#fff',
    marginTop: 5,
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
