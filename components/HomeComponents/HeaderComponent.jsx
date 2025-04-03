import React from "react";
import { StyleSheet, TextInput, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useColorScheme } from "../../hooks/useColorScheme";
import { Colors } from "../../constants/Colors";
import { LinearGradient } from "expo-linear-gradient";
import SVGImages from "../../assets/images/SVG";
import MenuIcon from "../../assets/images/SVG/Files/MenuIcon";
import FilterIcon from "../../assets/images/SVG/Files/FilterIcon";

const HeaderComponent = () => {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === "dark";

  const renderIconBox = (icon, onPress) => {
    return isDarkMode ? (
      <TouchableOpacity onPress={onPress}>
        <LinearGradient colors={Colors.dark.astroCardBG} style={styles.iconBox}>
          {icon}
        </LinearGradient>
      </TouchableOpacity>
    ) : (
      <TouchableOpacity onPress={onPress}>
        <View
          style={[styles.iconBox, { backgroundColor: Colors.light.inputBg }]}
        >
          {icon}
        </View>
      </TouchableOpacity>
    );
  };

  const renderSearchBox = () => {
    return isDarkMode ? (
      <LinearGradient colors={Colors.dark.astroCardBG} style={styles.searchBox}>
        <TextInput
          style={[
            styles.input,
            { color: isDarkMode ? Colors.dark.text : Colors.light.text },
          ]}
          placeholder="Search"
          placeholderTextColor="#999"
        />
        <Ionicons
          name="search-outline"
          size={24}
          color={isDarkMode ? Colors.dark.icon : Colors.light.icon}
        />
      </LinearGradient>
    ) : (
      <View
        style={[
          styles.searchBox,
          { backgroundColor: Colors.light.astroCardBG },
        ]}
      >
        <TextInput
          style={[
            styles.input,
            { color: isDarkMode ? Colors.dark.text : Colors.light.text },
          ]}
          placeholder="Search"
          placeholderTextColor="#999"
        />
        <Ionicons
          name="search-outline"
          size={24}
          color={isDarkMode ? Colors.dark.icon : Colors.light.icon}
        />
      </View>
    );
  };

  return (
    <View style={styles.headerContainer}>
      <View style={styles.header}>
        {renderIconBox(<MenuIcon style={styles.menuIcon} />, () =>
          console.log("Menu clicked")
        )}

        <TouchableOpacity>
          <SVGImages.Logo style={styles.logo} height={80} width={90} />
        </TouchableOpacity>

        {renderIconBox(
          <Ionicons
            name="notifications-outline"
            size={26}
            color={isDarkMode ? Colors.dark.icon : Colors.light.icon}
          />,
          () => console.log("Notifications clicked")
        )}
      </View>

      <View style={styles.searchContainer}>
        {renderSearchBox()}
        {renderIconBox(<FilterIcon style={styles.filterIcon} />, () =>
          console.log("Filter clicked")
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  logo: {
    marginBottom: 20,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 20,
    gap: 10,
  },
  searchBox: {
    flexDirection: "row",
    flex: 1,
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#FFFFFF", // White border for dark mode search box as well
    justifyContent: "space-between",
  },
  input: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
  },
  iconBox: {
    padding: 12,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#FFFFFF", // Same border color for icon boxes
  },
  menuIcon: {
    // Style specific to MenuIcon if needed
  },
});

export default HeaderComponent;
