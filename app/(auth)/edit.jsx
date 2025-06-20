import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { FontAwesome6 } from '@expo/vector-icons';
import UserDatePicker from '../../components/UserDatePicker';
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
      // Save date as YYYY-MM-DD in local time
      const pad = n => n < 10 ? '0' + n : n;
      const localDateString = `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
      await AsyncStorage.setItem("userBirthDate", localDateString);
      userEvents.emit('refreshUser');
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
      <LinearGradient
        colors={[
          "rgba(179, 121, 223, 0.29)",
          "rgba(204, 84, 199, 0.2)",
          "rgba(179, 121, 223, 0.39)",
        ]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.cardContainer}
      >
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <FontAwesome6 name="arrow-left" size={22} color="#FFAA1E" />
        </TouchableOpacity>
        <Text style={styles.heading}>Edit Profile</Text>
        <View style={styles.inputContainer}>
          <Text style={[styles.label, styles.labelWhite]}>Name</Text>
          <View style={styles.inputWrapper}>
            <TextInput
              style={[styles.input, styles.inputWhite]}
              placeholder="Enter your name"
              placeholderTextColor="#FFFFFF"
              value={name}
              onChangeText={setName}
            />
          </View>
        </View>
        <UserDatePicker value={date} onChange={setDate} />
        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleSave}
          disabled={!name}
        >
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  cardContainer: {
    padding: 20,
    borderRadius: 30,
    width: "90%",
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 10,
    zIndex: 10,
    padding: 8,
    backgroundColor: 'rgba(0,0,0,0.08)',
    borderRadius: 10,
  },
  heading: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#EFEFEF",
    marginBottom: 20,
    textAlign: "center",
    marginTop: 10,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
  },
  labelWhite: {
    color: "#FFFFFF",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    paddingLeft: 20,
    borderRadius: 20,
    minHeight: 48,
    backgroundColor: "rgba(255,255,255,0.05)",
  },
  input: {
    flex: 1,
    borderRadius: 15,
    paddingVertical: 8,
    paddingHorizontal: 10,
    backgroundColor: "transparent",
    color: "#FFFFFF",
    fontSize: 16,
  },
  inputWhite: {
    color: "#FFFFFF",
  },
  saveButton: {
    backgroundColor: "#FFAA1E",
    padding: 15,
    borderRadius: 20,
    alignItems: "center",
    marginTop: 20,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default EditUser; 