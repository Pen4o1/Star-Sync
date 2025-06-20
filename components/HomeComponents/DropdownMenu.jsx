import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet, Animated, Text, Dimensions } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import userEvents from '../../app/utils/userEvents';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const DropdownMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [animation] = useState(new Animated.Value(0));
  const [userName, setUserName] = useState('');
  const [userBirthdate, setUserBirthdate] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const storedUserName = await AsyncStorage.getItem('userName');
        const storedBirthdate = await AsyncStorage.getItem('userBirthDate');
        if (storedUserName) setUserName(storedUserName);
        if (storedBirthdate) setUserBirthdate(storedBirthdate);
      } catch (error) {
        console.error('Failed to fetch user data:', error);
      }
    };

    fetchUserData();

    // Listen for manual refresh
    const refreshHandler = () => {
      fetchUserData();
    };

    userEvents.on('refreshUser', refreshHandler);

    return () => {
      userEvents.off('refreshUser', refreshHandler); // Clean up
    };
  }, []);

  const openMenu = () => {
    setIsOpen(true);
    Animated.timing(animation, {
      toValue: 1,
      duration: 350,
      useNativeDriver: true,
    }).start();
  };

  const closeMenu = () => {
    Animated.timing(animation, {
      toValue: 0,
      duration: 350,
      useNativeDriver: true,
    }).start(() => setIsOpen(false));
  };

  const menuItems = [
    { name: 'My Account Settings', route: '/account' },
    { name: 'Daily Horoscope', route: '/daily' },
    { name: 'Chinese Horoscope', route: '/chinese' },
    { name: 'Love & Friendship Matcher', route: '/matches' },
    { name: 'Dreambook', route: '/monthly' },
  ];

  const translateX = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [-SCREEN_WIDTH, 0],
  });

  return (
    <View style={styles.absoluteContainer} pointerEvents="box-none">
      {!isOpen && (
        <TouchableOpacity onPress={openMenu} style={styles.menuButton}>
          <FontAwesome6 name="bars" size={24} color="#FFAA1E" />
        </TouchableOpacity>
      )}

      {isOpen && (
        <Animated.View
          style={[
            styles.fullScreenMenu,
            {
              transform: [{ translateX }],
              opacity: animation,
            },
          ]}
        >
          <TouchableOpacity style={styles.closeButton} onPress={closeMenu}>
            <FontAwesome6 name="xmark" size={28} color="#FFAA1E" />
          </TouchableOpacity>

          {userName ? (
            <Text style={styles.userName}>Hello {userName}</Text>
          ) : null}

          {userBirthdate ? (
            <View style={styles.userHeader}>
              <Text style={styles.userBirthdate}>Birth date: {userBirthdate}</Text>
              <Text style={styles.linkText} onPress={() => {
                router.push('/(auth)/EditUser');
                closeMenu();
              }}>
                Edit
              </Text>
            </View>
          ) : null}

          <View style={styles.menuList}>
            {menuItems.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.menuItem}
                onPress={() => {
                  router.push(item.route);
                  closeMenu();
                }}
              >
                <Text style={styles.menuText}>{item.name}</Text>
                <FontAwesome6 name="chevron-right" size={18} color="#FFAA1E" style={styles.chevron} />
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  absoluteContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    zIndex: 1000,
    pointerEvents: 'box-none',
  },
  menuButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    padding: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 10,
    zIndex: 1001,
  },
  fullScreenMenu: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    backgroundColor: 'rgba(0,0,0,0.97)',
    zIndex: 1002,
    paddingTop: 60,
    paddingHorizontal: 30,
    justifyContent: 'flex-start',
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 30,
    zIndex: 1003,
    padding: 10,
  },
  userHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 20,
  },
  userName: {
    color: '#FFAA1E',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  userBirthdate: {
    color: '#FFAA1E',
    fontSize: 16,
  },
  linkText: {
    color: '#FFAA1E',
    fontSize: 16,
    textDecorationLine: 'underline',
  },
  menuList: {
    marginTop: 60,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 22,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 170, 30, 0.1)',
  },
  menuText: {
    color: '#FFAA1E',
    fontSize: 20,
    flex: 1,
    fontWeight: 'bold',
  },
  chevron: {
    marginLeft: 10,
  },
});

export default DropdownMenu;
