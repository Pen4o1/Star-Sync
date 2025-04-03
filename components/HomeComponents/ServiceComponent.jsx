import React, { useContext } from "react";
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import SVGImages from "../../assets/images/SVG";
import { useNavigation } from "@react-navigation/native"; // Import useNavigation hook
import ThemeContext from "../../theme/ThemeContext";
import { ThemedText } from "../ThemedText";

const services = [
  {
    image: "VedicAstrology",
    title: "Vedic Astrology",
  },
  {
    image: "TarotReading",
    title: "Tarot Reading",
  },
  {
    image: "Numerology",
    title: "Numerology",
  },
  {
    image: "PsychicReading",
    title: "Psychic Reading",
  },
  {
    image: "Relationship",
    title: "Relationship",
  },
  {
    image: "CareerJob",
    title: "Career & Job",
  },
];

const ServiceComponent = () => {
  const navigation = useNavigation(); // Initialize the navigation object
  const theme = useContext(ThemeContext);

  return (
    <View style={styles.container}>
      <View style={styles.servicesContainer}>
        {services.map((service, index) => {
          const SvgIcon = SVGImages.Services[service.image]; // Dynamically use the SVG component
          return (
            <TouchableOpacity key={index} style={styles.serviceItem}>
              <SvgIcon width={103} height={70} />
              <ThemedText style={styles.title}>{service.title}</ThemedText>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

export default ServiceComponent;

const styles = StyleSheet.create({
  seeAllText: {
    fontSize: 16,
    color: "#FFAA1E",
  },
  servicesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 15,
  },
  serviceItem: {
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    marginTop: 10,
    fontSize: 14,
    fontWeight: "bold",
  },
});
