import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import AsyncStorage from '@react-native-async-storage/async-storage';
import UserDatePicker from '../../components/UserDatePicker';

const SignIn = () => {
  const [name, setName] = useState("");
  const [date, setDate] = useState(new Date());

  const handleSignIn = async () => {
    try {
      await AsyncStorage.setItem('userName', name);
      // Format date as YYYY-MM-DD in local time
      const pad = n => n < 10 ? '0' + n : n;
      const localDateString = `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
      await AsyncStorage.setItem('userBirthDate', localDateString);
    router.push("/Home");
    } catch (e) {
      alert('Failed to save user data');
    }
  };

  return (
    <ImageBackground
      source={require("../../assets/images/Auth/SignInBG.png")}
      style={styles.backgroundImage}
    >
      <ScrollView contentContainerStyle={styles.scrollView}>
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
            <Text style={styles.heading}>Welcome!</Text>
            <Text style={styles.subHeading}>Enter your name and date of birth</Text>
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
              style={styles.loginButton}
              onPress={handleSignIn}
              disabled={!name}
            >
              <Text style={styles.loginButtonText}>Continue</Text>
                </TouchableOpacity>
          </LinearGradient>
        </View>
      </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
  },
  scrollView: {
    flexGrow: 1,
    justifyContent: "center",
  },
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
  cardContainer: {
    padding: 20,
    borderRadius: 30,
    width: "90%",
  },
  heading: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#EFEFEF",
    marginBottom: 15,
    textAlign: 'center',
  },
  subHeading: {
    fontSize: 14,
    color: "#A4A4A4",
    marginBottom: 25,
    textAlign: 'center',
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
    backgroundColor: 'rgba(255,255,255,0.05)'
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
  loginButton: {
    backgroundColor: "#FFAA1E",
    padding: 15,
    borderRadius: 20,
    alignItems: "center",
    marginTop: 20,
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default SignIn;
