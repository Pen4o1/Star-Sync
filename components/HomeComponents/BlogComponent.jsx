import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { astrologyBlogs } from "../../mock/blogMock";
import { ThemedText } from "../ThemedText";
import { Colors } from "../../constants/Colors";
import { useColorScheme } from "../../hooks/useColorScheme";

const truncateText = (text, limit) => {
  return text.length > limit ? text.substring(0, limit) + "..." : text;
};

const handlePress = (title) => {
  Alert.alert("Blog Item Pressed", `You pressed: ${title}`);
};

const BlogComponent = () => {
  const ColorScheme = useColorScheme();
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.scrollView}
    >
      {astrologyBlogs.map((blog) => (
        <TouchableOpacity
          key={blog.id}
          style={styles.blogItem}
          onPress={() => handlePress(blog.title)}
        >
          <Image source={{ uri: blog.image }} style={styles.image} />
          <ThemedText style={styles.title}>
            {truncateText(blog.title, 40)}
          </ThemedText>
          <ThemedText style={styles.description}>
            {truncateText(blog.description, 40)}
          </ThemedText>
          <View style={styles.readMoreButton}>
            <Text
              style={[
                styles.readMoreText,
                { color: Colors[ColorScheme ?? "light"].readmoreText },
              ]}
            >
              Read More
            </Text>
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  blogItem: {
    width: 220,
    marginRight: 19,
    borderRadius: 8,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: 150,
  },
  title: {
    fontSize: 16,
    fontFamily: "Nunito-Bold",
    marginBottom: 10,
  },
  description: {
    fontSize: 14,
    marginBottom: 10,
  },
  readMoreButton: {
    marginBottom: 10,
  },
  readMoreText: {
    fontSize: 14,
    fontWeight: "bold",
  },
});

export default BlogComponent;
