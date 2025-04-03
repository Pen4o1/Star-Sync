import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { useColorScheme } from "../hooks/useColorScheme";
import { Colors } from "../constants/Colors";

const CustomButton = ({ text, onPress, borderColor, bgColor, textColor }) => {
  const colorScheme = useColorScheme() ?? "light";

  // Set default colors using the color scheme
  const backgroundColor = bgColor || Colors[colorScheme].buttonBg;
  const color = textColor || Colors[colorScheme].buttonText;

  return (
    <TouchableOpacity
      style={[
        styles.button,
        { borderColor: borderColor || backgroundColor, backgroundColor },
      ]}
      onPress={onPress}
    >
      <Text style={[styles.text, { color }]}>{text}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 10,
  },
  text: {
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default CustomButton;
