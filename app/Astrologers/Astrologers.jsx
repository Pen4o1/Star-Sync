import React, { useState } from "react";
import { StyleSheet, ScrollView, View } from "react-native";
import { astrologersData } from "../../mock/astrologersMock"; // Adjust the path as necessary
import { ThemedView } from "../../components/ThemedView"; // Adjust the path as necessary
import AstrologersHeader from "../../components/Astrologers/AstrologersHeader";
import AstroCard from "../../components/Astrologers/AstroCard";

const Astrologers = () => {
  const [searchBarVisible, setSearchBarVisible] = useState(false);
  const [searchText, setSearchText] = useState("");

  const handleMenuPress = () => {
    // Handle menu press
  };

  const handleSearchPress = () => {
    setSearchBarVisible((prevState) => !prevState); // Toggle search bar visibility
  };

  const handleSearchTextChange = (text) => {
    setSearchText(text); // Update search text
  };

  // Filter astrologersData based on search text
  const filteredAstrologers = astrologersData.filter((astrologer) =>
    astrologer.name.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <ThemedView style={styles.container}>
      <AstrologersHeader
        onMenuPress={handleMenuPress}
        onSearchPress={handleSearchPress}
        searchBarVisible={searchBarVisible}
        onSearchTextChange={handleSearchTextChange}
        searchText={searchText}
      />
      <ScrollView showsVerticalScrollIndicator={false}>
        {filteredAstrologers.map((astrologer, index) => (
          <AstroCard key={index} astrologer={astrologer} />
        ))}
      </ScrollView>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 40,
  },
});

export default Astrologers;
