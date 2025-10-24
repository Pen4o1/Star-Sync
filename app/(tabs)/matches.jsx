import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  FlatList,
  ActivityIndicator,
} from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { ZODIAC_SIGNS } from '../../constants/zodiacData'
import { getLoveMatch, getFriendMatch } from '../../services/horoscopeApi'
import MatchResultModal from '../../components/MatchResultModal'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { getUserZodiacSign } from '../../constants/userData'
import { getUid } from '../../services/uidService'
import { getEntitlements } from '../../services/horoscopeSubService'
import SubscriptionPaywall from '../../components/SubscriptionPaywall'

export default function MatchScreen() {
  const [selectedSign1, setSelectedSign1] = useState(null)
  const [selectedSign2, setSelectedSign2] = useState(null)
  const [matchType, setMatchType] = useState('love')
  const [matchResult, setMatchResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [pickerFor, setPickerFor] = useState(null) // 'sign1' or 'sign2'
  const [isPaid, setIsPaid] = useState(false)
  const [entitlementsLoading, setEntitlementsLoading] = useState(true)
  const [showPaywall, setShowPaywall] = useState(false)

  useEffect(() => {
    const fetchUserZodiac = async () => {
      const birthdate = await AsyncStorage.getItem('userBirthDate');
      if (birthdate) {
        const zodiacId = getUserZodiacSign(birthdate);
        setSelectedSign1(zodiacId);
      }
    };
    fetchUserZodiac();
  }, []);

  useEffect(() => {
    const checkEntitlements = async () => {
      try {
        setEntitlementsLoading(true)
        const uid = await getUid()
        const ent = await getEntitlements(uid)
        setIsPaid(!!ent?.is_paid)
      } catch {
        setIsPaid(false)
      } finally {
        setEntitlementsLoading(false)
      }
    }
    checkEntitlements()
  }, [])

  const fetchMatch = async () => {
    if (!isPaid) { setShowPaywall(true); return; }
    try {
      setLoading(true)
      const sign1 = ZODIAC_SIGNS[selectedSign1 - 1].name.toLowerCase()
      const sign2 = ZODIAC_SIGNS[selectedSign2 - 1].name.toLowerCase()
      const data =
        matchType === 'love'
          ? await getLoveMatch(sign1, sign2)
          : await getFriendMatch(sign1, sign2)
      setMatchResult(data)
      setModalVisible(true)
    } catch (error) {
      console.error('Error fetching match:', error)
    } finally {
      setLoading(false)
    }
  }

  const openPicker = (which) => {
    setPickerFor(which)
  }

  const closePicker = () => {
    setPickerFor(null)
  }

  const handleSignPick = (id) => {
    if (pickerFor === 'sign1') {
      setSelectedSign1(id)
    } else if (pickerFor === 'sign2') {
      setSelectedSign2(id)
    }
    closePicker()
  }

  const getRandomMatch = async () => {
    if (!isPaid) { setShowPaywall(true); return; }
    if (!selectedSign1) {
      alert('Please set your zodiac sign first');
      return;
    }
    
    try {
      setLoading(true)
      
      // Generate a random zodiac sign (excluding the user's own sign)
      let randomSignId
      do {
        randomSignId = Math.floor(Math.random() * 12) + 1
      } while (randomSignId === selectedSign1)
      
      setSelectedSign2(randomSignId)
      
      // Immediately fetch the match with the random sign
      const sign1 = ZODIAC_SIGNS[selectedSign1 - 1].name.toLowerCase()
      const sign2 = ZODIAC_SIGNS[randomSignId - 1].name.toLowerCase()
      
      const data =
        matchType === 'love'
          ? await getLoveMatch(sign1, sign2)
          : await getFriendMatch(sign1, sign2)
      
      setMatchResult(data)
      setModalVisible(true)
    } catch (error) {
      console.error('Error fetching random match:', error)
    } finally {
      setLoading(false)
    }
  }

  if (entitlementsLoading) {
    return (
      <View style={[styles.container, { alignItems: 'center', justifyContent: 'center' }]}>
        <ActivityIndicator size="large" color="#FFAA1E" />
        <Text style={{ color: '#fff', marginTop: 8 }}>Checking access...</Text>
      </View>
    )
  }

  if (!isPaid) {
    return (
      <View style={styles.container}>
        <LinearGradient colors={['#1a1a1a', '#2a2a2a']} style={styles.gradient}>
          <ScrollView style={styles.scrollView} contentContainerStyle={{ flexGrow: 1, alignItems: 'center', justifyContent: 'center', padding: 24 }}>
            <Text style={{ color: '#fff', fontSize: 18, textAlign: 'center', marginBottom: 16 }}>Love & Friendship Matcher is a premium feature.</Text>
            <TouchableOpacity onPress={() => setShowPaywall(true)} style={{ backgroundColor: '#FFAA1E', paddingVertical: 12, paddingHorizontal: 20, borderRadius: 8 }}>
              <Text style={{ color: '#000', fontWeight: 'bold' }}>Upgrade</Text>
            </TouchableOpacity>
          </ScrollView>
        </LinearGradient>
        {showPaywall && (
          <View style={{ position: 'absolute', zIndex: 100, top: 0, left: 0, right: 0, bottom: 0 }}>
            <SubscriptionPaywall onClose={() => setShowPaywall(false)} onSubscribe={() => { setShowPaywall(false); setIsPaid(true); }} />
          </View>
        )}
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#1a1a1a', '#2a2a2a']} style={styles.gradient}>
        <ScrollView style={styles.scrollView}>
          <View style={styles.circlesRow}>
            {/* User's star sign */}
            <TouchableOpacity
              style={styles.circle}
              onPress={() => openPicker('sign1')}
            >
              {selectedSign1 ? (
                <>
                  <Text style={styles.circleSymbol}>
                    {ZODIAC_SIGNS[selectedSign1 - 1].symbol}
                  </Text>
                  <Text style={styles.circleName}>
                    {ZODIAC_SIGNS[selectedSign1 - 1].name}
                  </Text>
                </>
              ) : (
                <Text style={styles.emptyCircleText}>?</Text>
              )}
            </TouchableOpacity>
            {/* Second sign (empty or selected) */}
            <TouchableOpacity
              style={styles.circle}
              onPress={() => openPicker('sign2')}
            >
              {selectedSign2 ? (
                <>
                  <Text style={styles.circleSymbol}>
                    {ZODIAC_SIGNS[selectedSign2 - 1].symbol}
                  </Text>
                  <Text style={styles.circleName}>
                    {ZODIAC_SIGNS[selectedSign2 - 1].name}
                  </Text>
                </>
              ) : (
                <Text style={styles.emptyCircleText}>?</Text>
              )}
            </TouchableOpacity>
          </View>

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

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.matchButton}
              onPress={fetchMatch}
              disabled={loading || !selectedSign2 || !selectedSign1}
            >
              <Text style={styles.matchButtonText}>
                {loading ? 'Loading...' : 'Get Match'}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.matchButton, styles.randomMatchButton]}
              onPress={getRandomMatch}
              disabled={loading || !selectedSign1}
            >
              <Text style={styles.matchButtonText}>
                {loading ? 'Loading...' : 'Random Match'}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </LinearGradient>

      {/* Zodiac Picker Modal */}
      <Modal
        visible={!!pickerFor}
        transparent
        animationType="fade"
        onRequestClose={closePicker}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select a Zodiac Sign</Text>
            <FlatList
              data={ZODIAC_SIGNS}
              numColumns={3}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.modalSignButton}
                  onPress={() => handleSignPick(item.id)}
                >
                  <Text style={styles.modalSignSymbol}>{item.symbol}</Text>
                  <Text style={styles.modalSignName}>{item.name}</Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity onPress={closePicker} style={styles.modalCloseButton}>
              <Text style={styles.modalCloseText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <MatchResultModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        matchResult={matchResult}
      />
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
  circlesRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 20,
    gap: 30,
  },
  circle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#333',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 10,
  },
  circleSymbol: {
    fontSize: 32,
    color: '#FFAA1E',
    fontWeight: 'bold',
  },
  circleName: {
    color: '#fff',
    fontSize: 14,
    marginTop: 4,
  },
  emptyCircleText: {
    fontSize: 32,
    color: '#fff',
    opacity: 0.5,
    fontWeight: 'bold',
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#222',
    borderRadius: 16,
    padding: 24,
    width: 320,
    maxHeight: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  modalSignButton: {
    alignItems: 'center',
    justifyContent: 'center',
    margin: 8,
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#333',
  },
  modalSignSymbol: {
    fontSize: 28,
    color: '#FFAA1E',
    fontWeight: 'bold',
  },
  modalSignName: {
    color: '#fff',
    fontSize: 12,
    marginTop: 2,
  },
  modalCloseButton: {
    marginTop: 16,
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#444',
  },
  modalCloseText: {
    color: '#fff',
    fontWeight: 'bold',
  },
})
