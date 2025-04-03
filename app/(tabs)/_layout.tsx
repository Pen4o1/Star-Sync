import { Tabs } from 'expo-router';
import { FontAwesome6 } from '@expo/vector-icons';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#FFAA1E',
        tabBarInactiveTintColor: '#888',
        tabBarStyle: {
          backgroundColor: '#1a1a1a',
          borderTopColor: '#333',
        },
        headerStyle: {
          backgroundColor: '#1a1a1a',
        },
        headerTintColor: '#fff',
      }}
    >
      <Tabs.Screen
        name="horoscope"
        options={{
          title: 'Daily',
          tabBarIcon: ({ color }) => (
            <FontAwesome6 name="sun" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="weekly"
        options={{
          title: 'Weekly',
          tabBarIcon: ({ color }) => (
            <FontAwesome6 name="calendar-week" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="monthly"
        options={{
          title: 'Monthly',
          tabBarIcon: ({ color }) => (
            <FontAwesome6 name="calendar" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="yearly"
        options={{
          title: 'Yearly',
          tabBarIcon: ({ color }) => (
            <FontAwesome6 name="calendar-days" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="chinese"
        options={{
          title: 'Chinese',
          tabBarIcon: ({ color }) => (
            <FontAwesome6 name="dragon" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="match"
        options={{
          title: 'Match',
          tabBarIcon: ({ color }) => (
            <FontAwesome6 name="heart" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="dreambook"
        options={{
          title: 'Dreams',
          tabBarIcon: ({ color }) => (
            <FontAwesome6 name="moon" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="subscription"
        options={{
          title: 'Premium',
          tabBarIcon: ({ color }) => (
            <FontAwesome6 name="crown" size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
} 