import { View, Text } from "react-native";
import { Stack,Redirect } from "expo-router";
import { useState, useEffect } from "react";
import React from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function index() {
  const [isLoggedIn, setisLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const userJson = await AsyncStorage.getItem("user");
        const user = userJson ? JSON.parse(userJson) : null;
        setisLoggedIn(!!user);
      } catch (e) {
        console.error("Failed to load user from storage", e);
        setisLoggedIn(false);
      }
    };
    loadUser();
  }, []);

  if (isLoggedIn === null) {
    // Splash/loading state while determining redirect
    return <View><Text>Loading...</Text></View>;
  }

  return (
     <Redirect href={!isLoggedIn ? "/(routes)/onboarding" : "/(tabs)/home"} />
  );
}
