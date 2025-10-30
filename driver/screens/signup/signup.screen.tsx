import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  Dimensions,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { useTheme } from "@react-navigation/native";
import ProgressBar from "@/components/common/progressbar/progressbar";
import { external } from "@/styles/external.style";
import * as Crypto from 'expo-crypto';

const { height: windowHeight, width: windowWidth } = Dimensions.get("window");

// ✅ Enhanced validation utilities
const validators = {
  name: (value: string): { valid: boolean; error?: string } => {
    const trimmed = value.trim();
    
    if (!trimmed) {
      return { valid: false, error: "Full name is required" };
    }
    
    if (trimmed.length < 3) {
      return { valid: false, error: "Name must be at least 3 characters" };
    }
    
    if (trimmed.length > 50) {
      return { valid: false, error: "Name must not exceed 50 characters" };
    }
    
    // Only letters, spaces, and common name characters
    const nameRegex = /^[a-zA-Z\s\-'.]+$/;
    if (!nameRegex.test(trimmed)) {
      return { valid: false, error: "Name can only contain letters, spaces, hyphens, and apostrophes" };
    }
    
    return { valid: true };
  },

  phone: (value: string): { valid: boolean; error?: string } => {
    const trimmed = value.trim();
    
    if (!trimmed) {
      return { valid: false, error: "Phone number is required" };
    }
    
    // Remove spaces and dashes for validation
    const cleaned = trimmed.replace(/[\s\-()]/g, '');
    
    // Indian phone number validation (10 digits, starting with 6-9)
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(cleaned)) {
      return { valid: false, error: "Enter valid 10-digit phone number (e.g., 9876543210)" };
    }
    
    return { valid: true };
  },

  email: (value: string): { valid: boolean; error?: string } => {
    const trimmed = value.trim().toLowerCase();
    
    if (trimmed && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      return { valid: false, error: "Enter a valid email address" };
    }
    
    return { valid: true };
  },

  license: (value: string): { valid: boolean; error?: string } => {
    const trimmed = value.trim().toUpperCase();
    
    if (!trimmed) {
      return { valid: false, error: "Driving license number is required" };
    }
    
    if (trimmed.length < 10 || trimmed.length > 20) {
      return { valid: false, error: "License number must be 10-20 characters" };
    }
    
    // Indian driving license format: KL1120170001234 or variations
    const licenseRegex = /^[A-Z]{2}[-]?[0-9]{2}[-]?[0-9]{4}[-]?[0-9]{7}$/;
    if (!licenseRegex.test(trimmed)) {
      return { valid: false, error: "Invalid license format (e.g., KL-11-2017-0001234)" };
    }
    
    return { valid: true };
  },

  password: (value: string): { valid: boolean; error?: string } => {
    if (!value) {
      return { valid: false, error: "Password is required" };
    }
    
    if (value.length < 8) {
      return { valid: false, error: "Password must be at least 8 characters" };
    }
    
    if (value.length > 50) {
      return { valid: false, error: "Password must not exceed 50 characters" };
    }
    
    // Must contain uppercase, lowercase, number, and special character
    const hasUpperCase = /[A-Z]/.test(value);
    const hasLowerCase = /[a-z]/.test(value);
    const hasNumber = /[0-9]/.test(value);
    const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(value);
    
    if (!hasUpperCase || !hasLowerCase || !hasNumber || !hasSpecialChar) {
      return { 
        valid: false, 
        error: "Password must include uppercase, lowercase, number, and special character" 
      };
    }
    
    return { valid: true };
  },

  confirmPassword: (password: string, confirmPassword: string): { valid: boolean; error?: string } => {
    if (!confirmPassword) {
      return { valid: false, error: "Please confirm your password" };
    }
    
    if (password !== confirmPassword) {
      return { valid: false, error: "Passwords do not match" };
    }
    
    return { valid: true };
  },
};

// ✅ Security utilities
const sanitizeInput = (input: string): string => {
  return input
    .trim()
    .replace(/[<>\"']/g, "")
    .replace(/\s+/g, " ");
};

const containsMaliciousPattern = (input: string): boolean => {
  const maliciousPatterns = [
    /<script[\s\S]*?>[\s\S]*?<\/script>/gi,
    /javascript:/gi,
    /on\w+\s*=\s*["'][^"']*["']/gi,
    /data:text\/html/gi,
    /(SELECT|INSERT|UPDATE|DELETE|DROP|UNION|EXEC|EXECUTE)\s/gi,
  ];
  
  return maliciousPatterns.some(pattern => pattern.test(input));
};

// Hash password using expo-crypto
const hashPassword = async (password: string): Promise<string> => {
  const digest = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    password
  );
  return digest;
};

export default function SignupScreen() {
  const router = useRouter();
  const { colors } = useTheme();

  const safeColors = {
    background: String(colors.background || "#f9f9f9"),
    card: String(colors.card || "white"),
    border: String(colors.border || "#ccc"),
    text: String(colors.text || "#000"),
    primary: String(colors.primary || "#007bff"),
    error: "#dc3545",
  };

  // Form state
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [license, setLicense] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  // Validation state
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Progress calculation
  const filledFields = [name, phone, license, password, confirmPassword].filter(
    value => value.trim().length > 0
  ).length;
  const progress = (filledFields / 5) * 100;

  // ✅ Real-time field validation
  const validateField = useCallback((field: string, value: string, extraValue?: string) => {
    let validation;
    
    switch (field) {
      case "name":
        validation = validators.name(value);
        break;
      case "phone":
        validation = validators.phone(value);
        break;
      case "email":
        validation = validators.email(value);
        break;
      case "license":
        validation = validators.license(value);
        break;
      case "password":
        validation = validators.password(value);
        break;
      case "confirmPassword":
        validation = validators.confirmPassword(extraValue || password, value);
        break;
      default:
        validation = { valid: true };
    }
    
    setErrors(prev => ({
      ...prev,
      [field]: validation.valid ? "" : (validation.error || ""),
    }));
    
    return validation.valid;
  }, [password]);

  // ✅ Handle input changes
  const handleInputChange = (field: string, value: string) => {
    switch (field) {
      case "name": setName(value); break;
      case "phone": setPhone(value); break;
      case "email": setEmail(value); break;
      case "license": setLicense(value); break;
      case "password": setPassword(value); break;
      case "confirmPassword": setConfirmPassword(value); break;
    }
    
    if (touched[field]) {
      validateField(field, value);
    }
  };

  // ✅ Handle field blur
  const handleBlur = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    
    let value = "";
    switch (field) {
      case "name": value = name; break;
      case "phone": value = phone; break;
      case "email": value = email; break;
      case "license": value = license; break;
      case "password": value = password; break;
      case "confirmPassword": value = confirmPassword; break;
    }
    
    validateField(field, value);
  };

  // ✅ Comprehensive form validation
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    const validations = [
      { field: "name", validator: validators.name(name) },
      { field: "phone", validator: validators.phone(phone) },
      { field: "email", validator: validators.email(email) },
      { field: "license", validator: validators.license(license) },
      { field: "password", validator: validators.password(password) },
      { field: "confirmPassword", validator: validators.confirmPassword(password, confirmPassword) },
    ];

    validations.forEach(({ field, validator }) => {
      if (!validator.valid) {
        newErrors[field] = validator.error || "";
        isValid = false;
      }
    });

    setErrors(newErrors);
    setTouched({
      name: true,
      phone: true,
      email: true,
      license: true,
      password: true,
      confirmPassword: true,
    });

    return isValid;
  };

  // ✅ Handle form submission
  const handleContinueToBusDetails = async () => {
    if (isSubmitting) return;

    if (!validateForm()) {
      Alert.alert("Validation Error", "Please fix all errors before continuing.");
      return;
    }

    // Security check
    const allInputs = `${name} ${phone} ${email} ${license}`;
    if (containsMaliciousPattern(allInputs)) {
      Alert.alert(
        "Security Warning",
        "Invalid characters detected. Please remove special characters and try again."
      );
      return;
    }

    setIsSubmitting(true);

    try {
      // Check for duplicate phone number
      const checkPhoneResponse = await fetch(
        `${process.env.EXPO_PUBLIC_SERVER_URI}/api/v1/driver/check-duplicate`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            phoneNumber: phone.trim().replace(/[\s\-()]/g, ''),
          }),
        }
      );

      const checkPhoneData = await checkPhoneResponse.json();
      
      if (!checkPhoneResponse.ok) {
        if (checkPhoneData.error?.includes('phone')) {
          Alert.alert("Duplicate Entry", "This phone number is already registered.");
          return;
        }
      }

      // Check for duplicate license
      const checkLicenseResponse = await fetch(
        `${process.env.EXPO_PUBLIC_SERVER_URI}/api/v1/driver/check-duplicate`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            drinving_license: license.trim().toUpperCase().replace(/[\s\-]/g, ''),
          }),
        }
      );

      const checkLicenseData = await checkLicenseResponse.json();
      
      if (!checkLicenseResponse.ok) {
        if (checkLicenseData.error?.includes('license')) {
          Alert.alert("Duplicate Entry", "This driving license is already registered.");
          return;
        }
      }

      // Check email if provided
      if (email.trim()) {
        const checkEmailResponse = await fetch(
          `${process.env.EXPO_PUBLIC_SERVER_URI}/api/v1/driver/check-duplicate`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: email.trim().toLowerCase(),
            }),
          }
        );

        const checkEmailData = await checkEmailResponse.json();
        
        if (!checkEmailResponse.ok) {
          if (checkEmailData.error?.includes('email')) {
            Alert.alert("Duplicate Entry", "This email is already registered.");
            return;
          }
        }
      }

      // Hash password before passing to next screen
      const hashedPassword = await hashPassword(password);

      // Navigate to bus registration
      router.push({
        pathname: "/(routes)/bus-registration",
        params: {
          name: sanitizeInput(name),
          phone: phone.trim().replace(/[\s\-()]/g, ''),
          email: email.trim().toLowerCase() || undefined,
          license: license.trim().toUpperCase().replace(/[\s\-]/g, ''),
          password: hashedPassword,
        }
      });
    } catch (error) {
      console.error("Validation error:", error);
      Alert.alert(
        "Connection Error",
        "Unable to validate details. Please check your internet connection and try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // ✅ Render input with error handling
  const renderInput = (
    field: string,
    placeholder: string,
    value: string,
    additionalProps?: any
  ) => (
    <View style={{ marginBottom: 15 }}>
      <TextInput
        placeholder={placeholder}
        value={value}
        onChangeText={(text) => handleInputChange(field, text)}
        onBlur={() => handleBlur(field)}
        placeholderTextColor="#999"
        editable={!isSubmitting}
        style={[
          styles.input,
          {
            color: safeColors.text,
            borderColor: errors[field] && touched[field] 
              ? safeColors.error 
              : safeColors.border,
            backgroundColor: isSubmitting ? "#f5f5f5" : "white",
          },
        ]}
        {...additionalProps}
      />
      {errors[field] && touched[field] && (
        <Text style={[styles.errorText, { color: safeColors.error }]}>
          {errors[field]}
        </Text>
      )}
    </View>
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: safeColors.background,
          padding: windowWidth * 0.05,
        }}
        keyboardShouldPersistTaps="handled"
      >
        <View
          style={{
            width: "100%",
            backgroundColor: safeColors.card,
            borderRadius: 20,
            padding: 20,
            elevation: 5,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
          }}
        >
          <Text
            style={{
              fontSize: windowHeight * 0.03,
              fontWeight: "bold",
              textAlign: "center",
              color: safeColors.text,
              marginBottom: 10,
            }}
          >
            Driver Registration
          </Text>

          <Text
            style={{
              fontSize: 14,
              textAlign: "center",
              color: "#666",
              marginBottom: 15,
            }}
          >
            Step 1 of 2: Personal Information
          </Text>

          {/* Progress Bar */}
          <ProgressBar
            currentStep={1}
            totalSteps={2}
            titles={["Personal Info", "Bus Details"]}
          />

          {/* Input Fields */}
          <View style={external.mt_15}>
            {renderInput("name", "Full Name", name, {
              autoCapitalize: "words",
              maxLength: 50,
            })}
            
            {renderInput("phone", "Phone Number (10 digits)", phone, {
              keyboardType: "phone-pad",
              maxLength: 10,
            })}
            
            {renderInput("email", "Email (Optional)", email, {
              keyboardType: "email-address",
              autoCapitalize: "none",
              maxLength: 100,
            })}
            
            {renderInput("license", "Driving License Number", license, {
              autoCapitalize: "characters",
              maxLength: 20,
            })}
            
            {renderInput("password", "Password", password, {
              secureTextEntry: true,
              maxLength: 50,
            })}
            
            {renderInput("confirmPassword", "Confirm Password", confirmPassword, {
              secureTextEntry: true,
              maxLength: 50,
            })}
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            onPress={handleContinueToBusDetails}
            disabled={isSubmitting}
            style={[
              styles.button,
              {
                backgroundColor: isSubmitting ? "#ccc" : safeColors.primary,
                opacity: isSubmitting ? 0.7 : 1,
              },
            ]}
          >
            {isSubmitting ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Next: Bus Details</Text>
            )}
          </TouchableOpacity>

          {/* Footer */}
          <TouchableOpacity
            onPress={() => router.push("/(routes)/login")}
            disabled={isSubmitting}
            style={{ marginTop: windowHeight * 0.02, alignSelf: "center" }}
          >
            <Text style={{ color: safeColors.text, fontSize: 14 }}>
              Already have an account?{" "}
              <Text style={{ color: safeColors.primary, fontWeight: "bold", textDecorationLine: "underline" }}>
                Login
              </Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = {
  input: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
  },
  button: {
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center" as const,
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold" as const,
  },
  errorText: {
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
};