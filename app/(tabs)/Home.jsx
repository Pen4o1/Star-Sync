import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemedView } from "../../components/ThemedView";
import { ThemedText } from "../../components/ThemedText";
import HeaderComponent from "../../components/HomeComponents/HeaderComponent";
import HoroscopeOfTheDay from "../../components/HomeComponents/HoroscopeOfTheDay";
import ChineseHoroscope from "../../components/HomeComponents/ChineseHoroscope";
import DreamBook from "../../components/HomeComponents/DreamBook";
import Matches from "../../components/HomeComponents/Matches";
import DropdownMenu from "../../components/HomeComponents/DropdownMenu";

const Home = () => {
  return (
    <ThemedView style={styles.container}>
      <SafeAreaView>
        <DropdownMenu /> {/* Dropdown in top left */}
        <ScrollView showsVerticalScrollIndicator={false}>
          <HeaderComponent />

          {/* Horoscope of the Day */}
          <View style={styles.sectionContainer}>
            <ThemedText type="subtitle" style={styles.subtitle}>
              Horoscope of the Day
            </ThemedText>
            <HoroscopeOfTheDay userZodiacId={5} />
          </View>

          {/* Chinese Horoscope */}
          <View style={styles.sectionContainer}>
            <ThemedText type="subtitle" style={styles.subtitle}>
              Chinese Horoscope
            </ThemedText>
            <ChineseHoroscope initialAnimalId={4}/>
          </View>

          {/* Dream Book & Matches Side by Side */}
          <View style={styles.rowContainer}>
            <View style={styles.half}>
              <ThemedText type="subtitle" style={styles.subtitle}>
                Dream Book
              </ThemedText>
              <DreamBook />
            </View>
            <View style={styles.half}>
              <ThemedText type="subtitle" style={styles.subtitle}>
                Matches
              </ThemedText>
              <Matches />
            </View>
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
  sectionContainer: {
    marginBottom: 30,
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 10,
  },
  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30,
  },
  half: {
    width: "48%",
  },
});
