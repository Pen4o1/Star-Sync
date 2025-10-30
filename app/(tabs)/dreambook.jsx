import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  FlatList,
  ActivityIndicator,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { searchDreamBook, getDreamBookWord } from '../../services/horoscopeApi'
import DreamInterpretationModal from '../../components/DreamInterpretationModal'
import { getUid } from '../../services/uidService'
import { getEntitlements } from '../../services/horoscopeSubService'
import SubscriptionPaywall from '../../components/SubscriptionPaywall'
import AsyncStorage from '@react-native-async-storage/async-storage'

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
  const [isPaid, setIsPaid] = useState(false)
  const [entitlementsLoading, setEntitlementsLoading] = useState(true)
  const [showPaywall, setShowPaywall] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)
  const [recentSearches, setRecentSearches] = useState([])
  const debounceTimerRef = React.useRef(null)

  useEffect(() => {
    const checkEntitlements = async () => {
      try {
        setEntitlementsLoading(true)
        const uid = await getUid()
        const ent = await getEntitlements(uid)
        setIsPaid(!!ent?.is_paid)
      } catch (e) {
        setIsPaid(false)
      } finally {
        setEntitlementsLoading(false)
      }
    }
    checkEntitlements()
    // Load recent searches on mount
    ;(async () => {
      try {
        const raw = await AsyncStorage.getItem('dreambook_recent_searches')
        if (raw) {
          const parsed = JSON.parse(raw)
          if (Array.isArray(parsed)) setRecentSearches(parsed)
        }
      } catch {}
    })()
  }, [])

  // Debounced search-as-you-type for paid users
  useEffect(() => {
    if (!isPaid) return
    const term = searchQuery.trim()
    if (term.length < 2) return
    if (loading) return
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current)
    debounceTimerRef.current = setTimeout(() => {
      handleSearch()
    }, 500)
    return () => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current)
    }
  }, [searchQuery])

  const handleSearch = async () => {
    if (!searchQuery.trim()) return

    if (!isPaid) { setShowPaywall(true); return; }

    try {
      setLoading(true)
      setHasSearched(true)
      setAllSearchResults([])
      setSearchResults([])
      setCurrentPage(1)
      
      // Fetch all results since API doesn't support pagination
      const response = await searchDreamBook(searchQuery)
      const allResults = response.results || []
      
      setAllSearchResults(allResults)
      setTotalResults(allResults.length)
      
      // Calculate total pages
      const total = Math.ceil(allResults.length / resultsPerPage)
      setTotalPages(total)
      
      // Show first page
      const firstPageResults = allResults.slice(0, resultsPerPage)
      setSearchResults(firstPageResults)

      // Save to recent searches
      const term = searchQuery.trim()
      if (term) {
        setRecentSearches((prev) => {
          const withoutDup = prev.filter((t) => t.toLowerCase() !== term.toLowerCase())
          const next = [term, ...withoutDup].slice(0, 10)
          AsyncStorage.setItem('dreambook_recent_searches', JSON.stringify(next)).catch(() => {})
          return next
        })
      }
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
    if (!isPaid) { setShowPaywall(true); return; }
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
          <ScrollView contentContainerStyle={{ flexGrow: 1, alignItems: 'center', justifyContent: 'center', padding: 24 }}>
            <Text style={{ color: '#fff', fontSize: 18, textAlign: 'center', marginBottom: 16 }}>Dreambook is a premium feature.</Text>
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
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <LinearGradient colors={['#1a1a1a', '#2a2a2a']} style={styles.gradient}>
          <View style={styles.headerArea}>
            <Text style={styles.headerTitle}>Dreambook</Text>
            <Text style={styles.headerSubtitle}>Find meanings of symbols from your dreams</Text>
          </View>
          <View style={styles.searchContainer}>
            <View style={styles.searchInputWrapper}>
              <TextInput
                style={styles.searchInput}
                placeholder="Search for a dream symbol..."
                placeholderTextColor="#888"
                value={searchQuery}
                onChangeText={setSearchQuery}
                onSubmitEditing={() => handleSearch()}
                returnKeyType="search"
              />
              {!!searchQuery && !loading && (
                <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearButton} accessibilityLabel="Clear search">
                  <Text style={styles.clearButtonText}>×</Text>
                </TouchableOpacity>
              )}
            </View>
            <TouchableOpacity
              style={[styles.searchButton, loading && styles.searchButtonDisabled]}
              onPress={() => handleSearch()}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#000" />
              ) : (
                <Text style={styles.searchButtonText}>Search</Text>
              )}
            </TouchableOpacity>
          </View>

          {!hasSearched && recentSearches.length === 0 && (
            <View style={styles.helperContainer}>
              <Text style={styles.helperTitle}>Try searching for:</Text>
              <View style={styles.suggestionRow}>
                {['Flight', 'Water', 'Teeth', 'Cat', 'Falling'].map((term) => (
                  <TouchableOpacity key={term} style={styles.suggestionChip} onPress={() => { setSearchQuery(term); }}>
                    <Text style={styles.suggestionChipText}>{term}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {recentSearches.length > 0 && (
            <View style={styles.recentContainer}>
              <View style={styles.recentHeaderRow}>
                <Text style={styles.helperTitle}>Recent searches</Text>
                <TouchableOpacity onPress={async () => { setRecentSearches([]); await AsyncStorage.removeItem('dreambook_recent_searches').catch(() => {}) }}>
                  <Text style={styles.clearAllText}>Clear</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.suggestionRow}>
                {recentSearches.map((term) => (
                  <TouchableOpacity key={term} style={styles.suggestionChip} onPress={() => { setSearchQuery(term); }}>
                    <Text style={styles.suggestionChipText}>{term}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          <View style={styles.resultsContainer}>
            {hasSearched && !loading && searchResults.length === 0 && (
              <View style={styles.emptyState}>
                <Text style={styles.emptyTitle}>No results found</Text>
                <Text style={styles.emptySubtitle}>Try different keywords or check spelling.</Text>
              </View>
            )}

            {searchResults.length > 0 && (
              <View style={styles.resultsHeader}>
                <Text style={styles.resultsTitle}>Search Results</Text>
                <Text style={styles.pageInfo}>
                  Showing {(currentPage - 1) * resultsPerPage + 1}-{Math.min(currentPage * resultsPerPage, totalResults)} of {totalResults}
                </Text>
              </View>
            )}

            {loading && (
              <View style={styles.loaderArea}>
                <ActivityIndicator size="large" color="#FFAA1E" />
                <Text style={{ color: '#fff', marginTop: 8 }}>Searching...</Text>
              </View>
            )}

            {!loading && (
              <FlatList
                data={searchResults}
                keyExtractor={(item) => item.id.toString()}
                ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={[styles.resultItem, selectedWord?.id === item.id && styles.selectedResultItem]}
                    onPress={() => handleWordSelect(item)}
                    accessibilityLabel={`Open interpretation for ${item.word}`}
                  >
                    <View style={styles.resultAvatar}>
                      <Text style={styles.resultAvatarText}>{item.word?.[0]?.toUpperCase() || '?'}</Text>
                    </View>
                    <View style={styles.resultContent}>
                      <Text style={styles.resultText}>{item.word}</Text>
                      <Text style={styles.resultHint}>Tap to view interpretation</Text>
                    </View>
                    <Text style={styles.chevron}>›</Text>
                  </TouchableOpacity>
                )}
                ListFooterComponent={
                  totalPages > 1 ? (
                    <View style={styles.paginationContainer}>
                      <TouchableOpacity
                        style={[styles.pageButton, currentPage === 1 && styles.disabledPageButton]}
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
                              style={[styles.pageNumber, currentPage === pageNum && styles.currentPageNumber]}
                              onPress={() => goToPage(pageNum)}
                            >
                              <Text style={[styles.pageNumberText, currentPage === pageNum && styles.currentPageNumberText]}>
                                {pageNum}
                              </Text>
                            </TouchableOpacity>
                          )
                        })}
                      </View>
                      <TouchableOpacity
                        style={[styles.pageButton, currentPage === totalPages && styles.disabledPageButton]}
                        onPress={() => goToPage(currentPage + 1)}
                        disabled={currentPage === totalPages}
                      >
                        <Text style={styles.pageButtonText}>Next</Text>
                      </TouchableOpacity>
                    </View>
                  ) : null
                }
                contentContainerStyle={{ paddingBottom: 16 }}
              />
            )}
          </View>

          {selectedWord && (
            <DreamInterpretationModal
              visible={modalVisible}
              dreamWord={selectedWord}
              onClose={() => setModalVisible(false)}
            />
          )}
        </LinearGradient>
        {showPaywall && (
          <View style={{ position: 'absolute', zIndex: 100, top: 0, left: 0, right: 0, bottom: 0 }}>
            <SubscriptionPaywall onClose={() => setShowPaywall(false)} onSubscribe={() => { setShowPaywall(false); setIsPaid(true); }} />
          </View>
        )}
      </View>
    </TouchableWithoutFeedback>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  headerArea: {
    paddingHorizontal: 20,
    paddingTop: 16,
    alignItems: 'center',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '800',
    textAlign: 'center',
  },
  headerSubtitle: {
    color: '#bdbdbd',
    marginTop: 12,
    textAlign: 'center',
  },
  searchContainer: {
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchInputWrapper: {
    flex: 1,
    position: 'relative',
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
  clearButton: {
    position: 'absolute',
    right: 20,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  clearButtonText: {
    color: '#bdbdbd',
    fontSize: 20,
    lineHeight: 20,
  },
  searchButton: {
    backgroundColor: '#FFAA1E',
    padding: 10,
    borderRadius: 5,
  },
  searchButtonDisabled: {
    opacity: 0.6,
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
  helperContainer: {
    paddingHorizontal: 20,
    paddingTop: 6,
  },
  helperTitle: {
    color: '#bdbdbd',
    marginBottom: 8,
  },
  suggestionRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  suggestionChip: {
    backgroundColor: '#2f2f2f',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 999,
    marginRight: 8,
    marginBottom: 8,
  },
  suggestionChipText: {
    color: '#e0e0e0',
    fontSize: 12,
  },
  recentContainer: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  recentHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  clearAllText: {
    color: '#FFAA1E',
    fontWeight: '600',
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
  loaderArea: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  emptySubtitle: {
    color: '#bdbdbd',
  },
  resultItem: {
    padding: 14,
    backgroundColor: '#2b2b2b',
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectedResultItem: {
    backgroundColor: '#FFAA1E',
  },
  resultAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#3a3a3a',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  resultAvatarText: {
    color: '#fff',
    fontWeight: '700',
  },
  resultContent: {
    flex: 1,
  },
  resultText: {
    color: '#fff',
    fontSize: 16,
  },
  resultHint: {
    color: '#cfcfcf',
    fontSize: 12,
    marginTop: 2,
  },
  chevron: {
    color: '#888',
    fontSize: 24,
    marginLeft: 8,
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
