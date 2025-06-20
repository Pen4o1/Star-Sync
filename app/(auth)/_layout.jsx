// AuthLayout.js
import React from "react";
import { StatusBar } from "expo-status-bar";
import { View, StyleSheet } from "react-native";
import { Stack } from "expo-router";

const AuthLayout = () => {
  return (
    <View style={styles.container}>
      <Stack>
        <Stack.Screen name="SignIn" options={{ headerShown: false }} />
        <Stack.Screen name="SignUp" options={{ headerShown: false }} />
        <Stack.Screen name="DetailPage" options={{ headerShown: false }} />
        <Stack.Screen name="EditUser" options={{ headerShown: false }} />
        <Stack.Screen name="ZodiacComponent" options={{ headerShown: false }} />
        <Stack.Screen name="Notification" options={{ headerShown: false }} />
      </Stack>
      <StatusBar style="light" />
    </View>
  );
};

export default AuthLayout;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
