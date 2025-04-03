import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import SVGImages from "../../assets/images/SVG";
import { useColorScheme } from "../../hooks/useColorScheme"; // Custom hook
import { Colors } from "../../constants/Colors";
import { LinearGradient } from "expo-linear-gradient";
import { ThemedText } from "../ThemedText";

const AstroCard = ({ astrologer }) => {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === "dark";
  const backgroundColor = Colors[colorScheme ?? "light"].astroCardBG;

  return (
    <View style={styles.cardContainer}>
      {/* Use LinearGradient for dark mode, solid color for light mode */}
      {isDarkMode ? (
        <LinearGradient
          colors={backgroundColor} // Background defined as gradient for dark mode
          style={styles.card}
          start={[0.1532, 0.2104]}
          end={[0.9, 1.43]}
        >
          <AstroCardContent astrologer={astrologer} isDarkMode={isDarkMode} />
        </LinearGradient>
      ) : (
        <View style={[styles.card, { backgroundColor }]}>
          <AstroCardContent astrologer={astrologer} isDarkMode={isDarkMode} />
        </View>
      )}
    </View>
  );
};

const AstroCardContent = ({ astrologer, isDarkMode }) => {
  const textColor = isDarkMode ? "#fff" : "#11181C";
  const subTextColor = isDarkMode ? "#ccc" : "#687076";
  const colorScheme = useColorScheme();

  return (
    <>
      <View style={styles.imageColumn}>
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: astrologer.image }}
            style={styles.astrologerImage}
          />
        </View>
        <View style={styles.ratingContainer}>
          {[...Array(5)].map((_, i) => (
            <FontAwesome
              key={i}
              name="star"
              size={14}
              color={i < 4 ? "#FFD700" : "#ccc"} // Assuming 4-star rating
              style={styles.starIcon}
            />
          ))}
        </View>
        <ThemedText style={styles.orders}>{astrologer.orders}</ThemedText>
      </View>

      <View style={styles.infoColumn}>
        <View style={styles.nameContainer}>
          <Text style={[styles.name, { color: textColor }]}>
            {astrologer.name}
          </Text>
          <Text style={styles.category}>{astrologer.category}</Text>
        </View>
        <Text style={[styles.experience, { color: subTextColor }]}>
          {astrologer.languagesKnown.join(", ")}
        </Text>
        <Text style={[styles.experience, { color: subTextColor }]}>
          {astrologer.experience} years of experience
        </Text>
        <Text style={styles.fees}>
          <Text style={{ color: Colors[colorScheme ?? "light"].priceText }}>
            ${astrologer.feesPerMinute}
          </Text>
          <Text style={{ color: Colors[colorScheme ?? "light"].text }}>
            /min
          </Text>
        </Text>
      </View>

      <View style={styles.contactColumn}>
        {astrologer.verified && (
          <SVGImages.VerifiedIcon style={styles.verifiedIcon} />
        )}
        <View style={styles.buttonsContainer}>
          <TouchableOpacity style={styles.astrologersButton}>
            <Text style={styles.astrologersText}>Free Chat</Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    marginBottom: 20,
    borderRadius: 10,
  },
  card: {
    flexDirection: "row",
    borderRadius: 10,
    padding: 10,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#FFFFFF",
    position: "relative",
  },
  imageColumn: {
    alignItems: "center",
    marginRight: 10,
  },
  imageContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    overflow: "hidden",
    marginBottom: 5,
  },
  astrologerImage: {
    width: "100%",
    height: "100%",
  },
  ratingContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 5,
  },
  starIcon: {
    marginRight: 2,
  },
  orders: {
    fontSize: 10,
    textAlign: "center",
  },
  infoColumn: {
    flex: 1,
    justifyContent: "center",
  },
  nameContainer: {
    marginBottom: 5,
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
    marginRight: 5,
  },
  category: {
    fontSize: 12,
    color: "#FFAA1E",
    fontFamily: "Nunito-Regular",
  },
  experience: {
    fontSize: 12,
    marginBottom: 5,
  },
  fees: {
    fontSize: 12,
  },
  contactColumn: {
    alignItems: "center",
  },
  astrologersButton: {
    backgroundColor: "#7728DC",
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 10,
    marginTop: 10,
  },
  astrologersText: {
    fontSize: 12,
    color: "#fff",
    textAlign: "center",
    fontFamily: "Nunito-Bold",
  },
  verifiedIcon: {
    width: 24,
    height: 24,
  },
});

export default AstroCard;
