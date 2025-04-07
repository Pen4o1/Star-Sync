import React from 'react';
import { View, StyleSheet } from 'react-native';
import { AdMobBanner } from 'expo-ads-admob';

interface AdBannerProps {
  unitID: string;
}

export default function AdBanner({ unitID }: AdBannerProps) {
  return (
    <View style={styles.container}>
      <AdMobBanner
        bannerSize="smartBannerPortrait"
        adUnitID={unitID}
        servePersonalizedAds
        onDidFailToReceiveAdWithError={(error) => console.error(error)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
}); 