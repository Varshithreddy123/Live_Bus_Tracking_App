import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import React, { useState, useCallback } from 'react';
import AuthContainer from '@/utils/container/auth-container';
import SignInText from '@/components/login/signin.text';
import { windowHeight } from '@/themes/app.constant';
import PhoneNumberInput from '@/components/login/phone-number.input';
import { external } from '@/styles/external.style';
import { router } from 'expo-router';
import Button from '@/components/common/button';
import { useToast } from 'react-native-toast-notifications';
import { CountryCode } from 'react-native-country-picker-modal';
import axios from 'axios';

// ✅ Create configured axios instance
const api = axios.create({
  timeout: 10000, // 10 seconds timeout
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
});

// ✅ Phone number validation utility
const validatePhoneNumber = (phone: string, countryCode: string): { valid: boolean; error?: string } => {
  const trimmed = phone.trim();
  
  if (!trimmed) {
    return { valid: false, error: "Phone number is required" };
  }
  
  // Remove any non-digit characters
  const digitsOnly = trimmed.replace(/\D/g, '');
  
  // Basic length validation (most countries: 7-15 digits)
  if (digitsOnly.length < 7) {
    return { valid: false, error: "Phone number too short" };
  }
  
  if (digitsOnly.length > 15) {
    return { valid: false, error: "Phone number too long" };
  }
  
  // India-specific validation (10 digits, starts with 6-9)
  if (countryCode === '91') {
    if (digitsOnly.length !== 10) {
      return { valid: false, error: "Indian phone numbers must be 10 digits" };
    }
    if (!/^[6-9]/.test(digitsOnly)) {
      return { valid: false, error: "Indian phone numbers must start with 6-9" };
    }
  }
  
  return { valid: true };
};

// ✅ Format phone number for display
const formatPhoneForDisplay = (phone: string, callingCode: string): string => {
  const digitsOnly = phone.replace(/\D/g, '');
  return `+${callingCode}${digitsOnly}`;
};

export default function PhoneNumberVerificationScreen() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [countryCode, setCountryCode] = useState<CountryCode>('IN');
  const [callingCode, setCallingCode] = useState('91');
  const [countryName, setCountryName] = useState('India');
  const [isPhoneNumberValid, setIsPhoneNumberValid] = useState(false);
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const toast = useToast();

  // ✅ Validate phone number on change
  const handlePhoneChange = useCallback((phone: string) => {
    setPhoneNumber(phone);
    setError(''); // Clear error when user types
    
    const validation = validatePhoneNumber(phone, callingCode);
    setIsPhoneNumberValid(validation.valid);
    
    if (phone.length >= 7 && !validation.valid) {
      setError(validation.error || '');
    }
  }, [callingCode]);

  // ✅ Send OTP with comprehensive error handling
  const handleSendOTP = async () => {
    // Clear previous errors
    setError('');
    
    // Validate phone number
    const validation = validatePhoneNumber(phoneNumber, callingCode);
    if (!validation.valid) {
      setError(validation.error || 'Invalid phone number');
      toast.show(validation.error || 'Please enter a valid phone number', { 
        placement: "bottom",
        type: "danger" 
      });
      return;
    }

    // Format full phone number
    const fullPhoneNumber = formatPhoneForDisplay(phoneNumber, callingCode);
    
    try {
      setLoading(true);
      
      console.log("Sending OTP to:", fullPhoneNumber);
      console.log("API URL:", `${process.env.EXPO_PUBLIC_SERVER_URI}/api/v1/send-otp-driver`);
      
      const payload = {
        phone_number: fullPhoneNumber,
        country_code: countryCode,
        calling_code: callingCode,
      };
      
      console.log("OTP Request payload:", payload);
      
      // Send OTP request
      const response = await api.post(
        `${process.env.EXPO_PUBLIC_SERVER_URI}/api/v1/driver/send-otp-driver`,
        payload
      );
      
      console.log("OTP Send Response:", response.data);
      
      // Success - navigate to OTP verification
      if (response.data && response.data.success) {
        toast.show('OTP sent successfully! Check your phone.', {
          placement: "bottom",
          type: "success"
        });

        // Navigate to OTP verification with phone number
        router.push({
          pathname: '/verification/phone-number',
          params: {
            phoneNumber: fullPhoneNumber,
            countryCode: countryCode,
            callingCode: callingCode,
          }
        });
      } else {
        // Handle unexpected response format
        console.error("Unexpected response format:", response.data);
        toast.show(response.data?.message || 'Failed to send OTP. Please try again.', {
          placement: "bottom",
          type: "warning"
        });
      }
      
    } catch (error: any) {
      console.error("OTP Send Error:", error);
      
      let errorMessage = 'Failed to send OTP. Please try again.';
      
      if (error.response) {
        // Server responded with error status
        console.error("Response data:", error.response.data);
        console.error("Response status:", error.response.status);
        
        if (error.response.status === 429) {
          errorMessage = 'Too many requests. Please wait a moment and try again.';
        } else if (error.response.status === 400) {
          errorMessage = error.response.data?.message || 'Invalid phone number format.';
        } else if (error.response.status === 404) {
          errorMessage = 'Phone number not registered. Please signup first.';
        } else if (error.response.status >= 500) {
          errorMessage = 'Server error. Please try again later.';
        } else {
          errorMessage = error.response.data?.message || errorMessage;
        }
      } else if (error.request) {
        // Request made but no response received
        console.error("No response received:", error.request);
        errorMessage = 'Network error. Please check your internet connection.';
      } else {
        // Error in request setup
        console.error("Error message:", error.message);
        errorMessage = error.message || errorMessage;
      }
      
      setError(errorMessage);
      toast.show(errorMessage, { 
        placement: "bottom",
        type: "danger" 
      });
    } finally {
      setLoading(false);
    }
  };

  // ✅ Check if button should be disabled
  const isButtonDisabled = loading || !isPhoneNumberValid || phoneNumber.length < 7;

  return (
    <AuthContainer
      topSpace={windowHeight(240)}
      imageShow={true}
      container={
        <View>
          <SignInText
            title={"Phone Number Verification"}
            subtitle={"Enter your phone number to receive a verification code"}
          />

          {/* Phone Number Input */}
          <View style={[external.mt_30]}>
            <PhoneNumberInput
              phone_number={phoneNumber}
              setPhoneNumber={handlePhoneChange}
              countryCode={countryCode}
              setCountryCode={setCountryCode}
              callingCode={callingCode}
              setCallingCode={setCallingCode}
              countryName={countryName}
              setCountryName={setCountryName}
              isPhoneNumberValid={isPhoneNumberValid}
              setIsPhoneNumberValid={setIsPhoneNumberValid}
              otp={otp}
              setOtp={setOtp}
              onSendOtp={(phone) => {
                // This gets called from PhoneNumberInput if it has a send button
                console.log("OTP send triggered from input:", phone);
              }}
            />
          </View>

          {/* Error Message */}
          {error && (
            <View style={[external.mt_15]}>
              <Text style={{ 
                color: '#dc3545', 
                fontSize: 14, 
                textAlign: 'center',
                paddingHorizontal: 20,
              }}>
                {error}
              </Text>
            </View>
          )}

          {/* Phone Number Preview */}
          {phoneNumber.length >= 7 && (
            <View style={[external.mt_15]}>
              <Text style={{ 
                color: '#666', 
                fontSize: 12, 
                textAlign: 'center',
                paddingHorizontal: 20,
              }}>
                OTP will be sent to: {formatPhoneForDisplay(phoneNumber, callingCode)}
              </Text>
            </View>
          )}

          {/* Send OTP Button */}
          <View style={[external.mt_30]}>
            <Button
              title={loading ? "Sending OTP..." : "Send Verification Code"}
              onPress={handleSendOTP}
              disabled={isButtonDisabled}
              height={windowHeight(35)}
            />
          </View>

          {/* Loading Indicator (if Button component doesn't show it) */}
          {loading && (
            <View style={[external.mt_15, { alignItems: 'center' }]}>
              <ActivityIndicator size="small" color="#007BFF" />
            </View>
          )}

          {/* Help Text */}
          <View style={[external.mt_20]}>
            <Text style={{ 
              color: '#666', 
              fontSize: 12, 
              textAlign: 'center',
              paddingHorizontal: 30,
              lineHeight: 18,
            }}>
              You'll receive a 6-digit verification code via SMS. Message and data rates may apply.
            </Text>
          </View>

          {/* Already verified? Sign in link */}
          <View style={[external.mt_25]}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text style={{ color: "#000", fontSize: 14 }}>
                Already verified? 
              </Text>
              <TouchableOpacity 
                onPress={() => router.push("/(routes)/login")}
                disabled={loading}
              >
                <Text
                  style={{
                    color: "#007BFF",
                    fontSize: 14,
                    fontWeight: "bold",
                    marginLeft: 5,
                    textDecorationLine: "underline",
                  }}
                >
                  Sign In
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      }
    />
  );
}