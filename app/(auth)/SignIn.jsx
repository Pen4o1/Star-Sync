import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { FontAwesome } from "@expo/vector-icons";
import CustomButton from "../../components/CustomButton";
import { Redirect, router, useNavigation } from "expo-router";

const SignIn = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const navigation = useNavigation();

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };
  const handleSignIn = () => {
    router.push("/Home");
    console.log("pressed");
  };
  return (
    <ImageBackground
      source={require("../../assets/images/Auth/SignInBG.png")}
      style={styles.backgroundImage}
    >
      <ScrollView contentContainerStyle={styles.scrollView}>
        <View style={styles.container}>
          <Text style={styles.heading}>Welcome Back!</Text>
          <Text style={styles.subHeading}>we missed you</Text>
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
            <View style={styles.inputContainer}>
              <Text style={[styles.label, styles.labelWhite]}>Username</Text>
              <View style={styles.inputWrapper}>
                <FontAwesome
                  name="user"
                  size={24}
                  color="#FFFFFF"
                  style={styles.icon}
                />
                <TextInput
                  style={[styles.input, styles.inputWhite]}
                  placeholder="Username"
                  placeholderTextColor="#FFFFFF"
                />
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Text style={[styles.label, styles.labelWhite]}>Password</Text>
              <View style={[styles.inputWrapper, styles.passwordInput]}>
                <FontAwesome
                  name="lock"
                  size={24}
                  color="#FFFFFF"
                  style={styles.icon}
                />
                <TextInput
                  style={[styles.input, styles.inputWhite]}
                  placeholder="Password"
                  placeholderTextColor="#FFFFFF"
                  secureTextEntry={!passwordVisible}
                />
                <TouchableOpacity onPress={togglePasswordVisibility}>
                  <FontAwesome
                    name={passwordVisible ? "eye-slash" : "eye"}
                    size={24}
                    color="#FFFFFF"
                    style={styles.eyeIcon}
                  />
                </TouchableOpacity>
              </View>
            </View>
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>

            <CustomButton
              text="Log in"
              onPress={handleSignIn}
              borderColor="transparent"
            />

            <View style={styles.otherSignInOptions}>
              <View style={styles.hrContainer}>
                <LinearGradient
                  colors={[
                    "rgba(217, 217, 217, 0.1)",
                    "rgba(217, 217, 217, 0.7)",
                  ]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.hr}
                />
                <Text style={styles.otherSignInText}>Or continue with</Text>
                <LinearGradient
                  colors={[
                    "rgba(217, 217, 217, 0.7)",
                    "rgba(217, 217, 217, 0.1)",
                  ]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.hr}
                />
              </View>

              <View style={styles.socialIconsContainer}>
                <SocialIcon
                  onPress={() => console.log("Google sign in pressed")}
                  source={require("../../assets/images/Auth/GoogleIcon.png")}
                />
                <SocialIcon
                  onPress={() => console.log("Facebook sign in pressed")}
                  source={require("../../assets/images/Auth/FacebookIcon.png")}
                />
                <SocialIcon
                  onPress={() => console.log("Apple sign in pressed")}
                  source={require("../../assets/images/Auth/AppleIcon.png")}
                />
              </View>
            </View>

            <View style={styles.textContainer}>
              <Text style={styles.signUpText}>
                Don't have an account?
                <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
                  <Text style={styles.signUpLink}>Sign Up</Text>
                </TouchableOpacity>
              </Text>
            </View>
          </LinearGradient>
        </View>
      </ScrollView>
    </ImageBackground>
  );
};

const SocialIcon = ({ onPress, source }) => (
  <TouchableOpacity onPress={onPress} style={styles.socialIconButton}>
    <Image source={source} style={styles.socialIcon} />
  </TouchableOpacity>
);

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
  heading: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#EFEFEF",
    marginBottom: 15,
  },
  subHeading: {
    fontSize: 14,
    color: "#A4A4A4",
    marginBottom: 25,
  },
  cardContainer: {
    padding: 20,
    borderRadius: 30,
    width: "90%",
  },
  inputContainer: {
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    marginBottom: 15,
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
    marginBottom: 15,
  },
  passwordInput: {
    position: "relative",
  },
  input: {
    flex: 1,
    borderRadius: 15,
    paddingVertical: 8,
    paddingHorizontal: 10,
    backgroundColor: "transparent",
  },
  inputWhite: {
    color: "#FFFFFF",
  },
  icon: {
    marginRight: 10,
  },
  eyeIcon: {
    position: "absolute",
    right: 10,
    top: -10,
  },
  hrContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 10,
  },
  hr: {
    height: 1,
    width: "30%",
  },
  otherSignInOptions: {
    marginTop: 15,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  otherSignInText: {
    fontSize: 16,
    color: "#B6B6B6",
    marginHorizontal: 10,
  },
  socialIconsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  socialIcon: {
    width: 35,
    height: 35,
    marginHorizontal: 10,
  },
  textContainer: {
    marginTop: 20,
    alignItems: "center",
    gap: 10,
  },
  signUpText: {
    color: "#FFFFFF",
    flexDirection: "column",
    alignItems: "center",
  },
  signUpLink: {
    color: "#FFAA1E",
    marginBottom: -4,
    marginLeft: 5,
  },
  forgotPasswordText: {
    color: "#C4C4C4",
    textAlign: "right",
    marginBottom: 30,
  },
  socialIconButton: {},
});

export default SignIn;
