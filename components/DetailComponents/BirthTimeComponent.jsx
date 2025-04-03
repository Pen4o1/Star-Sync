import { StyleSheet, Text, View } from "react-native";
import React from "react";
import TimePicker from "../../components/TimePicker/TimePicker";
import { ThemedText } from "../ThemedText";

const BirthTimeComponent = () => {
  const handleTimeChange = (time) => {
    console.log("Selected Time:", time);
  };
  return (
    <View style={styles.container}>
      <ThemedText style={styles.heading}>What’s Your Time of Birth?</ThemedText>
      <ThemedText style={styles.description}>
        Duis ultricies lacus sed turpis tincidunt id aliquet risus. Interdum
        consectetur libero id faucibus nisl. Eu consequat ac felis donec et odio
        pellentesque diam volutpat.
      </ThemedText>
      <TimePicker onTimeChange={handleTimeChange} />
    </View>
  );
};

export default BirthTimeComponent;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  description: {
    fontSize: 14,
    color: "#666",
    marginBottom: 20,
    marginTop: 10,
  },
  heading_text: {
    fontSize: 14,
    lineHeight: 24,
    fontFamily: "Lato_400Regular",
    color: "#4C4C4C",
    textAlign: "center",
    paddingTop: 6,
  },
});
