import { View, Text } from 'react-native'
import React from 'react'
import { Tabs } from 'expo-router'
import { Home, UserPlus as User, Location as MapPin, Clock, HomeLight, MiniTaxi } from '@/utils/icons'
import color from '@/themes/app.colors'

export default function TabsLayout() {
  return (
    <Tabs
      initialRouteName="map"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: '#fff',
          borderBottomWidth: 1,
          borderBottomColor: '#ccc',
        },
        tabBarIcon: ({ focused, color: tintColor, size }) => {
          if (route.name === 'home') {
            return <Home colors={focused ? color.buttonBg : color.regularText} width={size} height={size} />
          } else if (route.name === 'services') {
            return <MiniTaxi colors={focused ? color.buttonBg : color.regularText} width={size} height={size} />
          } else if (route.name === 'map') {
            return <MapPin colors={focused ? color.buttonBg : color.regularText} width={size} height={size} />
          } else if (route.name === 'history') {
            return <Clock colors={focused ? color.buttonBg : color.regularText} width={size} height={size} />
          } else if (route.name === 'profile') {
            return <User colors={focused ? color.buttonBg : color.regularText} width={size} height={size} />
          }
          // Default icon
          return <HomeLight colors={focused ? color.buttonBg : color.regularText} width={size} height={size} />
        },
      })}
    >
      <Tabs.Screen name="home" />
      <Tabs.Screen name="services" />
      <Tabs.Screen name="map" />
      <Tabs.Screen name="history" />
      <Tabs.Screen name="profile" />
    </Tabs>
  )
}
          
             