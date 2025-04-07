import React, { useEffect } from "react";
import { StyleSheet, View, LayoutAnimation } from "react-native";
import { Tabs } from "expo-router";
import { LinearGradient } from "expo-linear-gradient"; // Import LinearGradient
import { useColorScheme } from "../../hooks/useColorScheme";
import { Colors } from "../../constants/Colors";
import TabHeart from "../../assets/images/SVG/Files/TabHeart";
import TabBookmark from "../../assets/images/SVG/Files/TabBookmark";
import TabSettings from "../../assets/images/SVG/Files/TabSettings";
import TabProfile from "../../assets/images/SVG/Files/TabProfile";
import SVGImages from "../../assets/images/SVG"; // For Home icon
import { FontAwesome6 } from '@expo/vector-icons';

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
          colors={Colors.dark.astroCardBG} // Use gradient colors from the dark mode colors
          style={styles.gradientBackground}
        >
          <TabContent colorScheme={colorScheme} />
        </LinearGradient>
      ) : (
        <View
          style={[
            styles.gradientBackground,
            { backgroundColor: Colors.light.astroCardBG }, // Solid background for light mode
          ]}
        >
          <TabContent colorScheme={colorScheme} />
        </View>
      )}
    </View>
  );
};

const TabContent = ({ colorScheme }) => {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].buttonBg, // Dynamic active tint
        tabBarShowLabel: false,
        tabBarStyle: [
          styles.tabBar,
          { backgroundColor: Colors[colorScheme ?? "light"].astroCardBG }, // Tab bar background color
        ],
      }}
    >
      <Tabs.Screen
        name="daily"
        options={{
          tabBarIcon: ({ color }) => <FontAwesome6 name="sun" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="weekly"
        options={{
          tabBarIcon: ({ color }) => <FontAwesome6 name="calendar-week" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="monthly"
        options={{
          tabBarIcon: ({ color }) => <FontAwesome6 name="calendar" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="yearly"
        options={{
          tabBarIcon: ({ color }) => <FontAwesome6 name="calendar-days" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="chinese"
        options={{
          tabBarIcon: ({ color }) => <FontAwesome6 name="dragon" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="match"
        options={{
          tabBarIcon: ({ color }) => <FontAwesome6 name="heart" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="dreambook"
        options={{
          tabBarIcon: ({ color }) => <FontAwesome6 name="moon" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="horoscope"
        options={{
          tabBarIcon: ({ color }) => <FontAwesome6 name="star" size={24} color={color} />,
        }}
      />
    </Tabs>
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
  tabBar: {
    position: "absolute",
    paddingVertical: 10,
    paddingBottom: 10,
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 20,
    height: 90,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)", // Subtle border
    justifyContent: "center",
  },
});
