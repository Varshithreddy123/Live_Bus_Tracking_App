import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native'
import React, { useState } from 'react'
import { router, useLocalSearchParams } from 'expo-router';
import { useTheme } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface FormData {
  name: string;
  email: string;
}

export default function RegistrationScreen() {
  const { colors } = useTheme();
  const { userId } = useLocalSearchParams() as any;
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
  });
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (key: keyof FormData, value: string) => {
    setFormData((prevData) => ({ ...prevData, [key]: value }));
    // Clear error when user starts typing
    if (errors[key]) {
      setErrors((prev) => ({ ...prev, [key]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Partial<FormData> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }
    
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await axios.put(
        `${process.env.EXPO_PUBLIC_SERVER_URI}/api/v1/signup`,
        {
          userId: userId,
          name: formData.name,
          email: formData.email,
        }
      );

      if (response.data.success) {
        // Save user data to AsyncStorage
        try {
          await AsyncStorage.setItem("user", JSON.stringify(response.data.user));
          console.log("User data saved to AsyncStorage:", response.data.user);
        } catch (storageError) {
          console.error("Failed to save user data to AsyncStorage:", storageError);
        }

        // Navigate directly to home without alert
        router.replace("/(tabs)/home");
      }
    } catch (error: any) {
      console.error("Registration error:", error);
      Alert.alert(
        "Error",
        error.response?.data?.message || "Failed to complete registration. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScrollView
      contentContainerStyle={{
        flexGrow: 1,
        padding: 20,
        backgroundColor: colors.background,
      }}
    >
      <View style={{ flex: 1, justifyContent: "center" }}>
        {/* Logo/Title */}
        <Text
          style={{
            fontFamily: "TT-Octosquares-Medium",
            fontSize: 28,
            fontWeight: "bold",
            marginBottom: 30,
            textAlign: "center",
            color: colors.text,
          }}
        >
          Complete Registration
        </Text>

        {/* Name Input */}
        <View style={{ marginBottom: 20 }}>
          <Text
            style={{
              fontSize: 16,
              marginBottom: 8,
              color: colors.text,
              fontWeight: "600",
            }}
          >
            Name
          </Text>
          <TextInput
            style={{
              borderWidth: 1,
              borderColor: errors.name ? "#ef4444" : colors.border,
              borderRadius: 8,
              padding: 12,
              fontSize: 16,
              backgroundColor: colors.card,
              color: colors.text,
            }}
            placeholder="Enter your name"
            placeholderTextColor={colors.text + "60"}
            value={formData.name}
            onChangeText={(value) => handleChange("name", value)}
            editable={!isSubmitting}
          />
          {errors.name && (
            <Text style={{ color: "#ef4444", fontSize: 12, marginTop: 4 }}>
              {errors.name}
            </Text>
          )}
        </View>

        {/* Email Input */}
        <View style={{ marginBottom: 30 }}>
          <Text
            style={{
              fontSize: 16,
              marginBottom: 8,
              color: colors.text,
              fontWeight: "600",
            }}
          >
            Email
          </Text>
          <TextInput
            style={{
              borderWidth: 1,
              borderColor: errors.email ? "#ef4444" : colors.border,
              borderRadius: 8,
              padding: 12,
              fontSize: 16,
              backgroundColor: colors.card,
              color: colors.text,
            }}
            placeholder="Enter your email"
            placeholderTextColor={colors.text + "60"}
            value={formData.email}
            onChangeText={(value) => handleChange("email", value)}
            keyboardType="email-address"
            autoCapitalize="none"
            editable={!isSubmitting}
          />
          {errors.email && (
            <Text style={{ color: "#ef4444", fontSize: 12, marginTop: 4 }}>
              {errors.email}
            </Text>
          )}
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          style={{
            backgroundColor: isSubmitting ? colors.border : colors.primary,
            padding: 16,
            borderRadius: 8,
            alignItems: "center",
          }}
          onPress={handleSubmit}
          disabled={isSubmitting}
        >
          <Text
            style={{
              color: "#fff",
              fontSize: 16,
              fontWeight: "bold",
            }}
          >
            {isSubmitting ? "Submitting..." : "Complete Registration"}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}