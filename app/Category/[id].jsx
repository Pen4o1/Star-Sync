import React, { useMemo } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import { FontAwesome6 } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { ThemedView } from "../../components/ThemedView";
import { ThemedText } from "../../components/ThemedText";
import { categoryData } from "../../mock/categoryMock";
import CategoryBg from "../../assets/images/CategoryBG.png";

const CategoryDetail = () => {
  const { id } = useLocalSearchParams();

  // Memoize category data lookup based on ID
  const data = useMemo(() => categoryData.find((item) => item.id == id), [id]);

  // Static values for lucky number and color
  const luckyNumber = "2-4-7-8-9";
  const luckyColor = "Green";

  const handleBack = () => {
    router.back();
  };

  // If data is not found, return a fallback message
  if (!data) {
    return (
      <ThemedView style={styles.centeredContainer}>
        <ThemedText type="title">Category not found</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      {/* Header with back button */}
      <View style={styles.header}>
        <View style={styles.backgroundContainer}>
          <TouchableOpacity onPress={handleBack}>
            {/* Icon remains unchanged */}
            <FontAwesome6
              name="arrow-left-long"
              size={20}
              color="black"
              style={styles.nextButton}
            />
          </TouchableOpacity>
        </View>

        <ThemedText type="title" style={styles.headerTitle}>
          {data.name}
        </ThemedText>
        <View style={styles.emptySpace} />
      </View>

      {/* ImageBackground with content inside */}
      <ImageBackground
        source={CategoryBg}
        style={styles.background}
        resizeMode="cover"
      >
        {/* Icon in the top-right */}
        <TouchableOpacity style={styles.iconRight}>
          <data.Component />
        </TouchableOpacity>

        {/* Container for Daily name and timings in the bottom-left */}
        <View style={styles.bottomLeftContainer}>
          <Text style={styles.dailyText}>Daily</Text>
          <ThemedText type="title" style={styles.imageName}>
            {data.name}
          </ThemedText>
          <Text style={styles.timings}>Morning 6:30am - Evening 4:00pm</Text>
        </View>
      </ImageBackground>

      {/* Horoscope Description */}
      <ThemedText style={styles.subheading}>Today</ThemedText>
      <ThemedText style={styles.description}>
        Today is a great day to focus on your goals and ambitions. You will find
        yourself full of energy and ready to tackle any challenges that come
        your way. It's a perfect time to start new projects or complete pending
        tasks.
      </ThemedText>

      {/* Lucky Color and Number */}
      <View style={styles.luckyContainer}>
        <View style={styles.luckyItem}>
          <ThemedText style={styles.luckyLabel}>Lucky Color</ThemedText>
          <View
            style={[
              styles.luckyColorBox,
              { backgroundColor: luckyColor.toLowerCase() },
            ]}
          >
            <Text style={styles.luckyColorText}>{luckyColor}</Text>
          </View>
        </View>
        <View style={styles.luckyItem}>
          <ThemedText style={styles.luckyLabel}>Lucky Number</ThemedText>
          <ThemedText style={styles.luckyValue}>{luckyNumber}</ThemedText>
        </View>
      </View>
    </ThemedView>
  );
};

export default CategoryDetail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  centeredContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 40,
    justifyContent: "space-between",
  },
  backButton: {
    backgroundColor: "#FFAA1E",
    padding: 10,
    borderRadius: 10,
    transform: [{ rotate: "-220deg" }],
  },
  headerTitle: {
    fontSize: 20,
  },
  emptySpace: {
    width: 40, // This keeps the header centered by balancing the back button space
  },
  background: {
    width: "100%",
    marginVertical: 30,
    height: 200,
    borderRadius: 15,
    overflow: "hidden",
  },
  iconRight: {
    position: "absolute",
    top: 10,
    right: 20,
  },
  bottomLeftContainer: {
    position: "absolute",
    bottom: 10,
    left: 20,
  },
  dailyText: {
    color: "#fff",
    fontSize: 16,
    marginBottom: 5,
  },
  imageName: {
    color: "white",
    fontSize: 20,
  },
  timings: {
    color: "#fff",
    fontSize: 14,
  },
  subheading: {
    fontSize: 20,
    fontWeight: "bold",
  },
  description: {
    fontSize: 16,
    marginBottom: 20,
  },
  luckyContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  luckyItem: {
    flex: 1,
    alignItems: "center",
  },
  luckyLabel: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  luckyColorBox: {
    padding: 10,
    borderRadius: 5,
  },
  luckyColorText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
  luckyValue: {
    fontSize: 16,
  },
  backgroundContainer: {
    width: 40,
    alignItems: "center",
    backgroundColor: "#FFAA1E",
    transform: [{ rotate: "220deg" }],
    borderRadius: 10,
  },
  nextButton: {
    padding: 10,
    borderRadius: 5,
    transform: [{ rotate: "-220deg" }],
  },
});
