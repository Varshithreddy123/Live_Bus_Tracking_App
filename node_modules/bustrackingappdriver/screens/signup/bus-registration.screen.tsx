import React, { useState, useCallback, useEffect } from "react";
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
import { useRouter, useLocalSearchParams } from "expo-router";
import { useTheme } from "@react-navigation/native";
import ProgressBar from "@/components/common/progressbar/progressbar";
import { external } from "@/styles/external.style";

const { height: windowHeight, width: windowWidth } = Dimensions.get("window");

// ✅ Validation utilities
const validators = {
  busNumber: (value: string): { valid: boolean; error?: string } => {
    const trimmed = value.trim().toUpperCase();
    
    if (!trimmed) {
      return { valid: false, error: "Bus number is required" };
    }
    
    if (trimmed.length < 3 || trimmed.length > 15) {
      return { valid: false, error: "Bus number must be 3-15 characters" };
    }
    
    // Allow alphanumeric with optional hyphens/spaces
    const busNumberRegex = /^[A-Z0-9]+([-\s]?[A-Z0-9]+)*$/;
    if (!busNumberRegex.test(trimmed)) {
      return { valid: false, error: "Invalid format (e.g., KL-07-1234, BUS123)" };
    }
    
    return { valid: true };
  },

  time: (value: string, label: string): { valid: boolean; error?: string } => {
    const trimmed = value.trim();
    
    if (!trimmed) {
      return { valid: false, error: `${label} is required` };
    }
    
    // Support both HH:MM and H:MM formats
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):([0-5][0-9])$/;
    if (!timeRegex.test(trimmed)) {
      return { valid: false, error: "Use HH:MM format (e.g., 08:30, 16:45)" };
    }
    
    return { valid: true };
  },

  timeRange: (departure: string, arrival: string): { valid: boolean; error?: string } => {
    const parseTime = (time: string) => {
      const [hours, minutes] = time.split(":").map(Number);
      return hours * 60 + minutes;
    };
    
    const depMinutes = parseTime(departure.trim());
    const arrMinutes = parseTime(arrival.trim());
    
    // Allow overnight routes (arrival next day)
    if (depMinutes >= arrMinutes) {
      return { 
        valid: false, 
        error: "Arrival time must be after departure time (same day)" 
      };
    }
    
    // Reasonable trip duration (5 min to 12 hours)
    const duration = arrMinutes - depMinutes;
    if (duration < 5) {
      return { valid: false, error: "Trip duration too short (minimum 5 minutes)" };
    }
    if (duration > 720) {
      return { valid: false, error: "Trip duration too long (maximum 12 hours)" };
    }
    
    return { valid: true };
  },

  routes: (value: string): { valid: boolean; error?: string } => {
    const trimmed = value.trim();
    
    if (!trimmed) {
      return { valid: false, error: "Route information is required" };
    }
    
    if (trimmed.length < 5) {
      return { valid: false, error: "Please provide detailed route info (min 5 characters)" };
    }
    
    if (trimmed.length > 200) {
      return { valid: false, error: "Route description too long (max 200 characters)" };
    }
    
    return { valid: true };
  },
};

// ✅ Security: Input sanitization
const sanitizeInput = (input: string): string => {
  return input
    .trim()
    .replace(/[<>\"']/g, "") // Remove potential XSS characters
    .replace(/\s+/g, " "); // Normalize whitespace
};

// ✅ Security: Detect malicious patterns
const containsMaliciousPattern = (input: string): boolean => {
  const maliciousPatterns = [
    /<script[\s\S]*?>[\s\S]*?<\/script>/gi,
    /javascript:/gi,
    /on\w+\s*=\s*["'][^"']*["']/gi,
    /data:text\/html/gi,
    /(SELECT|INSERT|UPDATE|DELETE|DROP|UNION|EXEC|EXECUTE)\s/gi,
    /(\-\-|\/\*|\*\/|;|\|\||&&)/g,
  ];
  
  return maliciousPatterns.some(pattern => pattern.test(input));
};

export default function BusRegistrationScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const params = useLocalSearchParams<{ name: string; phone: string; license: string; password: string }>();

  const safeColors = {
    background: String(colors.background || "#f9f9f9"),
    card: String(colors.card || "white"),
    border: String(colors.border || "#ccc"),
    text: String(colors.text || "#000"),
    primary: String(colors.primary || "#007bff"),
    error: "#dc3545",
    success: "#28a745",
  };

  // ✅ Form state
  const [busNumber, setBusNumber] = useState("");
  const [departureTime, setDepartureTime] = useState("");
  const [arrivalTime, setArrivalTime] = useState("");
  const [operatedRoutes, setOperatedRoutes] = useState("");
  const [registerId] = useState(`BUS-${Date.now()}`);
  
  // ✅ Validation state
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ✅ Progress calculation
  const filledFields = [busNumber, departureTime, arrivalTime, operatedRoutes].filter(
    value => value.trim().length > 0
  ).length;
  const progress = (filledFields / 4) * 100;

  // ✅ Real-time field validation
  const validateField = useCallback((field: string, value: string) => {
    let validation;
    
    switch (field) {
      case "busNumber":
        validation = validators.busNumber(value);
        break;
      case "departureTime":
        validation = validators.time(value, "Departure time");
        break;
      case "arrivalTime":
        validation = validators.time(value, "Arrival time");
        if (validation.valid && departureTime) {
          validation = validators.timeRange(departureTime, value);
        }
        break;
      case "operatedRoutes":
        validation = validators.routes(value);
        break;
      default:
        validation = { valid: true };
    }
    
    setErrors(prev => ({
      ...prev,
      [field]: validation.valid ? "" : (validation.error || ""),
    }));
    
    return validation.valid;
  }, [departureTime]);

  // ✅ Handle input changes with validation
  const handleInputChange = (field: string, value: string) => {
    // Update value
    switch (field) {
      case "busNumber":
        setBusNumber(value);
        break;
      case "departureTime":
        setDepartureTime(value);
        break;
      case "arrivalTime":
        setArrivalTime(value);
        break;
      case "operatedRoutes":
        setOperatedRoutes(value);
        break;
    }
    
    // Validate if field was already touched
    if (touched[field]) {
      validateField(field, value);
    }
  };

  // ✅ Handle field blur (mark as touched)
  const handleBlur = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    
    // Get current value
    let value = "";
    switch (field) {
      case "busNumber": value = busNumber; break;
      case "departureTime": value = departureTime; break;
      case "arrivalTime": value = arrivalTime; break;
      case "operatedRoutes": value = operatedRoutes; break;
    }
    
    validateField(field, value);
  };

  // ✅ Comprehensive form validation
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    // Validate each field
    const busValidation = validators.busNumber(busNumber);
    if (!busValidation.valid) {
      newErrors.busNumber = busValidation.error || "";
      isValid = false;
    }

    const depTimeValidation = validators.time(departureTime, "Departure time");
    if (!depTimeValidation.valid) {
      newErrors.departureTime = depTimeValidation.error || "";
      isValid = false;
    }

    const arrTimeValidation = validators.time(arrivalTime, "Arrival time");
    if (!arrTimeValidation.valid) {
      newErrors.arrivalTime = arrTimeValidation.error || "";
      isValid = false;
    } else if (depTimeValidation.valid) {
      const timeRangeValidation = validators.timeRange(departureTime, arrivalTime);
      if (!timeRangeValidation.valid) {
        newErrors.arrivalTime = timeRangeValidation.error || "";
        isValid = false;
      }
    }

    const routesValidation = validators.routes(operatedRoutes);
    if (!routesValidation.valid) {
      newErrors.operatedRoutes = routesValidation.error || "";
      isValid = false;
    }

    setErrors(newErrors);
    
    // Mark all fields as touched
    setTouched({
      busNumber: true,
      departureTime: true,
      arrivalTime: true,
      operatedRoutes: true,
    });

    return isValid;
  };

  // ✅ Handle form submission
  const handleBusRegistration = async () => {
    // Prevent double submission
    if (isSubmitting) return;

    // Validate form
    if (!validateForm()) {
      Alert.alert("Validation Error", "Please fix all errors before submitting.");
      return;
    }

    // Security check for malicious patterns
    const allInputs = `${busNumber} ${departureTime} ${arrivalTime} ${operatedRoutes}`;
    if (containsMaliciousPattern(allInputs)) {
      Alert.alert(
        "Security Warning",
        "Invalid characters detected. Please remove special characters and try again."
      );
      return;
    }

    setIsSubmitting(true);

    try {
      // Sanitize all inputs
      const sanitizedData = {
        busNumber: sanitizeInput(busNumber.toUpperCase()),
        departureTime: sanitizeInput(departureTime),
        arrivalTime: sanitizeInput(arrivalTime),
        operatedRoutes: sanitizeInput(operatedRoutes),
        registerId,
        registeredAt: new Date().toISOString(),
      };

      // Complete driver registration with all data
      const registrationData = {
        driverId: `temp-${Date.now()}`, // Temporary ID until backend creates it
        name: params.name,
        email: params.email || null,
        phoneNumber: params.phone,
        drinving_license: params.license,
        country: null,
        vehicleNumber: sanitizedData.busNumber,
        vehicleType: "Petrol", // Default, can be updated later
        vehicleColor: null,
        vehicleImage: null,
        password: params.password,
        busNumber: sanitizedData.busNumber,
        departureTime: sanitizedData.departureTime,
        arrivalTime: sanitizedData.arrivalTime,
        operatedRoutes: sanitizedData.operatedRoutes,
        registerId: sanitizedData.registerId
      };

      console.log("Complete Registration Data:", registrationData);

      // Call backend API to register driver and bus
      const response = await fetch(`${process.env.EXPO_PUBLIC_SERVER_URI}/api/v1/driver/register-bus`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registrationData),
      });

      const result = await response.json();

      if (response.ok) {
        Alert.alert(
          "Success",
          "Registration completed successfully! You can now start accepting rides.",
          [
            {
              text: "Go to Dashboard",
              onPress: () => {
                // Navigate to driver dashboard or home
                router.push("/(routes)/profile"); // Or wherever the main driver screen is
              },
            },
          ]
        );
      } else {
        Alert.alert("Registration Failed", result.message || "Please try again.");
      }
    } catch (error) {
      console.error("Registration error:", error);
      Alert.alert(
        "Registration Failed",
        "Unable to complete registration. Please check your connection and try again.",
        [{ text: "OK" }]
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
            Bus Registration
          </Text>

          <Text
            style={{
              fontSize: 14,
              textAlign: "center",
              color: "#666",
              marginBottom: 15,
            }}
          >
            Step 2 of 2: Bus Details
          </Text>

          {/* Progress Bar */}
          <ProgressBar
            currentStep={2}
            totalSteps={2}
            titles={["Personal Info", "Bus Details"]}
          />

          {/* Input Fields */}
          <View style={external.mt_15}>
            {renderInput("busNumber", "Bus Number (e.g., KL-07-1234)", busNumber, {
              autoCapitalize: "characters",
              maxLength: 15,
            })}
            
            {renderInput("departureTime", "Departure Time (e.g., 08:30)", departureTime, {
              keyboardType: "numbers-and-punctuation",
              maxLength: 5,
            })}
            
            {renderInput("arrivalTime", "Arrival Time (e.g., 16:45)", arrivalTime, {
              keyboardType: "numbers-and-punctuation",
              maxLength: 5,
            })}
            
            {renderInput(
              "operatedRoutes",
              "Route Details (e.g., City Center to Airport via Highway)",
              operatedRoutes,
              {
                multiline: true,
                numberOfLines: 3,
                maxLength: 200,
                textAlignVertical: "top",
              }
            )}

            <View style={{ marginBottom: 15 }}>
              <Text style={{ fontSize: 12, color: "#666", marginBottom: 5 }}>
                Register ID (Auto-generated)
              </Text>
              <TextInput
                value={registerId}
                editable={false}
                style={[
                  styles.input,
                  {
                    color: "#666",
                    borderColor: safeColors.border,
                    backgroundColor: "#f0f0f0",
                  },
                ]}
              />
            </View>
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            onPress={handleBusRegistration}
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
              <Text style={styles.buttonText}>Register Bus & Continue</Text>
            )}
          </TouchableOpacity>

          {/* Back Button */}
          <TouchableOpacity
            onPress={() => router.back()}
            disabled={isSubmitting}
            style={{ marginTop: windowHeight * 0.02, alignSelf: "center" }}
          >
            <Text style={{ color: safeColors.text, fontSize: 14 }}>
              ← Back to Personal Info
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