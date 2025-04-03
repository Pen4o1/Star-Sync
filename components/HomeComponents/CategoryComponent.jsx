import React, { useMemo } from "react";
import { StyleSheet, View, ScrollView, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { ThemedText } from "../ThemedText";
import { useColorScheme } from "../../hooks/useColorScheme";
import { categoryData } from "../../mock/categoryMock";

const CategoryComponent = () => {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === "dark";

  // Memoize category data to avoid recalculating on every render
  const categories = useMemo(() => categoryData, []);

  const handlePress = (id) => {
    router.push(`/Category/${id}`);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.scrollView}
      >
        {categories.map(({ id, Component, name }) => (
          <TouchableOpacity
            key={id}
            onPress={() => handlePress(id)}
            style={styles.touchable}
          >
            <View
              style={[
                styles.cardWrapper,
                isDarkMode ? {} : styles.lightCardWrapper,
              ]}
            >
              <LinearGradient
                colors={
                  isDarkMode
                    ? [
                        "rgba(179, 121, 223, 0.2)",
                        "rgba(204, 84, 199, 0.006)",
                        "rgba(179, 121, 223, 0.2)",
                      ]
                    : ["#f1f1f1", "#f1f1f1"]
                }
                style={styles.card}
                start={[0.1532, 0.2104]}
                end={[0.9, 1.43]}
              >
                <Component />
              </LinearGradient>
            </View>
            <ThemedText type="title" style={styles.imageName}>
              {name}
            </ThemedText>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

export default CategoryComponent;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flexDirection: "row",
  },
  touchable: {
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  cardWrapper: {
    width: 70,
    height: 70,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 50,
    overflow: "hidden",
  },
  lightCardWrapper: {
    backgroundColor: "#f1f1f1",
  },
  card: {
    width: 70,
    height: 70,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 50,
  },
  imageName: {
    marginTop: 5,
    textAlign: "center",
    fontSize: 16,
  },
});
