import { StyleSheet, Text, TextInput, View } from "react-native";
import React from "react";
import { ThemedText } from "../ThemedText";
import { Colors } from "../../constants/Colors";
import { useColorScheme } from "../../hooks/useColorScheme";

const CityComponent = () => {
  const ColorScheme = useColorScheme();

  return (
    <View style={styles.container}>
      <ThemedText style={styles.heading}>Where ever you born</ThemedText>
      <ThemedText style={styles.description}>
        Duis ultricies lacus sed turpis tincidunt id aliquet risus. Interdum
        consectetur libero id faucibus nisl. Eu consequat ac felis donec et odio
        pellentesque diam volutpat.
      </ThemedText>
      <View style={styles.inputContainer}>
        <ThemedText
          style={[
            styles.inputLabel,
            { backgroundColor: Colors[ColorScheme ?? "light"].background },
          ]}
        >
          Your City
        </ThemedText>
        <TextInput
          style={[
            styles.textInput,
            {
              borderColor: Colors[ColorScheme ?? "light"].text,
              color: Colors[ColorScheme ?? "light"].text,
            },
          ]}
          placeholder="Newyork"
          placeholderTextColor="#666"
        />
      </View>
    </View>
  );
};

export default CityComponent;

const styles = StyleSheet.create({
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "left",
  },
  description: {
    fontSize: 14,
    color: "#A4A4A4",
    marginBottom: 20,
    textAlign: "left",
  },
  inputContainer: {
    marginVertical: 40,
  },
  inputLabel: {
    position: "absolute",
    top: -10,
    left: 15,
    backgroundColor: "#0D114E",
    paddingHorizontal: 5,
    zIndex: 1,
    fontSize: 14,
  },
  textInput: {
    height: 50,
    borderColor: "#fff",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 16,
  },
});
