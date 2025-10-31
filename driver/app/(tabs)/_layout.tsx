import React from 'react';
import { Tabs } from 'expo-router';
import { View, Text } from 'react-native';
import { Home } from '../../assets/icons/home';
import { Person } from '../../assets/icons/person';
import appColors from '../../themes/app.colors';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: appColors.primary,
        tabBarInactiveTintColor: appColors.secondaryText,
        tabBarStyle: {
          backgroundColor: appColors.whiteColor,
          borderTopColor: appColors.border,
          borderTopWidth: 1,
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
        },
        headerStyle: {
          backgroundColor: appColors.primary,
        },
        headerTintColor: appColors.whiteColor,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Home colors={color} width={size} height={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <Person fill={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="rides"
        options={{
          title: 'Rides',
          tabBarIcon: ({ color, size }) => (
            <Home colors={color} width={size} height={size} />
          ),
        }}
      />
    </Tabs>
  );
}
