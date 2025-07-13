import React, { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { View, StyleSheet } from "react-native";
import { useFonts } from "expo-font";
import { Slot, SplashScreen, Stack, useRouter, useSegments } from "expo-router";
import ThemeContext from "../theme/ThemeContext";
import theme from "../theme/Theme";
import { EventRegister } from "react-native-event-listeners";
import DropdownMenu from "../components/HomeComponents/DropdownMenu";
import AsyncStorage from '@react-native-async-storage/async-storage';
import SubscriptionPaywall from '../components/SubscriptionPaywall';

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
          // If user is signed in and on index or auth pages (except EditUser), redirect to Home
          if ((segments[0] === '(auth)' && segments[1] !== 'EditUser') || segments.length === 0) {
            setTimeout(() => {
              router.replace('/Home');
            }, 100);
          }
        } else {
          setIsUserSignedIn(false);
          setShowPaywall(false); // Defensive: hide paywall if not signed in
          // If user is not signed in and not on index or auth pages, redirect to index
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
    // Delay the check to ensure component is mounted
    const timer = setTimeout(() => {
      checkUserSignIn();
    }, 100);
    return () => clearTimeout(timer);
  }, [segments]);

  // Show paywall after user is signed in and layout is ready
  useEffect(() => {
    if (!isLoading && fontsLoaded && isUserSignedIn) {
      setShowPaywall(true);
    } else {
      setShowPaywall(false);
    }
  }, [isLoading, fontsLoaded, isUserSignedIn]);

  useEffect(() => {
    if (error) throw error;
    if (fontsLoaded && !isLoading) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, error, isLoading]);

  if (!fontsLoaded || isLoading) {
    return null;
  }

  if (!fontsLoaded && !error) {
    return null;
  }

  return (
    <ThemeContext.Provider value={darkMode ? theme.dark : theme.light}>
      <View style={styles.container}>
        {isUserSignedIn && !showPaywall && <DropdownMenu />}
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="(tabs)" screenOptions={{ headerShown: false }} />
          <Stack.Screen name="(auth)" />
        </Stack>
        {/* Show paywall as modal overlay after login */}
        {isUserSignedIn && showPaywall && (
          <View style={{ position: 'absolute', zIndex: 100, top: 0, left: 0, right: 0, bottom: 0 }}>
            <SubscriptionPaywall
              onClose={() => setShowPaywall(false)}
              onSubscribe={() => setShowPaywall(false)}
            />
          </View>
        )}
        <StatusBar style="light" />
      </View>
    </ThemeContext.Provider>
  );
};

export default _layout;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
