import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { ZODIAC_SIGNS } from '../../constants/zodiacData';
import { getYearlyHoroscope } from '../../services/horoscopeApi';
import { HoroscopeResponse } from '../../services/horoscopeApi';

export default function YearlyHoroscopeScreen() {
  const [selectedSign, setSelectedSign] = useState(1);
  const [horoscope, setHoroscope] = useState<HoroscopeResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHoroscope();
  }, [selectedSign]);

  const fetchHoroscope = async () => {
    try {
      setLoading(true);
      const data = await getYearlyHoroscope(selectedSign);
      setHoroscope(data);
    } catch (error) {
      console.error('Error fetching yearly horoscope:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignSelect = (signId: number) => {
    setSelectedSign(signId);
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#1a1a1a', '#2a2a2a']}
        style={styles.gradient}
      >
        <ScrollView style={styles.scrollView}>
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
  );
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
    fontSize: 12,
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
}); 