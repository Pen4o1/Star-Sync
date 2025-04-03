// AstrologersHeader.js
import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { useColorScheme } from "../../hooks/useColorScheme"; // Adjust path as needed
import SVGImages from "../../assets/images/SVG"; // Adjust path as needed
import { ThemedText } from "../ThemedText";
import MenuIcon from "../../assets/images/SVG/Files/MenuIcon";

const AstrologersHeader = ({
  onMenuPress,
  onSearchPress,
  searchBarVisible,
  onSearchTextChange,
  searchText,
}) => {
  const colorScheme = useColorScheme(); // Detect light or dark mode
  const isDarkMode = colorScheme === "dark";

  return (
    <View style={styles.headerContainer}>
      <View style={styles.headerContent}>
        <TouchableOpacity
          style={[
            styles.iconContainer,
            { borderColor: isDarkMode ? "#FFFFFF" : "#000000" },
          ]}
          onPress={onMenuPress}
        >
          <MenuIcon />
        </TouchableOpacity>
        <ThemedText style={styles.heading}>Astrologers</ThemedText>
        <TouchableOpacity
          style={[
            styles.iconContainer,
            { borderColor: isDarkMode ? "#FFFFFF" : "#000000" },
          ]}
          onPress={onSearchPress}
        >
          <FontAwesome
            name="search"
            size={24}
            color={isDarkMode ? "#FFFFFF" : "#000000"}
          />
        </TouchableOpacity>
      </View>
      {searchBarVisible && (
        <TextInput
          style={[
            styles.searchBar,
            { borderColor: isDarkMode ? "#FFFFFF" : "#000000" },
          ]}
          placeholder="Search..."
          placeholderTextColor={isDarkMode ? "#ccc" : "#666"}
          onChangeText={onSearchTextChange}
          value={searchText}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    width: "100%",
    padding: 10,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  iconContainer: {
    borderRadius: 20,
    padding: 10,
    borderWidth: 1,
    backgroundColor: "transparent",
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
  },
  searchBar: {
    height: 40,
    borderWidth: 1,
    borderRadius: 20,
    marginTop: 10,
    paddingHorizontal: 15,
    color: "#000",
    backgroundColor: "#FFFFFF", // Optional: Add background color if needed
  },
});

export default AstrologersHeader;
