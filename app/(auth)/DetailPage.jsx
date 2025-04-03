import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import NameComponent from "../../components/DetailComponents/NameComponent";
import DOBComponent from "../../components/DetailComponents/DOBComponent";
import BirthTimeComponent from "../../components/DetailComponents/BirthTimeComponent";
import CityComponent from "../../components/DetailComponents/CityComponent";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomButton from "../../components/CustomButton";
import { FontAwesome6 } from "@expo/vector-icons";
import * as Progress from "react-native-progress";
import { useNavigation } from "@react-navigation/native"; // Import useNavigation
import { ThemedView } from "../../components/ThemedView";
import { Colors } from "../../constants/Colors";
import { useColorScheme } from "../../hooks/useColorScheme";
import { StatusBar } from "expo-status-bar";

const DetailPage = () => {
  const [step, setStep] = useState(0); // Initial step
  const navigation = useNavigation(); // Initialize navigation
  const ColorScheme = useColorScheme();
  const handleContinue = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      // Navigate to the Zodiac page if step is 4
      navigation.navigate("ZodiacComponent");
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1);
    } else {
      navigation.goBack();
    }
  };

  const renderComponent = () => {
    switch (step) {
      case 0:
        return <NameComponent />;
      case 1:
        return <DOBComponent />;
      case 2:
        return <BirthTimeComponent />;
      case 3:
        return <CityComponent />;
      default:
        return <NameComponent />;
    }
  };

  return (
    <ThemedView style={styles.container}>
      <StatusBar />
      <SafeAreaView>
        <View style={styles.header}>
          <View
            style={[
              styles.backgroundContainer,
              { backgroundColor: Colors[ColorScheme ?? "light"].buttonBg },
            ]}
          >
            <TouchableOpacity onPress={handleBack}>
              <FontAwesome6
                name="arrow-left-long"
                size={18}
                color={Colors[ColorScheme ?? "light"].buttonText}
                style={styles.nextButton}
              />
            </TouchableOpacity>
          </View>
          <Progress.Bar
            progress={(step + 1) / 4}
            width={200}
            color={Colors[ColorScheme ?? "light"].buttonBg}
          />
          <View />
        </View>
        <ScrollView>{renderComponent()}</ScrollView>
      </SafeAreaView>
      <CustomButton
        text="Continue"
        bgColor={Colors[ColorScheme ?? "light"].buttonBg}
        onPress={handleContinue}
        textColor={Colors[ColorScheme ?? "light"].buttonText}
      />
    </ThemedView>
  );
};

export default DetailPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    color: "white",
    paddingHorizontal: 20,
    justifyContent: "space-between",
    paddingBottom: 40,
  },
  header: {
    flexDirection: "row",
    marginTop: 40,
    marginBottom: 35,
    alignItems: "center",
    justifyContent: "space-between",
    gap: 20,
  },
  backgroundContainer: {
    width: 30,
    height: 30,
    alignItems: "center",

    transform: [{ rotate: "230deg" }],
    borderRadius: 5,
  },
  nextButton: {
    padding: 5,
    borderRadius: 5,
    transform: [{ rotate: "-230deg" }],
  },
  stepText: {
    color: "#FFF",
    fontSize: 24,
    textAlign: "center",
    marginVertical: 20,
  },
});
