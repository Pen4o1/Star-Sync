import React from 'react'
import { View, StyleSheet, ScrollView } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import DailyHoroscope from '../../components/HomeComponents/DailyHoroscope'
import ChineseHoroscope from '../../components/HomeComponents/ChineseHoroscope'
import FeatureButtons from '../../components/HomeComponents/FeatureButtons'

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <LinearGradient colors={['#1a1a1a', '#2a2a2a']} style={styles.gradient}>
        <ScrollView style={styles.scrollView}>
          <DailyHoroscope />
          <ChineseHoroscope />
          <FeatureButtons />
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
}) 
