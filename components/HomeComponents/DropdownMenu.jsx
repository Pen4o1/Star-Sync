import React, { useState } from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const DropdownMenu = () => {
  const [open, setOpen] = useState(false);

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => setOpen(!open)}>
        <Ionicons name="menu" size={28} color="black" />
      </TouchableOpacity>
      {open && (
        <View style={styles.dropdown}>
          <TouchableOpacity>
            <Text style={styles.item}>Settings</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text style={styles.item}>Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text style={styles.item}>Logout</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default DropdownMenu;

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 10,
    left: 10,
    zIndex: 10,
  },
  dropdown: {
    backgroundColor: "#fff",
    borderRadius: 8,
    elevation: 3,
    padding: 10,
    marginTop: 5,
  },
  item: {
    paddingVertical: 8,
    fontSize: 16,
  },
});
