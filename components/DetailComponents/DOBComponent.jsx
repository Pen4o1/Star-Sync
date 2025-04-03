import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import DateTimePicker from "@react-native-community/datetimepicker";
import { ThemedText } from "../ThemedText";

const DOBComponent = () => {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const showDatepicker = () => {
    setShowDatePicker(true);
  };

  const handleDateChange = (event, selected) => {
    setShowDatePicker(false);
    if (selected) {
      setSelectedDate(selected);
    }
  };

  return (
    <View style={styles.container}>
      <ThemedText style={styles.heading}>What’s Your Date of Birth?</ThemedText>
      <ThemedText style={styles.description}>
        Duis ultricies lacus sed turpis tincidunt id aliquet risus. Interdum
        consectetur libero id faucibus nisl. Eu consequat ac felis donec et odio
        pellentesque diam volutpat.
      </ThemedText>
      <View style={styles.dateContainer}>
        <TouchableOpacity
          onPress={showDatepicker}
          style={styles.pickerContainer}
        >
          <ThemedText type="default" style={styles.label}>
            Month:
          </ThemedText>
          <ThemedText type="default" style={styles.selectedDate}>
            {selectedDate.toLocaleDateString("en-US", { month: "2-digit" })}
          </ThemedText>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={showDatepicker}
          style={styles.pickerContainer}
        >
          <ThemedText style={styles.label}>Day:</ThemedText>
          <ThemedText type="default" style={styles.selectedDate}>
            {selectedDate.toLocaleDateString("en-US", { day: "2-digit" })}
          </ThemedText>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={showDatepicker}
          style={styles.pickerContainer}
        >
          <ThemedText style={styles.label}>Year:</ThemedText>
          <ThemedText type="default" style={styles.selectedDate}>
            {selectedDate.toLocaleDateString("en-US", { year: "numeric" })}
          </ThemedText>
        </TouchableOpacity>
      </View>
      {showDatePicker && (
        <DateTimePicker
          value={selectedDate}
          mode="date"
          display="spinner"
          onChange={handleDateChange}
        />
      )}
    </View>
  );
};

export default DOBComponent;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  description: {
    fontSize: 14,
    color: "#666",
    marginBottom: 20,
    marginTop: 12,
  },
  dateContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  pickerContainer: {
    marginRight: 10,
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    textAlign: "center",
  },
  selectedDate: {
    fontSize: 30,
    textAlign: "center",
    borderWidth: 1,
    borderColor: "#cccccc",
    borderRadius: 5,
    paddingHorizontal: 25,
    paddingVertical: 5,
    paddingTop: 20,
  },
});
