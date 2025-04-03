import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import CustomButton from "../../components/CustomButton";
import { useNavigation } from "expo-router";
import { ThemedText } from "../../components/ThemedText";
import { ThemedView } from "../../components/ThemedView";
const ZodiacComponent = () => {
  const navigation = useNavigation();
  const zodiacSigns = [
    { name: "Aries", image: require("../../assets/images/Auth/Aries.png") },
    { name: "Taurus", image: require("../../assets/images/Auth/Taurus.png") },
    { name: "Gemini", image: require("../../assets/images/Auth/Gemini.png") },
    { name: "Cancer", image: require("../../assets/images/Auth/Cancer.png") },
    { name: "Leo", image: require("../../assets/images/Auth/Leo.png") },
    { name: "Virgo", image: require("../../assets/images/Auth/Virgo.png") },
    { name: "Libra", image: require("../../assets/images/Auth/Libra.png") },
    { name: "Scorpio", image: require("../../assets/images/Auth/Scorpio.png") },
    {
      name: "Sagittarius",
      image: require("../../assets/images/Auth/Sagittarius.png"),
    },
    {
      name: "Capricorn",
      image: require("../../assets/images/Auth/Capricon.png"),
    },
    {
      name: "Aquarius",
      image: require("../../assets/images/Auth/Aquarius.png"),
    },
    { name: "Pisces", image: require("../../assets/images/Auth/Pisces.png") },
  ];

  const [selectedSign, setSelectedSign] = useState("");
  const [clickedContinue, setClickedContinue] = useState(false);

  const handleSelectSign = (signName) => {
    setSelectedSign(signName);
  };

  const navigateToNotificationPage = () => {
    if (clickedContinue) {
      navigation.navigate("Notification", {
        partnerZodiacSign: selectedSign,
      });
    } else {
      setClickedContinue(true);
    }
  };

  return (
    <ThemedView style={[styles.container]}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          <ThemedText type="title" style={styles.heading}>
            {clickedContinue
              ? `Your Partner's Zodiac Sign`
              : `Your Zodiac Sign`}
          </ThemedText>
          <Text style={styles.description}>
            Duis ultricies lacus sed turpis tincidunt id aliquet risus.
          </Text>
          {zodiacSigns.map((sign, index) => (
            <TouchableOpacity
              key={index}
              style={styles.signContainer}
              onPress={() => handleSelectSign(sign.name)}
            >
              <Image source={sign.image} style={styles.signImage} />
              <ThemedText style={styles.signName}>{sign.name}</ThemedText>
            </TouchableOpacity>
          ))}
        </ScrollView>
        <View style={styles.btn}>
          <CustomButton text="Continue" onPress={navigateToNotificationPage} />
        </View>
      </SafeAreaView>
    </ThemedView>
  );
};

export default ZodiacComponent;

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 40 },
  safeArea: { flex: 1 },
  scrollViewContent: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  heading: {
    fontSize: 24,
    marginBottom: 10,
    textAlign: "left",
    marginLeft: 20,
  },
  description: {
    fontSize: 14,
    color: "#A4A4A4",
    marginBottom: 20,
    textAlign: "left",
    marginLeft: 20,
  },
  signContainer: {
    alignItems: "center",
    marginBottom: 20,
    width: "30%",
  },
  signImage: {
    width: "100%",
    height: 100,
    resizeMode: "contain",
  },
  signName: {
    fontSize: 16,
    marginTop: 10,
  },
  btn: {
    paddingHorizontal: 20,
  },
});
