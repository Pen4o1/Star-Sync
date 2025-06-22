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
import DreamInterpretationModal from '../../components/DreamInterpretationModal'

export default function DreamBookScreen() {
  const [searchQuery, setSearchQuery] = useState('')
  const [allSearchResults, setAllSearchResults] = useState([])
  const [searchResults, setSearchResults] = useState([])
  const [selectedWord, setSelectedWord] = useState(null)
  const [loading, setLoading] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalResults, setTotalResults] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const resultsPerPage = 10

  const handleSearch = async () => {
    if (!searchQuery.trim()) return

    try {
      setLoading(true)
      setAllSearchResults([])
      setSearchResults([])
      setCurrentPage(1)
      
      // Fetch all results since API doesn't support pagination
      const response = await searchDreamBook(searchQuery, 1, 1000) // Request large limit to get all results
      const allResults = response.results || []
      
      setAllSearchResults(allResults)
      setTotalResults(allResults.length)
      
      // Calculate total pages
      const total = Math.ceil(allResults.length / resultsPerPage)
      setTotalPages(total)
      
      // Show first page
      const firstPageResults = allResults.slice(0, resultsPerPage)
      setSearchResults(firstPageResults)
    } catch (error) {
      console.error('Error searching dream book:', error)
    } finally {
      setLoading(false)
    }
  }

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      setCurrentPage(page)
      
      // Calculate start and end indices for the page
      const startIndex = (page - 1) * resultsPerPage
      const endIndex = startIndex + resultsPerPage
      const pageResults = allSearchResults.slice(startIndex, endIndex)
      
      setSearchResults(pageResults)
    }
  }

  const handleWordSelect = async (word) => {
    try {
      setLoading(true)
      const result = await getDreamBookWord(parseInt(word.id))
      setSelectedWord(result)
      setModalVisible(true)
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
            onSubmitEditing={() => handleSearch()}
          />
          <TouchableOpacity
            style={styles.searchButton}
            onPress={() => handleSearch()}
            disabled={loading}
          >
            <Text style={styles.searchButtonText}>
              {loading ? 'Searching...' : 'Search'}
            </Text>
          </TouchableOpacity>
        </View>

        {searchResults.length > 0 && (
          <View style={styles.resultsContainer}>
            <View style={styles.resultsHeader}>
              <Text style={styles.resultsTitle}>
                Search Results ({totalResults} found)
              </Text>
              <Text style={styles.pageInfo}>
                Page {currentPage} of {totalPages}
              </Text>
            </View>
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
            
            {/* Pagination Controls */}
            {totalPages > 1 && (
              <View style={styles.paginationContainer}>
                <TouchableOpacity
                  style={[
                    styles.pageButton,
                    currentPage === 1 && styles.disabledPageButton
                  ]}
                  onPress={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <Text style={styles.pageButtonText}>Previous</Text>
                </TouchableOpacity>
                
                <View style={styles.pageNumbers}>
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum
                    if (totalPages <= 5) {
                      pageNum = i + 1
                    } else if (currentPage <= 3) {
                      pageNum = i + 1
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i
                    } else {
                      pageNum = currentPage - 2 + i
                    }
                    
                    return (
                      <TouchableOpacity
                        key={pageNum}
                        style={[
                          styles.pageNumber,
                          currentPage === pageNum && styles.currentPageNumber
                        ]}
                        onPress={() => goToPage(pageNum)}
                      >
                        <Text style={[
                          styles.pageNumberText,
                          currentPage === pageNum && styles.currentPageNumberText
                        ]}>
                          {pageNum}
                        </Text>
                      </TouchableOpacity>
                    )
                  })}
                </View>
                
                <TouchableOpacity
                  style={[
                    styles.pageButton,
                    currentPage === totalPages && styles.disabledPageButton
                  ]}
                  onPress={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  <Text style={styles.pageButtonText}>Next</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}

        {selectedWord && (
          <DreamInterpretationModal
            visible={modalVisible}
            dreamWord={selectedWord}
            onClose={() => setModalVisible(false)}
          />
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
  resultsHeader: {
    marginBottom: 10,
  },
  resultsTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  pageInfo: {
    color: '#888',
    fontSize: 14,
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
  paginationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  pageButton: {
    padding: 10,
    backgroundColor: '#FFAA1E',
    borderRadius: 5,
  },
  disabledPageButton: {
    backgroundColor: '#888',
  },
  pageNumbers: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  pageNumber: {
    padding: 10,
    backgroundColor: '#333',
    borderRadius: 5,
  },
  currentPageNumber: {
    backgroundColor: '#FFAA1E',
  },
  pageNumberText: {
    color: '#fff',
    fontSize: 16,
  },
  currentPageNumberText: {
    fontWeight: 'bold',
  },
  pageButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
})
