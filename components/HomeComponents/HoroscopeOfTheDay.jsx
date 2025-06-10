import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { getDailyHoroscope } from '../../services/horoscopeApi';

export default function HoroscopeOfTheDay({ userZodiacId = 1 }) {
  const [horoscope, setHoroscope] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showFullText, setShowFullText] = useState(false);

  useEffect(() => {
    fetchHoroscope();
  }, [userZodiacId]);

  const fetchHoroscope = async () => {
    try {
      setLoading(true);
      setShowFullText(false);
      const today = new Date().toISOString().split('T')[0];
      const data = await getDailyHoroscope(userZodiacId, today);
      setHoroscope(data);
    } catch (error) {
      console.error('Error fetching daily horoscope:', error);
      setHoroscope(null);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color="#FFAA1E" />
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </View>
    );
  }

  if (!horoscope) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Failed to load horoscope.</Text>
      </View>
    );
  }

  const previewLength = 120;
  const isLong = horoscope.horoscope.length > previewLength;
  const previewText = isLong
    ? horoscope.horoscope.slice(0, previewLength).trimEnd() + "..."
    : horoscope.horoscope;

  return (
    <View style={styles.container}>
      <View style={styles.horoscopeContainer}>
        <Text style={styles.date}>{horoscope.date}</Text>
        <Text style={styles.horoscopeText}>
          {showFullText ? horoscope.horoscope : previewText}
        </Text>
        {isLong && (
          <TouchableOpacity onPress={() => setShowFullText(!showFullText)}>
            <Text style={styles.showMoreText}>
              {showFullText ? 'Show Less' : 'Show More'}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  loadingContainer: {
    alignItems: 'center',
    marginTop: 10,
  },
  loadingText: {
    color: '#fff',
    fontSize: 12,
    marginTop: 6,
  },
  horoscopeContainer: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 8,
    padding: 12,
  },
  date: {
    color: '#FFAA1E',
    fontSize: 12,
    marginBottom: 6,
  },
  horoscopeText: {
    color: '#fff',
    fontSize: 12,
    lineHeight: 18,
  },
  showMoreText: {
    color: '#FFAA1E',
    fontSize: 11,
    marginTop: 6,
    textAlign: 'right',
  },
  errorText: {
    color: '#ff4444',
    fontSize: 12,
    textAlign: 'center',
  },
});
