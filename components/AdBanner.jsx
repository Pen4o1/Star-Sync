import React from 'react'
import { View, StyleSheet, Text } from 'react-native'

// Dummy banner placeholder that is safe without any ads SDK installed
export default function AdBanner() {
  return (
    <View style={styles.container}>
      <View style={styles.placeholder}>
        <Text style={styles.placeholderText}>Ad Banner (placeholder)</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  placeholder: {
    width: '96%',
    height: 60,
    borderRadius: 8,
    backgroundColor: '#e5e7eb',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  placeholderText: {
    color: '#6b7280',
    fontSize: 14,
  },
})
