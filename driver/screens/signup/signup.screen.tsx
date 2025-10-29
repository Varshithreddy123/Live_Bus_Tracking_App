import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  Dimensions,
} from "react-native";
import { useRouter } from "expo-router";
import { useTheme } from "@react-navigation/native";
import ProgressBar from "@/components/common/progressbar/progressbar";
import { external } from "@/styles/external.style";

const { height: windowHeight, width: windowWidth } = Dimensions.get("window");

export default function SignupScreen() {
  const router = useRouter();
  const { colors } = useTheme();

  const safeColors = {
    background: String(colors.background || "#f9f9f9"),
    card: String(colors.card || "white"),
    border: String(colors.border || "#ccc"),
    text: String(colors.text || "#000"),
    primary: String(colors.primary || "#007bff"),
  };

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [license, setLicense] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const filledFields = [name, phone, license, password, confirmPassword].filter(Boolean).length;
  const progress = (filledFields / 5) * 100;

  const handleContinueToBusDetails = () => {
    if (!name || !phone || !license || !password || !confirmPassword) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match.");
      return;
    }

    // ✅ Navigate to bus registration (next step)
    router.push({
      pathname: "/(routes)/bus-registration",
      params: {
        name: name.trim(),
        phone: phone.trim(),
        license: license.trim(),
        password: password.trim()
      }
    });
  };

  return (
    <ScrollView
      contentContainerStyle={{
        flexGrow: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: safeColors.background,
        padding: windowWidth * 0.05,
      }}
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
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
        }}
      >
        <Text
          style={{
            fontSize: windowHeight * 0.03,
            fontWeight: "bold",
            textAlign: "center",
            color: safeColors.text,
            marginBottom: 15,
          }}
        >
          Driver Registration
        </Text>

        {/* Progress Bar */}
        <ProgressBar
          currentStep={1}
          totalSteps={3}
          titles={["Personal Info", "Bus Details", "Verification"]}
        />

        {/* Input Fields */}
        <View style={external.mt_15}>
          <TextInput
            placeholder="Full Name"
            value={name}
            onChangeText={setName}
            placeholderTextColor="#999"
            style={[
              styles.input,
              { color: safeColors.text, borderColor: safeColors.border },
            ]}
          />
          <TextInput
            placeholder="Phone Number"
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}
            placeholderTextColor="#999"
            style={[
              styles.input,
              { color: safeColors.text, borderColor: safeColors.border },
            ]}
          />
          <TextInput
            placeholder="Driving License Number"
            value={license}
            onChangeText={setLicense}
            placeholderTextColor="#999"
            style={[
              styles.input,
              { color: safeColors.text, borderColor: safeColors.border },
            ]}
          />
          <TextInput
            placeholder="Password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            placeholderTextColor="#999"
            style={[
              styles.input,
              { color: safeColors.text, borderColor: safeColors.border },
            ]}
          />
          <TextInput
            placeholder="Confirm Password"
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholderTextColor="#999"
            style={[
              styles.input,
              { color: safeColors.text, borderColor: safeColors.border },
            ]}
          />
        </View>

        {/* Register Button */}
        <TouchableOpacity
          onPress={handleContinueToBusDetails}
          style={[styles.button, { backgroundColor: safeColors.primary }]}
        >
          <Text style={styles.buttonText}>Next: Bus Details</Text>
        </TouchableOpacity>

        {/* Footer - Already have account */}
        <TouchableOpacity
          onPress={() => router.push("/(routes)/login")}
          style={{ marginTop: windowHeight * 0.02, alignSelf: "center" }}
        >
          <Text style={{ color: safeColors.primary, fontWeight: "bold" as const }}>
            Already have an account? <Text style={{ textDecorationLine: "underline" }}>Login</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = {
  input: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    marginBottom: 15,
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
};