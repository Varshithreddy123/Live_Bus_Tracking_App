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

export default function LoginScreen() {
  const [phone_number, setPhoneNumber] = useState('');
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

    const fullPhoneNumber = `+${callingCode}${phone_number}`;

    try {
      const response = await axios.post(`${process.env.EXPO_PUBLIC_SERVER_URI}/api/v1/send-otp`, {
        phone_number: fullPhoneNumber,
      });
      console.log(response.data);
      toast.show('OTP sent successfully', { placement: "bottom" });
      // Navigate to OTP verification screen with phone number
      router.push({ pathname: "/otp-verification", params: { phoneNumber: fullPhoneNumber } });
    } catch (error) {
      console.error(error);
      toast.show('Failed to send OTP. Please try again.', { type: "error", placement: "bottom" });
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
                  title="Get OTP"
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
