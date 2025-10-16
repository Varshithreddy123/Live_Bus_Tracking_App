import { View, Text } from "react-native";
import { Stack,Redirect } from "expo-router";
import { useState } from "react";
import React from "react";

export default function index() {
  const [isLoggedIn, setisLoggedIn] =useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  
  return (
     <Redirect href={!isLoggedIn ? "/(routes)/onboarding" : "/(tabs)/home"} />
  );
}
