import { StyleSheet, Text, TextInput, View } from "react-native";
import React from "react";
import { ThemedText } from "../ThemedText";
import { Colors } from "../../constants/Colors";
import { useColorScheme } from "../../hooks/useColorScheme";
const NameComponent = () => {
  const ColorScheme = useColorScheme();
  return (
    <View style={styles.container}>
      <ThemedText style={styles.heading}>What’s Your Name?</ThemedText>
      <Text style={styles.description}>
        Duis ultricies lacus sed turpis tincidunt id aliquet risus. Interdum
        consectetur libero id faucibus nisl. Eu consequat ac felis donec et odio
        pellentesque diam volutpat.
      </Text>
      <View style={styles.inputContainer}>
        <ThemedText
          style={[
            styles.inputLabel,

            {
              backgroundColor: Colors[ColorScheme ?? "light"].background,
              color: Colors[ColorScheme ?? "light"].text,
            },
          ]}
        >
          Full Name
        </ThemedText>
        <TextInput
          style={[
            styles.textInput,
            {
              borderColor: Colors[ColorScheme ?? "light"].text,
              color: Colors[ColorScheme ?? "light"].text,
            },
          ]}
          placeholder="Lucifer"
          placeholderTextColor="#666"
        />
      </View>
    </View>
  );
};

export default NameComponent;

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
    lineHeight: 24,
  },
  inputContainer: {
    marginVertical: 40,
  },
  inputLabel: {
    position: "absolute",
    top: -13,
    left: 15,
    paddingHorizontal: 5,
    zIndex: 1,
    fontSize: 14,
    fontWeight: "bold",
  },
  textInput: {
    height: 50,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    borderColor: "#CCCCCC",
  },
});
