import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useColorScheme } from "../../hooks/useColorScheme";
import { Colors } from "../../constants/Colors";

const ITEM_HEIGHT = 50;
const HOURS = Array.from({ length: 12 }, (_, i) => i + 1);
const MINUTES = Array.from({ length: 60 }, (_, i) => (i < 10 ? `0${i}` : i));
const PERIODS = ["AM", "PM"];

const TimePicker = ({ onTimeChange }) => {
  const [selectedHour, setSelectedHour] = useState(1);
  const [selectedMinute, setSelectedMinute] = useState("00");
  const [selectedPeriod, setSelectedPeriod] = useState("AM");

  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];

  const hourRef = useRef(null);
  const minuteRef = useRef(null);
  const periodRef = useRef(null);

  useEffect(() => {
    const scrollToSelected = (ref, items, selectedValue) => {
      const index = items.indexOf(selectedValue);
      ref.current?.scrollTo({
        y: index * ITEM_HEIGHT - ITEM_HEIGHT * 2,
        animated: false,
      });
    };

    scrollToSelected(hourRef, HOURS, selectedHour);
    scrollToSelected(minuteRef, MINUTES, selectedMinute);
    scrollToSelected(periodRef, PERIODS, selectedPeriod);
  }, [selectedHour, selectedMinute, selectedPeriod]);

  const handleScrollEnd = useCallback(
    (event, type) => {
      const offsetY = event.nativeEvent.contentOffset.y;
      const index = Math.round(offsetY / ITEM_HEIGHT);

      let newHour = selectedHour;
      let newMinute = selectedMinute;
      let newPeriod = selectedPeriod;

      switch (type) {
        case "hour":
          newHour = HOURS[index];
          setSelectedHour(newHour);
          break;
        case "minute":
          newMinute = MINUTES[index];
          setSelectedMinute(newMinute);
          break;
        case "period":
          newPeriod = PERIODS[index];
          setSelectedPeriod(newPeriod);
          break;
      }

      if (onTimeChange) {
        onTimeChange({
          hour: newHour,
          minute: newMinute,
          period: newPeriod,
        });
      }
    },
    [selectedHour, selectedMinute, selectedPeriod, onTimeChange]
  );

  const renderPicker = useMemo(
    () => (items, selectedValue, onSelect, type, ref) =>
      (
        <ScrollView
          ref={ref}
          showsVerticalScrollIndicator={false}
          snapToInterval={ITEM_HEIGHT}
          decelerationRate="fast"
          onMomentumScrollEnd={(event) => handleScrollEnd(event, type)}
          contentContainerStyle={styles.scrollViewContent}
        >
          {items.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.itemContainer,
                selectedValue === item && {
                  backgroundColor: colors.buttonBg,
                  borderRadius: 10,
                },
              ]}
              onPress={() => onSelect(item)}
            >
              <Text
                style={[
                  styles.itemText,
                  selectedValue === item && { color: colors.buttonText },
                ]}
              >
                {item}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      ),
    [handleScrollEnd, colors]
  );

  return (
    <View style={styles.container}>
      <View style={styles.pickerContainer}>
        {renderPicker(HOURS, selectedHour, setSelectedHour, "hour", hourRef)}
        {renderPicker(
          MINUTES,
          selectedMinute,
          setSelectedMinute,
          "minute",
          minuteRef
        )}
        {renderPicker(
          PERIODS,
          selectedPeriod,
          setSelectedPeriod,
          "period",
          periodRef
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 300,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  pickerContainer: {
    flexDirection: "row",
  },
  scrollViewContent: {
    paddingVertical: ITEM_HEIGHT * 2,
    justifyContent: "center",
  },
  itemContainer: {
    height: ITEM_HEIGHT,
    justifyContent: "center",
    alignItems: "center",
    width: 100,
  },
  itemText: {
    fontSize: 20,
    lineHeight: 30,
    color: "#BABABA",
  },
});

export default TimePicker;
