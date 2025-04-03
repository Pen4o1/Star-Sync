import React, { useRef, useState } from "react";
import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  Animated,
} from "react-native";
import Swiper from "react-native-swiper";
import { FontAwesome6 } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router, useNavigation } from "expo-router";

// Define data for onboarding screens
const onboardingData = [
  {
    backgroundImage: require("../assets/images/onboarding/OnboardingBG1.png"),
    image: require("../assets/images/onboarding/Onboarding1.png"),
    heading: '"Unlock Your Birth Chart"',
    text: "Maecenas sed enim ut sem viverra aliquet. Ac auctor augue mauris augue neque gravida in. Sed turpis tincidunt id aliquet risus feugiat. Commodo elit at imperdiet dui accumsan. At erat pellentesque adipiscing commodo.",
  },
  {
    backgroundImage: require("../assets/images/onboarding/OnboardingBG2.png"),
    image: require("../assets/images/onboarding/Onboarding2.png"),
    heading: '"Discover Your Cosmic Blueprint"',
    text: "Maecenas sed enim ut sem viverra aliquet. Ac auctor augue mauris augue neque gravida in. Sed turpis tincidunt id aliquet risus feugiat. Commodo elit at imperdiet dui accumsan. At erat pellentesque adipiscing commodo.",
  },
  {
    backgroundImage: require("../assets/images/onboarding/OnboardingBG3.png"),
    image: require("../assets/images/onboarding/Onboarding3.png"),
    heading: '"Stay Connected to the Stars" ',
    text: "Maecenas sed enim ut sem viverra aliquet. Ac auctor augue mauris augue neque gravida in. Sed turpis tincidunt id aliquet risus feugiat. Commodo elit at imperdiet dui accumsan. At erat pellentesque adipiscing commodo.",
  },
];

const Index = () => {
  const swiperRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const transitionValue = useRef(new Animated.Value(0)).current;
  const navigation = useNavigation();
  const handleNext = () => {
    if (currentIndex === onboardingData.length - 1) {
      router.push("SignIn");
    } else {
      if (swiperRef.current) {
        swiperRef.current.scrollBy(1);
      }
      // Adding transition animation
      Animated.timing(transitionValue, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start(() => {
        // Reset animation value after completion
        transitionValue.setValue(0);
      });
      setCurrentIndex((prevIndex) => prevIndex + 1);
    }
  };

  return (
    <View style={styles.container}>
      {/* Swiper component for onboarding screens */}
      <Swiper
        ref={swiperRef}
        index={0} // Set the initial slide index to 0
        loop={false}
        showsPagination
        paginationStyle={styles.pagination}
        dotStyle={styles.paginationDot}
        activeDotStyle={styles.paginationActiveDot}
        containerStyle={styles.swiperContainer}
        slideStyle={styles.swiperSlide}
        style={styles.swiper}
        onIndexChanged={(index) => setCurrentIndex(index)}
      >
        {/* Render each onboarding screen */}
        {onboardingData.map((item, index) => (
          <View key={index} style={styles.slide}>
            <Image
              source={item.backgroundImage}
              style={styles.backgroundImage}
            />
            <View style={styles.content}>
              <View style={styles.imageContainer}>
                <Image source={item.image} style={styles.image} />
              </View>
              <View style={styles.onboardingContentContainer}>
                <LinearGradient
                  colors={[
                    "rgba(179, 121, 223, 0.2)",
                    "rgba(204, 84, 199, 0.01)",
                    "rgba(179, 121, 223, 0.2)",
                  ]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.border}
                >
                  <Text style={styles.heading}>{item.heading}</Text>
                  <Text style={styles.text}>{item.text}</Text>
                </LinearGradient>
              </View>
            </View>
          </View>
        ))}
      </Swiper>
      {/* Next button */}
      <View style={styles.backgroundContainer}>
        <TouchableOpacity onPress={handleNext}>
          {/* Icon remains unchanged */}
          <FontAwesome6
            name="arrow-right-long"
            size={20}
            color="black"
            style={styles.nextButton}
          />
        </TouchableOpacity>
      </View>

      {/* StatusBar */}
      <StatusBar style="light" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  slide: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  backgroundImage: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    width: "90%",
    gap: 20,
    textAlign: "center",
    flexWrap: "wrap",
    borderRadius: 30,
  },
  image: {
    width: 300,
    height: 300,
    alignItems: "center",
    marginHorizontal: "auto",
  },

  border: {
    borderWidth: 1,
    borderRadius: 30,
    borderColor: "grey",
    paddingBottom: 30,
  },
  onboardingContentContainer: {
    width: "100%",
    height: 228,
    borderRadius: 30,
  },
  heading: {
    width: "90%",
    fontSize: 30,
    fontWeight: "bold",
    marginVertical: 20,
    textAlign: "center",
    color: "#fff",
    marginHorizontal: "auto",
    fontFamily: "Nunito-Bold",
  },
  text: {
    fontSize: 12,
    textAlign: "center",
    marginHorizontal: 40,
    color: "#a0a0a0",
    fontWeight: "400",
    lineHeight: 20,
  },

  pagination: {
    bottom: 20,
    left: 20,
  },
  paginationDot: {
    width: 12,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#888",
    marginHorizontal: 3,
  },
  paginationActiveDot: {
    width: 28,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#FFAA1E",
    marginHorizontal: 3,
  },

  backgroundContainer: {
    width: 40,
    alignItems: "center",
    position: "absolute",
    bottom: 30,
    right: 20,
    backgroundColor: "#FFAA1E",
    transform: [{ rotate: "220deg" }],
    borderRadius: 10,
  },
  nextButton: {
    padding: 10,
    borderRadius: 5,
    transform: [{ rotate: "-220deg" }],
  },

  swiperContainer: {
    flex: 1,
  },
  swiperSlide: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  swiper: {
    backgroundColor: "transparent",
  },
});

export default Index;
