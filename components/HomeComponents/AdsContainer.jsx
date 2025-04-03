import React from "react";
import { StyleSheet, View, Image, Dimensions } from "react-native";
import Swiper from "react-native-swiper";
import Ads from "../../assets/images/Ads.png"; // Path to your image

const AdsContainer = () => {
  // Array of images for the swiper
  const images = [Ads, Ads, Ads]; // Using the same image for testing

  return (
    <View style={styles.container}>
      <Swiper
        style={styles.swiper}
        dot={<View style={styles.dot} />}
        activeDot={<View style={styles.activeDot} />}
        paginationStyle={styles.pagination}
        loop
        autoplay
        autoplayTimeout={3} // Optional: Automatically advance slides
      >
        {images.map((image, index) => (
          <View key={index} style={styles.slide}>
            <Image source={image} style={styles.image} />
          </View>
        ))}
      </Swiper>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 20,
  },
  swiper: {
    height: 220,
  },
  slide: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "contain", // Consider using 'cover' to ensure full coverage
  },
  pagination: {
    bottom: 1, // Adjusted for better visibility
  },
  dot: {
    backgroundColor: "#f1f1f1",
    width: 23,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 3,
  },
  activeDot: {
    backgroundColor: "#FFAA1E",
    width: 23,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 3,
  },
});

export default AdsContainer;
