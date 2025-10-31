import { View, Text } from "react-native";
import React, { useState, useEffect } from "react";
import { Redirect } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Index() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const userJson = await AsyncStorage.getItem("driver");
        const user = userJson ? JSON.parse(userJson) : null;
        setIsLoggedIn(!!user);
      } catch (e) {
        console.error("Failed to load user from storage", e);
        setIsLoggedIn(false);
      }
    };
    loadUser();
  }, []);

  if (isLoggedIn === null) {
    // Splash/loading state while determining redirect
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return <Redirect href={!isLoggedIn ? "/(routes)/login" : "/(tabs)/home"} />;
}
