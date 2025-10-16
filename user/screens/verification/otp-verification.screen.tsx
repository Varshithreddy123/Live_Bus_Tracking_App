import { View, Text, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import AuthContainer from '@/utils/container/auth-container';
import SignInText from '@/components/login/signin.text';
import { windowHeight } from '@/themes/app.constant';
import OTPTextInput from 'react-native-otp-textinput';
import { styles } from "./style";
import { external } from '@/styles/external.style';
import { router, useLocalSearchParams } from 'expo-router';
import Button from '@/components/common/button';
import color from '@/themes/app.colors';
import { commonStyles } from '@/styles/common.style';
import { useToast } from 'react-native-toast-notifications';
import axios from 'axios';

export default function OtpverificationScreen() {
  const { phoneNumber } = useLocalSearchParams(); // ✅ receive from LoginScreen
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  // --- 1️⃣ Send OTP Logic (optional resend) ---
  const handleSendOTP = async () => {
    if (!phoneNumber) {
      toast.show('Please enter a valid phone number', { placement: "bottom" });
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(`${process.env.EXPO_PUBLIC_SERVER_URI}/api/v1/send-otp`, {
        phone_number: phoneNumber,
      });
      console.log("OTP Sent:", response.data);
      toast.show('OTP sent successfully', { placement: "bottom" });
    } catch (error: any) {
      console.error("OTP Send Error:", error.response?.data || error.message);
      toast.show('Failed to send OTP. Please try again.', { placement: "bottom" });
    } finally {
      setLoading(false);
    }
  };

  // --- 2️⃣ Verify OTP Logic ---
  const handleVerifyOTP = async () => {
    if (!otp || otp.length !== 6) {
      toast.show('Please enter a valid 6-digit OTP', { placement: "bottom" });
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(`${process.env.EXPO_PUBLIC_SERVER_URI}/api/v1/verify-otp`, {
        otp: otp,
        phone_number: phoneNumber,
      });
      console.log("OTP Verified:", response.data);
      toast.show('OTP verified successfully', { placement: "bottom" });
      router.push("/home");
    } catch (error: any) {
      console.error("Verify Error:", error.response?.data || error.message);
      toast.show('Invalid OTP. Please try again.', { placement: "bottom" });
    } finally {
      setLoading(false);
    }
  };

  // --- 3️⃣ Resend OTP Logic ---
  const handleResendOTP = async () => {
    try {
      setLoading(true);
      const response = await axios.post(`${process.env.EXPO_PUBLIC_SERVER_URI}/api/v1/resend-otp`, {
        phone_number: phoneNumber,
      });
      console.log("OTP Resent:", response.data);
      toast.show('OTP resent successfully', { placement: "bottom" });
    } catch (error: any) {
      console.error("Resend Error:", error.response?.data || error.message);
      toast.show('Failed to resend OTP. Please try again.', { placement: "bottom" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContainer
      topSpace={windowHeight(240)}
      imageShow={true}
      container={
        <View>
          <SignInText
            title={"Otp Verification"}
            subtitle={`We’ve sent an OTP to ${phoneNumber}`}
          />

          {/* --- OTP Input --- */}
          <OTPTextInput
            handleCellTextChange={(code) => setOtp(code)}
            inputCount={6}
            textInputStyle={styles.OTPTextInput}
            tintColor={color.subtitle}
            autoFocus
          />

          {/* --- Verify Button --- */}
          <View style={[external.mt_30]}>
            <Button
              title={loading ? "Please wait..." : "Verify OTP"}
              onPress={handleVerifyOTP}
            />
          </View>

          {/* --- Resend OTP --- */}
          <View style={[external.mt_15]}>
            <View
              style={[
                external.pt_10,
                external.Pb_10,
                { flexDirection: "row", justifyContent: "center", alignItems: "center" },
              ]}
            >
              <Text
                style={[
                  commonStyles.regularTextBigBlack,
                  { color: "#000", marginTop: 20 },
                ]}
              >
                {"Not Received yet? "}
              </Text>
              <TouchableOpacity onPress={handleResendOTP}>
                <Text
                  style={[
                    commonStyles.regularTextBigBlack,
                    { color: "blue", marginTop: 20 },
                  ]}
                >
                  {"Resend OTP"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      }
    />
  );
}
