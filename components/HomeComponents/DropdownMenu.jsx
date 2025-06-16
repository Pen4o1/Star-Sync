import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const DropdownMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [animation] = useState(new Animated.Value(0));
  const router = useRouter();

  const toggleMenu = () => {
    const toValue = isOpen ? 0 : 1;
    Animated.spring(animation, {
      toValue,
      friction: 8,
      useNativeDriver: true,
    }).start();
    setIsOpen(!isOpen);
  };

  const menuItems = [
    { name: 'Daily', route: '/daily' },
    { name: 'Weekly', route: '/weekly' },
    { name: 'Monthly', route: '/monthly' },
    { name: 'Yearly', route: '/yearly' },
    { name: 'Chinese', route: '/chinese' },
    { name: 'Matches', route: '/match' },
    { name: 'Dream Book', route: '/dreambook' },
    { name: 'Horoscope', route: '/horoscope' },
  ];

  const translateY = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [-20, 0],
  });

  const opacity = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={toggleMenu} style={styles.menuButton}>
        <FontAwesome6 name="bars" size={24} color="#FFAA1E" />
      </TouchableOpacity>

      <Animated.View 
        style={[
          styles.menu,
          {
            opacity,
            transform: [{ translateY }],
          }
        ]}
      >
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.menuItem}
            onPress={() => {
              router.push(item.route);
              setIsOpen(false);
            }}
          >
            <FontAwesome6 
              name={item.name === 'Dream Book' ? 'moon' : 
                    item.name === 'Matches' ? 'heart' : 
                    item.name === 'Chinese' ? 'dragon' : 
                    item.name === 'Horoscope' ? 'star' : 
                    item.name === 'Daily' ? 'sun' : 
                    item.name === 'Weekly' ? 'calendar-week' : 
                    item.name === 'Monthly' ? 'calendar' : 
                    'calendar-days'} 
              size={20} 
              color="#FFAA1E" 
              style={styles.menuIcon}
            />
            <FontAwesome6 name="chevron-right" size={16} color="#FFAA1E" style={styles.chevron} />
          </TouchableOpacity>
        ))}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 1000,
  },
  menuButton: {
    padding: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 10,
  },
  menu: {
    position: 'absolute',
    top: 50,
    left: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    borderRadius: 10,
    overflow: 'hidden',
    width: 200,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 170, 30, 0.2)',
  },
  menuIcon: {
    marginRight: 10,
  },
  chevron: {
    marginLeft: 'auto',
  },
});

export default DropdownMenu;
