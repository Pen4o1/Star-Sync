import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import UserDatePicker from "../../components/UserDatePicker";
import userEvents from "../utils/userEvents";
import { restorePurchasesForUid } from "../../services/iapService";
import { getUid } from "../../services/uidService";
import { FontAwesome6 } from "@expo/vector-icons";

const EditUser = () => {
  const [name, setName] = useState("");
  const [date, setDate] = useState(new Date());
  const [isRestoring, setIsRestoring] = useState(false);

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
      router.push("/(tabs)");
    } catch (e) {
      alert("Failed to save user data");
    }
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.clear();
      userEvents.emit("refreshUser");
      router.replace("/(auth)/SignIn");
    } catch (e) {
      alert("Failed to logout");
    }
  };

  const handleRestorePurchases = async () => {
    if (isRestoring) return;
    
    setIsRestoring(true);
    try {
      const uid = await getUid();
      const restored = await restorePurchasesForUid(uid);
      
      if (restored.length > 0) {
        Alert.alert(
          "✅ Success!", 
          `Restored ${restored.length} purchase${restored.length > 1 ? 's' : ''} successfully.\n\nYour subscription has been restored and you now have access to all premium features.`,
          [{ text: "Great!", style: "default" }]
        );
      } else {
        Alert.alert(
          "ℹ️ No Purchases Found", 
          "No previous purchases were found to restore.\n\nIf you believe this is an error, please contact support.",
          [{ text: "OK", style: "default" }]
        );
      }
    } catch (err) {
      console.warn('Restore purchases error:', err);
      Alert.alert(
        "❌ Restore Failed", 
        "Unable to restore purchases at this time. Please check your internet connection and try again.\n\nIf the problem persists, contact support.",
        [{ text: "OK", style: "default" }]
      );
    } finally {
      setIsRestoring(false);
    }
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
            <Text style={styles.saveButtonText}>Save Changes</Text>
          </TouchableOpacity>

          {/* Restore Purchases Section */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Subscription</Text>
            <Text style={styles.sectionDescription}>
              Restore your previous purchases if you've reinstalled the app or switched devices.
            </Text>
            
            <TouchableOpacity
              style={[styles.restoreButton, isRestoring && styles.disabledButton]}
              onPress={handleRestorePurchases}
              disabled={isRestoring}
            >
              <FontAwesome6 
                name={isRestoring ? "spinner" : "download"} 
                size={16} 
                color="#fff" 
                style={styles.buttonIcon}
              />
              <Text style={styles.restoreButtonText}>
                {isRestoring ? "Restoring..." : "Restore Purchases"}
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.logoutButton}
            onPress={handleLogout}
          >
            <FontAwesome6 name="sign-out-alt" size={16} color="#fff" style={styles.buttonIcon} />
            <Text style={styles.logoutButtonText}>Logout</Text>
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
  sectionContainer: {
    marginTop: 30,
    padding: 20,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 170, 30, 0.2)",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFAA1E",
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 14,
    color: "#ccc",
    lineHeight: 20,
    marginBottom: 20,
  },
  restoreButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  restoreButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
  },
  buttonIcon: {
    marginRight: 8,
  },
  logoutButton: {
    backgroundColor: "#ff4444",
    paddingVertical: 16,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  logoutButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default EditUser;
