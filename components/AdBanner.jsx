import React, { useMemo } from 'react'
import { View, StyleSheet, Platform } from 'react-native'
import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads'

// Default production banner ad unit
const PROD_BANNER_UNIT_ID = 'ca-app-pub-2666074277435964/7453491051'

export default function AdBanner({ adUnitId, unitID, size = 'BANNER', onAdLoaded, onAdFailedToLoad }) {
  const resolvedSize = useMemo(() => {
    if (!BannerAdSize) return null
    return BannerAdSize[size] || BannerAdSize.BANNER
  }, [size])

  const resolvedAdUnitId = useMemo(() => {
    if (TestIds && __DEV__) return TestIds.BANNER
    return adUnitId || unitID || PROD_BANNER_UNIT_ID
  }, [adUnitId, unitID])

  const canShowRealAd = BannerAd && resolvedSize && resolvedAdUnitId && (Platform.OS === 'android')

  if (canShowRealAd) {
    return (
      <View style={styles.container}>
        <BannerAd
          unitId={resolvedAdUnitId}
          size={resolvedSize}
          requestOptions={{ requestNonPersonalizedAdsOnly: false }}
          onAdLoaded={onAdLoaded}
          onAdFailedToLoad={onAdFailedToLoad}
        />
      </View>
    )
  }
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
