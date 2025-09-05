import React, { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { View, StyleSheet } from "react-native";
import { useFonts } from "expo-font";
import { Slot, SplashScreen, Stack, useRouter, useSegments } from "expo-router";
import ThemeContext from "../theme/ThemeContext";
import theme from "../theme/Theme";
import { EventRegister } from "react-native-event-listeners";
import DropdownMenu from "../components/HomeComponents/DropdownMenu";
import AsyncStorage from "@react-native-async-storage/async-storage";
import SubscriptionPaywall from "../components/SubscriptionPaywall";
import { initIAP } from "../services/iapService";
import { getEntitlements } from "../services/horoscopeSubService";
import { getUid } from "../services/uidService";
import SubscriptionContext from "../context/SubscriptionContext";
import { SafeAreaView } from "react-native-safe-area-context";
import { BannerAd, BannerAdSize } from "react-native-google-mobile-ads";

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
        const userName = await AsyncStorage.getItem("userName");
        const userBirthDate = await AsyncStorage.getItem("userBirthDate");
        if (
          userName &&
          userName.trim() !== "" &&
          userBirthDate &&
          userBirthDate.trim() !== ""
        ) {
          setIsUserSignedIn(true);
          if (
            (segments[0] === "(auth)" && segments[1] !== "EditUser") ||
            segments.length === 0
          ) {
            setTimeout(() => {
              router.replace("/Home");
            }, 100);
          }
        } else {
          setIsUserSignedIn(false);
          setShowPaywall(false);
          if (segments[0] !== "(auth)" && segments.length > 0) {
            setTimeout(() => {
              router.replace("/");
            }, 100);
          }
        }
      } catch (error) {
        console.error("Error checking user sign in status:", error);
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
    const runIapCheck = async () => {
      if (isLoading || !fontsLoaded) return;
      if (!isUserSignedIn) {
        setIsSubscribed(false);
        setShowPaywall(false);
        return;
      }
      try {
        await initIAP();
        const uid = await getUid();
        const ent = await getEntitlements(uid);
        setIsSubscribed(!!ent?.is_paid);
      } catch (e) {
        setIsSubscribed(false);
      }
    };
    runIapCheck();
  }, [isUserSignedIn, isLoading, fontsLoaded]);

  useEffect(() => {
    if (!isLoading && fontsLoaded && isUserSignedIn) {
      setShowPaywall(!isSubscribed);
    } else {
      setShowPaywall(false);
    }
  }, [isLoading, fontsLoaded, isUserSignedIn, isSubscribed]);

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

  const openPaywall = () => setShowPaywall(true);

  return (
    <ThemeContext.Provider value={darkMode ? theme.dark : theme.light}>
      <SubscriptionContext.Provider value={{ isSubscribed, openPaywall }}>
        <SafeAreaView style={styles.container}>
          {isUserSignedIn && !showPaywall && <DropdownMenu />}
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="(tabs)" screenOptions={{ headerShown: false }} />
            <Stack.Screen name="(auth)" />
          </Stack>

          {isUserSignedIn && showPaywall && (
            <View
              style={{
                position: "absolute",
                zIndex: 100,
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
              }}
            >
              <SubscriptionPaywall
                onClose={() => setShowPaywall(false)}
                onSubscribe={handleSubscribe}
              />
            </View>
          )}

          {/* Banner Ad at Bottom */}
          {isUserSignedIn && !isSubscribed && (
            <View style={styles.bannerContainer}>
              <BannerAd
                unitId="ca-app-pub-2666074277435964/5175351704"
                size={BannerAdSize.BANNER}
              />
            </View>
          )}

          <StatusBar style="light" />
        </SafeAreaView>
      </SubscriptionContext.Provider>
    </ThemeContext.Provider>
  );
};

export default _layout;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  bannerContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: "center",
  },
});
