import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import React from "react";
import { LinearGradient } from "expo-linear-gradient"; // Import LinearGradient from expo-linear-gradient
import { Colors } from "../../constants/Colors";
import { useColorScheme } from "./../../hooks/useColorScheme";
import { astrologersData } from "../../mock/astrologersMock";
import { ThemedText } from "../ThemedText";

const AstrologersComponent = () => {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === "dark";
  const gradientColors = Colors.dark.astroCardBG;

  // Limit to first 4 items
  const limitedAstrologersData = astrologersData.slice(0, 4);

  return (
    <View style={styles.container}>
      {limitedAstrologersData.map((astrologer) => (
        <TouchableOpacity key={astrologer.id} style={styles.cardWrapper}>
          <View
            style={[
              styles.astrologyCard,
              {
                backgroundColor: isDarkMode
                  ? "transparent"
                  : Colors.light.astroCardBG,
              },
            ]}
          >
            {isDarkMode ? (
              <LinearGradient
                colors={gradientColors}
                style={styles.gradientBackground}
              >
                <CardContent
                  astrologer={astrologer}
                  colorScheme={colorScheme}
                />
              </LinearGradient>
            ) : (
              <View
                style={[
                  styles.gradientBackground,
                  { backgroundColor: Colors.light.astroCardBG },
                ]}
              >
                <CardContent
                  astrologer={astrologer}
                  colorScheme={colorScheme}
                />
              </View>
            )}
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
};

// Reusable CardContent component to avoid repetition
const CardContent = ({ astrologer, colorScheme }) => (
  <>
    <Image source={{ uri: astrologer.image }} style={styles.image} />
    <View style={styles.details}>
      <ThemedText style={styles.name}>{astrologer.name}</ThemedText>
      <ThemedText
        style={[
          styles.category,
          { color: Colors[colorScheme ?? "light"].buttonBg },
        ]}
      >
        {astrologer.category}
      </ThemedText>
      <View style={styles.row}>
        <Text style={styles.fees}>
          <Text style={{ color: Colors[colorScheme ?? "light"].priceText }}>
            ${astrologer.feesPerMinute}
          </Text>
          <Text style={{ color: Colors[colorScheme ?? "light"].text }}>
            /min
          </Text>
        </Text>
        <TouchableOpacity
          style={[
            styles.chatButton,
            { backgroundColor: Colors[colorScheme ?? "light"].buttonBg },
          ]}
        >
          <Text
            style={[
              styles.chatText,
              { color: Colors[colorScheme ?? "light"].buttonText },
            ]}
          >
            Chat
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  </>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  cardWrapper: {
    width: "48%", // Adjust the width to ensure two cards per row with some margin
    marginVertical: 5,
  },
  astrologyCard: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 10,
    flex: 1,
  },
  gradientBackground: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderRadius: 8,
    flex: 1,
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 40,
    marginRight: 10,
  },
  details: {
    flex: 1,
  },
  name: {
    fontSize: 9,
    fontFamily: "Nunito-Bold",
  },
  category: {
    fontSize: 8,
    lineHeight: 10,
  },
  fees: {
    fontSize: 8,
    fontWeight: "600",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
    justifyContent: "space-between",
  },
  chatButton: {
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 2,
  },
  chatText: {
    fontSize: 10,
  },
});

export default AstrologersComponent;
