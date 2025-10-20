import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import React, { useState } from 'react';
import { useTheme } from "@react-navigation/native";
import { ScrollView } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

interface FormData {
  name: string;
  phoneNumber: string;
  email: string;
  countryCode: string;
  referralId: string;
}

interface FormErrors {
  name?: string;
  phoneNumber?: string;
  email?: string;
  countryCode?: string;
}

export default function Registration() {
  const { colors } = useTheme();
  const [formData, setFormData] = useState<FormData>({
    name: "",
    phoneNumber: "",
    email: "",
    countryCode: "+1",
    referralId: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhoneNumber = (phone: string): boolean => {
    const phoneRegex = /^\d{10}$/;
    return phoneRegex.test(phone);
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = "Phone number is required";
    } else if (!validatePhoneNumber(formData.phoneNumber)) {
      newErrors.phoneNumber = "Phone number must be 10 digits";
    }

    if (!formData.countryCode) {
      newErrors.countryCode = "Country code is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (key: keyof FormData, value: string) => {
    setFormData((prevData) => ({ ...prevData, [key]: value }));
    // Clear error for this field when user starts typing
    if (errors[key as keyof FormErrors]) {
      setErrors((prevErrors) => ({ ...prevErrors, [key]: undefined }));
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      const { userId } = useLocalSearchParams<{ userId: string }>();
      if (!userId) {
        console.error("User ID is missing");
        return;
      }

      const response = await axios.put(`${process.env.EXPO_PUBLIC_SERVER_URI}/api/v1/signup`, {
        userId: userId,
        name: formData.name,
        email: formData.email,
      });

      if (response.data.success) {
        // Save user data to AsyncStorage
        try {
          await AsyncStorage.setItem("user", JSON.stringify(response.data.user));
          console.log("User data saved to AsyncStorage:", response.data.user);
        } catch (storageError) {
          console.error("Failed to save user data to AsyncStorage:", storageError);
        }

        console.log("Registration successful:", response.data);
        // Navigate to home or next screen
        router.replace("/(tabs)/home");
      } else {
        console.error("Registration failed:", response.data.message);
        // Handle error
      }
    } catch (error) {
      console.error("Registration failed:", error);
      // Handle error
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={[styles.title, { color: colors.primary }]}>
          Registration
        </Text>

        {/* Name Input */}
        <View style={styles.inputContainer}>
          <Text style={[styles.label, { color: colors.text }]}>Name *</Text>
          <TextInput
            style={[
              styles.input,
              { 
                borderColor: errors.name ? '#ff4444' : colors.border,
                color: colors.text,
                backgroundColor: colors.card
              }
            ]}
            placeholder="Enter your name"
            placeholderTextColor={colors.text + '80'}
            value={formData.name}
            onChangeText={(value) => handleChange('name', value)}
            editable={!isSubmitting}
          />
          {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
        </View>

        {/* Email Input */}
        <View style={styles.inputContainer}>
          <Text style={[styles.label, { color: colors.text }]}>Email *</Text>
          <TextInput
            style={[
              styles.input,
              { 
                borderColor: errors.email ? '#ff4444' : colors.border,
                color: colors.text,
                backgroundColor: colors.card
              }
            ]}
            placeholder="Enter your email"
            placeholderTextColor={colors.text + '80'}
            value={formData.email}
            onChangeText={(value) => handleChange('email', value)}
            keyboardType="email-address"
            autoCapitalize="none"
            editable={!isSubmitting}
          />
          {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
        </View>

        {/* Phone Number Input */}
        <View style={styles.inputContainer}>
          <Text style={[styles.label, { color: colors.text }]}>Phone Number *</Text>
          <View style={styles.phoneContainer}>
            <TextInput
              style={[
                styles.countryCodeInput,
                { 
                  borderColor: errors.countryCode ? '#ff4444' : colors.border,
                  color: colors.text,
                  backgroundColor: colors.card
                }
              ]}
              placeholder="+1"
              placeholderTextColor={colors.text + '80'}
              value={formData.countryCode}
              onChangeText={(value) => handleChange('countryCode', value)}
              keyboardType="phone-pad"
              editable={!isSubmitting}
            />
            <TextInput
              style={[
                styles.phoneInput,
                { 
                  borderColor: errors.phoneNumber ? '#ff4444' : colors.border,
                  color: colors.text,
                  backgroundColor: colors.card
                }
              ]}
              placeholder="1234567890"
              placeholderTextColor={colors.text + '80'}
              value={formData.phoneNumber}
              onChangeText={(value) => handleChange('phoneNumber', value)}
              keyboardType="phone-pad"
              editable={!isSubmitting}
            />
          </View>
          {errors.phoneNumber && <Text style={styles.errorText}>{errors.phoneNumber}</Text>}
        </View>

        {/* Referral ID Input (Optional) */}
        <View style={styles.inputContainer}>
          <Text style={[styles.label, { color: colors.text }]}>
            Referral ID (Optional)
          </Text>
          <TextInput
            style={[
              styles.input,
              { 
                borderColor: colors.border,
                color: colors.text,
                backgroundColor: colors.card
              }
            ]}
            placeholder="Enter referral ID"
            placeholderTextColor={colors.text + '80'}
            value={formData.referralId}
            onChangeText={(value) => handleChange('referralId', value)}
            editable={!isSubmitting}
          />
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          style={[
            styles.submitButton,
            { backgroundColor: colors.primary },
            isSubmitting && styles.submitButtonDisabled
          ]}
          onPress={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.submitButtonText}>Register</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontFamily: "TT-Octosquares-Medium",
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 30,
    textAlign: "center",
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
  },
  phoneContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  countryCodeInput: {
    width: 80,
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
  },
  phoneInput: {
    flex: 1,
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
  },
  errorText: {
    color: '#ff4444',
    fontSize: 12,
    marginTop: 4,
  },
  submitButton: {
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});