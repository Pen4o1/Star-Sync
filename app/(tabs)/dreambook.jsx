import React, { useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  FlatList,
} from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { searchDreamBook, getDreamBookWord } from '../../services/horoscopeApi'

export default function DreamBookScreen() {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [selectedWord, setSelectedWord] = useState(null)
  const [interpretation, setInterpretation] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleSearch = async () => {
    if (!searchQuery.trim()) return

    try {
      setLoading(true)
      const results = await searchDreamBook(searchQuery)
      setSearchResults(results)
      setSelectedWord(null)
      setInterpretation(null)
    } catch (error) {
      console.error('Error searching dream book:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleWordSelect = async (word) => {
    try {
      setLoading(true)
      setSelectedWord(word)
      const result = await getDreamBookWord(word.id)
      setInterpretation(result.interpretation)
    } catch (error) {
      console.error('Error fetching word interpretation:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#1a1a1a', '#2a2a2a']} style={styles.gradient}>
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search for a dream symbol..."
            placeholderTextColor="#888"
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearch}
          />
          <TouchableOpacity
            style={styles.searchButton}
            onPress={handleSearch}
            disabled={loading}
          >
            <Text style={styles.searchButtonText}>
              {loading ? 'Searching...' : 'Search'}
            </Text>
          </TouchableOpacity>
        </View>

        {searchResults.length > 0 && (
          <View style={styles.resultsContainer}>
            <Text style={styles.resultsTitle}>Search Results</Text>
            <FlatList
              data={searchResults}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.resultItem,
                    selectedWord?.id === item.id && styles.selectedResultItem,
                  ]}
                  onPress={() => handleWordSelect(item)}
                >
                  <Text style={styles.resultText}>{item.word}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        )}

        {interpretation && (
          <View style={styles.interpretationContainer}>
            <Text style={styles.interpretationTitle}>
              {selectedWord?.word} Interpretation
            </Text>
            <Text style={styles.interpretationText}>{interpretation}</Text>
          </View>
        )}
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
  searchContainer: {
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchInput: {
    flex: 1,
    height: 40,
    backgroundColor: '#333',
    borderRadius: 5,
    paddingHorizontal: 10,
    color: '#fff',
    marginRight: 10,
  },
  searchButton: {
    backgroundColor: '#FFAA1E',
    padding: 10,
    borderRadius: 5,
  },
  searchButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  resultsContainer: {
    flex: 1,
    padding: 20,
  },
  resultsTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  resultItem: {
    padding: 15,
    backgroundColor: '#333',
    borderRadius: 5,
    marginBottom: 10,
  },
  selectedResultItem: {
    backgroundColor: '#FFAA1E',
  },
  resultText: {
    color: '#fff',
    fontSize: 16,
  },
  interpretationContainer: {
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    margin: 10,
    borderRadius: 10,
  },
  interpretationTitle: {
    color: '#FFAA1E',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  interpretationText: {
    color: '#fff',
    fontSize: 16,
    lineHeight: 24,
  },
})
