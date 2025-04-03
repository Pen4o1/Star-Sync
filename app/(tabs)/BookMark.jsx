import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { ThemedView } from "../../components/ThemedView";
import { ThemedText } from "../../components/ThemedText";

const Bookmark = () => {
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.heading}>
        Bookmark is Coming Soon!
      </ThemedText>
      <ThemedText style={styles.subheading}>
        We're working hard to bring this feature to you.
      </ThemedText>
      <ThemedText style={styles.details}>
        Stay tuned for updates and thank you for your patience!
      </ThemedText>
    </ThemedView>
  );
};

export default Bookmark;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  heading: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subheading: {
    fontSize: 18,
    marginBottom: 10,
    textAlign: "center",
  },
  details: {
    fontSize: 16,
    textAlign: "center",
  },
});
