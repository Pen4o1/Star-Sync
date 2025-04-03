import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import React from "react";
import CustomButton from "../../components/CustomButton";
import { router, useNavigation } from "expo-router";
import { ThemedView } from "../../components/ThemedView";
import { ThemedText } from "../../components/ThemedText";
import { Colors } from "../../constants/Colors";
import { useColorScheme } from "../../hooks/useColorScheme";

const Notification = () => {
  const navigation = useNavigation();
  const ColorScheme = useColorScheme();
  return (
    <ThemedView style={styles.container}>
      <View />
      <View style={styles.content}>
        <Image
          source={require("../../assets/images/Auth/bell.png")}
          style={styles.image}
        />
        <ThemedText type="title" style={styles.heading}>
          Stay Ahead of the Crowd
        </ThemedText>
        <ThemedText style={styles.description}>
          Duis ultricies lacus sed turpis tincidunt id aliquet risus.
        </ThemedText>
        <View style={styles.buttonContainer}>
          <CustomButton
            text="Allow Notifications"
            onPress={() => {
              navigation.navigate("SignIn");
            }}
          />
          <Text style={styles.buttonDescription}>
            Duis ultricies lacus sed turpis tincidunt id aliquet risus.
          </Text>
        </View>
      </View>

      <TouchableOpacity
        onPress={() => {
          router.push("Home");
        }}
      >
        <Text
          style={[
            styles.skipText,
            { color: Colors[ColorScheme ?? "light"].buttonBg },
          ]}
        >
          Skip this for now
        </Text>
      </TouchableOpacity>
    </ThemedView>
  );
};

export default Notification;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    paddingBottom: 40,
  },
  content: {
    alignItems: "center",
    marginBottom: 20,
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  description: {
    fontSize: 16,
    marginBottom: 40,
    textAlign: "center",
  },
  buttonContainer: {
    width: "100%",
    marginBottom: 20,
  },
  buttonDescription: {
    fontSize: 14,
    color: "#C4C4C4",
    textAlign: "center",
    marginTop: 20,
  },
  skipText: {
    fontSize: 16,
    fontWeight: "bold",
  },
});
