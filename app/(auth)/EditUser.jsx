import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { FontAwesome6 } from "@expo/vector-icons";
import UserDatePicker from "../../components/UserDatePicker";
import userEvents from "../utils/userEvents";

const EditUser = () => {
  const [name, setName] = useState("");
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    const loadUserData = async () => {
      const storedName = await AsyncStorage.getItem("userName");
      const storedDate = await AsyncStorage.getItem("userBirthDate");
      if (storedName) setName(storedName);
      if (storedDate) setDate(new Date(storedDate));
    };
    loadUserData();
  }, []);

  const handleSave = async () => {
    try {
      await AsyncStorage.setItem("userName", name);
      const pad = n => n < 10 ? '0' + n : n;
      const localDateString = `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
      await AsyncStorage.setItem("userBirthDate", localDateString);
      userEvents.emit("refreshUser");
      router.push("/Home");
    } catch (e) {
      alert("Failed to save user data");
    }
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={["#1a1a1a", "#2a2a2a"]} style={styles.gradient}>
        <ScrollView contentContainerStyle={styles.scrollContent}>

          <Text style={styles.heading}>Edit Profile</Text>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Name</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholder="Enter your name"
                placeholderTextColor="#aaa"
                value={name}
                onChangeText={setName}
              />
            </View>
          </View>

          <UserDatePicker value={date} onChange={setDate} />

          <TouchableOpacity
            style={[styles.saveButton, !name && styles.disabledButton]}
            onPress={handleSave}
            disabled={!name}
          >
            <Text style={styles.saveButtonText}>Save</Text>
          </TouchableOpacity>
        </ScrollView>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingTop: 60,
  },
  heading: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginBottom: 40,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: "#fff",
    marginBottom: 8,
  },
  inputWrapper: {
    backgroundColor: "#333",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  input: {
    fontSize: 16,
    color: "#fff",
  },
  saveButton: {
    backgroundColor: "#FFAA1E",
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
    marginTop: 40,
  },
  saveButtonText: {
    color: "#1a1a1a",
    fontSize: 18,
    fontWeight: "bold",
  },
  disabledButton: {
    opacity: 0.5,
  },
});

export default EditUser;
