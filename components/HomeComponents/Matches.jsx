import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ZODIAC_SIGNS } from '../../constants/zodiacData';
import { getLoveMatch, getFriendMatch } from '../../services/horoscopeApi';

export default function MatchScreen() {
  const [selectedSign1, setSelectedSign1] = useState(1);
  const [selectedSign2, setSelectedSign2] = useState(2);
  const [matchType, setMatchType] = useState('love');
  const [matchResult, setMatchResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchMatch = async () => {
    try {
      setLoading(true);
      const sign1 = ZODIAC_SIGNS[selectedSign1 - 1].name.toLowerCase();
      const sign2 = ZODIAC_SIGNS[selectedSign2 - 1].name.toLowerCase();

      const data =
        matchType === 'love'
          ? await getLoveMatch(sign1, sign2)
          : await getFriendMatch(sign1, sign2);

      setMatchResult(data);
    } catch (error) {
      console.error('Error fetching match:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRandomMatch = async () => {
    try {
      setLoading(true);
      
      // Generate a random zodiac sign (excluding the first selected sign)
      let randomSignId;
      do {
        randomSignId = Math.floor(Math.random() * 12) + 1;
      } while (randomSignId === selectedSign1);
      
      setSelectedSign2(randomSignId);
      
      // Immediately fetch the match with the random sign
      const sign1 = ZODIAC_SIGNS[selectedSign1 - 1].name.toLowerCase();
      const sign2 = ZODIAC_SIGNS[randomSignId - 1].name.toLowerCase();

      const data =
        matchType === 'love'
          ? await getLoveMatch(sign1, sign2)
          : await getFriendMatch(sign1, sign2);

      setMatchResult(data);
    } catch (error) {
      console.error('Error fetching random match:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#1a1a1a', '#2a2a2a']} style={styles.gradient}>
        <ScrollView style={styles.scrollView}>
          <View style={styles.matchTypeContainer}>
            <TouchableOpacity
              style={[
                styles.matchTypeButton,
                matchType === 'love' && styles.selectedMatchType,
              ]}
              onPress={() => setMatchType('love')}
            >
              <Text style={styles.matchTypeText}>Love Match</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.matchTypeButton,
                matchType === 'friend' && styles.selectedMatchType,
              ]}
              onPress={() => setMatchType('friend')}
            >
              <Text style={styles.matchTypeText}>Friend Match</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.signsContainer}>
            <View style={styles.signColumn}>
              <Text style={styles.signColumnTitle}>First Sign</Text>
              {ZODIAC_SIGNS.map((sign) => (
                <TouchableOpacity
                  key={sign.id}
                  style={[
                    styles.signButton,
                    selectedSign1 === sign.id && styles.selectedSign,
                  ]}
                  onPress={() => setSelectedSign1(sign.id)}
                >
                  <Text style={styles.signSymbol}>{sign.symbol}</Text>
                  <Text style={styles.signName}>{sign.name}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.signColumn}>
              <Text style={styles.signColumnTitle}>Second Sign</Text>
              {ZODIAC_SIGNS.map((sign) => (
                <TouchableOpacity
                  key={sign.id}
                  style={[
                    styles.signButton,
                    selectedSign2 === sign.id && styles.selectedSign,
                  ]}
                  onPress={() => setSelectedSign2(sign.id)}
                >
                  <Text style={styles.signSymbol}>{sign.symbol}</Text>
                  <Text style={styles.signName}>{sign.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.matchButton}
              onPress={fetchMatch}
              disabled={loading}
            >
              <Text style={styles.matchButtonText}>
                {loading ? 'Loading...' : 'Get Match'}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.matchButton, styles.randomMatchButton]}
              onPress={getRandomMatch}
              disabled={loading}
            >
              <Text style={styles.matchButtonText}>
                {loading ? 'Loading...' : 'Random Match'}
              </Text>
            </TouchableOpacity>
          </View>

          {matchResult && (
            <View style={styles.resultContainer}>
              <View style={styles.compatibilityContainer}>
                <Text style={styles.compatibilityText}>
                  Compatibility Score
                </Text>
                <Text style={styles.compatibilityScore}>
                  {matchResult.compatibility}%
                </Text>
              </View>
              <Text style={styles.matchDescription}>
                {matchResult.description}
              </Text>
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
  matchTypeContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 10,
  },
  matchTypeButton: {
    padding: 10,
    margin: 5,
    borderRadius: 5,
    backgroundColor: '#333',
  },
  selectedMatchType: {
    backgroundColor: '#FFAA1E',
  },
  matchTypeText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  signsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
  },
  signColumn: {
    alignItems: 'center',
  },
  signColumnTitle: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 10,
  },
  signButton: {
    width: 60,
    height: 60,
    margin: 5,
    borderRadius: 30,
    backgroundColor: '#333',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedSign: {
    backgroundColor: '#FFAA1E',
  },
  signSymbol: {
    fontSize: 20,
    color: '#fff',
  },
  signName: {
    color: '#fff',
    fontSize: 10,
    marginTop: 2,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    marginVertical: 10,
  },
  matchButton: {
    backgroundColor: '#FFAA1E',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5,
  },
  randomMatchButton: {
    backgroundColor: '#6B46C1',
  },
  matchButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  resultContainer: {
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    margin: 10,
    borderRadius: 10,
  },
  compatibilityContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  compatibilityText: {
    color: '#fff',
    fontSize: 16,
  },
  compatibilityScore: {
    color: '#FFAA1E',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 5,
  },
  matchDescription: {
    color: '#fff',
    fontSize: 16,
    lineHeight: 24,
  },
});
