import React from 'react'
import { View, Text, StyleSheet } from 'react-native'

export default function HoroscopeSection({ title, text }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.text}>{text}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 15,
    padding: 10,
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: 5,
  },
  title: {
    fontSize: 18,
    color: '#FFAA1E',
    fontWeight: 'bold',
    marginBottom: 6,
  },
  text: {
    color: '#fff',
    fontSize: 16,
    lineHeight: 24,
  },
})
