import React, { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { View, StyleSheet, ImageBackground } from "react-native";
import { useFonts } from "expo-font";
import { Slot, SplashScreen, Stack, useRouter, useSegments } from "expo-router";
import ThemeContext from "../theme/ThemeContext";
import theme from "../theme/Theme";
import { EventRegister } from "react-native-event-listeners";
import DropdownMenu from "../components/HomeComponents/DropdownMenu";
import AsyncStorage from '@react-native-async-storage/async-storage';
import SubscriptionPaywall from '../components/SubscriptionPaywall';
import { initIAP } from '../services/iapService';
import { getEntitlements } from '../services/horoscopeSubService';
import { getUid } from '../services/uidService';
import SubscriptionContext from '../context/SubscriptionContext';
import AdBanner from '../components/AdBanner';
import mobileAds, { MaxAdContentRating } from 'react-native-google-mobile-ads';

const _layout = () => {
  const [fontsLoaded, error] = useFonts({
    "Nunito-Black": require("../assets/fonts/Nunito-Black.ttf"),
    "Nunito-Bold": require("../assets/fonts/Nunito-Bold.ttf"),
    "Nunito-ExtraBold": require("../assets/fonts/Nunito-ExtraBold.ttf"),
    "Nunito-ExtraLight": require("../assets/fonts/Nunito-ExtraLight.ttf"),
    "Nunito-Light": require("../assets/fonts/Nunito-Light.ttf"),
    "Nunito-Medium": require("../assets/fonts/Nunito-Medium.ttf"),
    "Nunito-Regular": require("../assets/fonts/Nunito-Regular.ttf"),
    "Nunito-SemiBold": require("../assets/fonts/Nunito-SemiBold.ttf"),
  });
  const [darkMode, setDarkMode] = useState(false);
  const [isUserSignedIn, setIsUserSignedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showPaywall, setShowPaywall] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [hasDismissedPaywall, setHasDismissedPaywall] = useState(false);
  const [checkingSub, setCheckingSub] = useState(true);
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    const listener = EventRegister.addEventListener("ChangeTheme", (data) => {
      setDarkMode(data);
    });
    return () => {
      EventRegister.removeAllListeners(listener);
    };
  }, [darkMode]);

  useEffect(() => {
    const checkUserSignIn = async () => {
      try {
        const userName = await AsyncStorage.getItem('userName');
        const userBirthDate = await AsyncStorage.getItem('userBirthDate');
        if (
          userName && userName.trim() !== '' &&
          userBirthDate && userBirthDate.trim() !== ''
        ) {
          setIsUserSignedIn(true);
          if ((segments[0] === '(auth)' && segments[1] !== 'EditUser') || segments.length === 0) {
            setTimeout(() => {
              router.replace('/Home');
            }, 100);
          }
        } else {
          setIsUserSignedIn(false);
          setShowPaywall(false);
          if (segments[0] !== '(auth)' && segments.length > 0) {
            setTimeout(() => {
              router.replace('/');
            }, 100);
          }
        }
      } catch (error) {
        console.error('Error checking user sign in status:', error);
        setIsUserSignedIn(false);
      } finally {
        setIsLoading(false);
      }
    };
    const timer = setTimeout(() => {
      checkUserSignIn();
    }, 100);
    return () => clearTimeout(timer);
  }, [segments]);

  useEffect(() => {
    // Initialize Google Mobile Ads SDK once on app start
    mobileAds()
      .setRequestConfiguration({
        maxAdContentRating: MaxAdContentRating.T,
        tagForChildDirectedTreatment: false,
        tagForUnderAgeOfConsent: false,
      })
      .then(() => mobileAds().initialize());
  }, []);

  useEffect(() => {
    const runIapCheck = async () => {
      if (isLoading || !fontsLoaded) return;
      setCheckingSub(true);
      if (!isUserSignedIn) {
        setIsSubscribed(false);
        setShowPaywall(false);
        setCheckingSub(false);
        return;
      }
      try {
        await initIAP();
        const uid = await getUid();
        const ent = await getEntitlements(uid);
        setIsSubscribed(!!ent?.is_paid);
      } catch (e) {
        setIsSubscribed(false);
      } finally {
        setCheckingSub(false);
      }
    };
    runIapCheck();
  }, [isUserSignedIn, isLoading, fontsLoaded]);

  useEffect(() => {
    if (!isLoading && fontsLoaded && isUserSignedIn && !checkingSub) {
      setShowPaywall(!isSubscribed && !hasDismissedPaywall);
    } else {
      setShowPaywall(false);
    }
  }, [isLoading, fontsLoaded, isUserSignedIn, checkingSub, isSubscribed, hasDismissedPaywall]);

  useEffect(() => {
    if (error) throw error;
    if (fontsLoaded && !isLoading) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, error, isLoading]);

  const handleSubscribe = async () => {
    try {
      const uid = await getUid();
      setTimeout(async () => {
        const ent = await getEntitlements(uid);
        const paid = !!ent?.is_paid;
        setIsSubscribed(paid);
        if (paid) setShowPaywall(false);
      }, 800);
    } catch {}
  };

  if (!fontsLoaded || isLoading) {
    return null;
  }

  if (!fontsLoaded && !error) {
    return null;
  }

  const openPaywall = () => {
    setHasDismissedPaywall(false);
    setShowPaywall(true);
  };

  return (
    <ThemeContext.Provider value={darkMode ? theme.dark : theme.light}>
      <SubscriptionContext.Provider value={{ isSubscribed, openPaywall }}>
        <ImageBackground 
          source={require("../assets/images/Auth/SignInBG.png")} 
          style={styles.backgroundImage}
          resizeMode="cover"
        >
          <View style={styles.container}>
            {isUserSignedIn && !showPaywall && <DropdownMenu />}
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="index" />
              <Stack.Screen name="(tabs)" screenOptions={{ headerShown: false }} />
              <Stack.Screen name="(auth)" />
            </Stack>
            {(() => {
              const isOnboarding = segments.length === 0;
              const isAuthFlow = segments[0] === '(auth)';
              const hideAdsForFlow = isOnboarding || isAuthFlow;
              return (!checkingSub && !isSubscribed && !showPaywall && !hideAdsForFlow);
            })() && (
              <View style={{ width: '100%' }}>
                <AdBanner unitID="ca-app-pub-2666074277435964/7453491051" />
              </View>
            )}
            {isUserSignedIn && showPaywall && (
              <View style={{ position: 'absolute', zIndex: 100, top: 0, left: 0, right: 0, bottom: 0 }}>
                <SubscriptionPaywall
                  onClose={() => { setShowPaywall(false); setHasDismissedPaywall(true); }}
                  onSubscribe={handleSubscribe}
                />
              </View>
            )}
            <StatusBar style="light" />
          </View>
        </ImageBackground>
      </SubscriptionContext.Provider> 
    </ThemeContext.Provider>
  );
};

export default _layout;

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    backgroundColor: "transparent",
  },
});
