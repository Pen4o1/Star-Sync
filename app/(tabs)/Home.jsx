import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useContext } from "react";
import CategoryComponent from "../../components/HomeComponents/CategoryComponent";
import { SafeAreaView } from "react-native-safe-area-context";
import BlogComponent from "../../components/HomeComponents/BlogComponent";
import ServiceComponent from "../../components/HomeComponents/ServiceComponent";
import HeaderComponent from "../../components/HomeComponents/HeaderComponent";
import ThemeContext from "../../theme/ThemeContext";
import AstrologersComponent from "../../components/HomeComponents/AstrologersComponent";
import { ThemedView } from "../../components/ThemedView";
import { ThemedText } from "../../components/ThemedText";
import { router } from "expo-router";
import Ads from "../../assets/images/Ads.png";
import AdsContainer from "../../components/HomeComponents/AdsContainer";
const Home = () => {
  const handleSeeAll = () => {
    router.push("/Astrologers/Astrologers");
  };
  return (
    <ThemedView style={styles.container}>
      <SafeAreaView>
        <ScrollView showsVerticalScrollIndicator={false}>
          <HeaderComponent />
          <View style={styles.sectionContainer}>
            <View style={styles.subHeadingContainer}>
              <ThemedText type="subtitle" style={styles.subtitle}>
                Categorys
              </ThemedText>
              <TouchableOpacity>
                <Text style={styles.seeAllText}>See All</Text>
              </TouchableOpacity>
            </View>
            <CategoryComponent />
          </View>

          <AdsContainer />

          <View style={styles.sectionContainer}>
            <View style={styles.subHeadingContainer}>
              <ThemedText type="subtitle" style={styles.subtitle}>
                Astrologers
              </ThemedText>
              <TouchableOpacity onPress={handleSeeAll}>
                <Text style={styles.seeAllText}>See All</Text>
              </TouchableOpacity>
            </View>
            <AstrologersComponent />
          </View>
          <View style={styles.sectionContainer}>
            <View style={styles.subHeadingContainer}>
              <ThemedText type="subtitle" style={styles.subtitle}>
                Our Services
              </ThemedText>
              <TouchableOpacity>
                <Text style={styles.seeAllText}>See All</Text>
              </TouchableOpacity>
            </View>
            <ServiceComponent />
          </View>
          <View style={styles.sectionContainer}>
            <View style={styles.subHeadingContainer}>
              <ThemedText type="subtitle" style={styles.subtitle}>
                Our Blogs
              </ThemedText>
              <TouchableOpacity>
                <Text style={styles.seeAllText}>See All</Text>
              </TouchableOpacity>
            </View>
            <BlogComponent />
          </View>
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingBottom: 120,
  },
  subHeadingContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30,
  },
  subtitle: {
    fontSize: 18,
  },
  seeAllText: {
    color: "#FFAA1E",
  },
  sectionContainer: {
    marginBottom: 30,
  },
  ads: {
    width: "100%",
    height: 200,
    resizeMode: "contain",
    marginBottom: "30",
  },
});
