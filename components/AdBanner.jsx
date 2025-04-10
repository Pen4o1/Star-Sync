import React from 'react'
import { View, StyleSheet } from 'react-native'
import { AdMobBanner } from 'expo-ads-admob'

export default function AdBanner({ unitID }) {
  return (
    <View style={styles.container}>
      <AdMobBanner
        bannerSize="smartBannerPortrait"
        adUnitID={unitID}
        servePersonalizedAds
        onDidFailToReceiveAdWithError={(error) => console.error(error)}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
})
