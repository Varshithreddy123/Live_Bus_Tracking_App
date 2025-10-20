import React, { useState } from 'react';
import { View, Image } from 'react-native';
import AuthContainer from '@/utils/container/auth-container';
import { windowHeight } from '@/themes/app.constant';
import Images from '@/utils/images';
import { styles } from '@/utils/container/styles';
import { styles as loginStyles } from '@/screens/login/styles';
import SignInText from '@/components/login/signin.text';
import PhoneNumberInput from '@/components/login/phone-number.input';
import { external } from '@/styles/external.style';
import Button from '@/components/common/button';
import { useToast } from 'react-native-toast-notifications';
import axios from 'axios';
import { CountryCode } from 'react-native-country-picker-modal';
import { router } from 'expo-router';

// Create a custom axios instance with proper configuration
const api = axios.create({
  timeout: 10000, // 10 seconds timeout
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
});

export default function LoginScreen() {
  const [phone_number, setPhoneNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [countryCode, setCountryCode] = useState<CountryCode>("IN");
  const [callingCode, setCallingCode] = useState("91");
  const [countryName, setCountryName] = useState("India");
  const [isPhoneNumberValid, setIsPhoneNumberValid] = useState(false);
  const [otp, setOtp] = useState('');
  const toast = useToast();

  const handleSubmit = async () => {
    
    if (!isPhoneNumberValid) {
      toast.show('Please enter a valid phone number', {
        placement: "bottom",
      });
      return;
    }
     setIsLoading(true);
    const fullPhoneNumber = `+${callingCode}${phone_number}`;
    console.log("Sending OTP to:", fullPhoneNumber);
    console.log("API URL:", `${process.env.EXPO_PUBLIC_SERVER_URI}/api/v1/send-otp`);

    try {
      const response = await api.post(`${process.env.EXPO_PUBLIC_SERVER_URI}/api/v1/send-otp`, {
        phone_number: fullPhoneNumber,
      });
      console.log("OTP Response:", response.data);
      toast.show('OTP sent successfully', { placement: "bottom" });
      // Navigate to OTP verification screen with phone number
      router.push(`/otp-verification?phoneNumber=${encodeURIComponent(fullPhoneNumber)}`);
    } catch (error: any) {
      console.error("Send OTP Error:", error);
      if (error.response) {
        // The request was made and the server responded with a status code
        console.error("Response data:", error.response.data);
        console.error("Response status:", error.response.status);
      } else if (error.request) {
        // The request was made but no response was received
        console.error("No response received:", error.request);
      } else {
        // Something happened in setting up the request
        console.error("Error message:", error.message);
      }
      toast.show('Failed to send OTP. Please try again.', { placement: "bottom" });
    }
      finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContainer
      topSpace={150}
      container={
        <View>
          <View>
            <Image
              style={loginStyles.transformLine}
              source={Images.line}
            />
            <SignInText />
            <View style={[external.mt_25, external.Pb_10]}>
              <PhoneNumberInput
                phone_number={phone_number}
                setPhoneNumber={setPhoneNumber}
                countryCode={countryCode}      // FIX prop name (no space)
                setCountryCode={setCountryCode}
                callingCode={callingCode}
                setCallingCode={setCallingCode}
                countryName={countryName}
                setCountryName={setCountryName}
                isPhoneNumberValid={isPhoneNumberValid}
                setIsPhoneNumberValid={setIsPhoneNumberValid}
                otp={otp}
                setOtp={setOtp}
              />
              <View style={[external.mt_25, styles.buttonContainer]}>
                <Button
                  title={isLoading ? "Sending..." : "Get OTP"}
                  onPress={handleSubmit}   // directly pass function reference
                />
              </View>
            </View>
          </View>
        </View>
      }
    />
  );
}
