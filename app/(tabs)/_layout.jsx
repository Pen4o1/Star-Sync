import React, { useEffect } from "react";
import { StyleSheet, View, LayoutAnimation } from "react-native";
import { Stack } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { useColorScheme } from "../../hooks/useColorScheme";
import { Colors } from "../../constants/Colors";

const _layout = () => {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === "dark";

  // Set layout animation for smooth transition between light/dark modes
  useEffect(() => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  }, [colorScheme]);

  return (
    <View style={styles.container}>
      {/* Conditionally render the background as a gradient in dark mode */}
      {isDarkMode ? (
        <LinearGradient
          colors={Colors.dark.astroCardBG}
          style={styles.gradientBackground}
        >
          <Stack screenOptions={{ headerShown: false }} />
        </LinearGradient>
      ) : (
        <View
          style={[
            styles.gradientBackground,
            { backgroundColor: Colors.light.astroCardBG },
          ]}
        >
          <Stack screenOptions={{ headerShown: false }} />
        </View>
      )}
    </View>
  );
};

export default _layout;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradientBackground: {
    flex: 1,
  },
});
