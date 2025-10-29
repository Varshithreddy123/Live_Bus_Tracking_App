import React, { useState } from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import AuthContainer from "@/utils/container/auth-container";
import { windowHeight, windowWidth } from "@/themes/app.constant";
import Images from "@/utils/images";
import { styles } from "./styles";
import SignInText from "@/components/login/signin.text";
import { external } from "@/styles/external.style";
import Button from "@/components/common/button";
import { router } from "expo-router";
import PhoneNumberInput from "@/components/login/phone-number.input";
import { CountryCode } from "react-native-country-picker-modal";

export default function LoginScreen() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [countryCode, setCountryCode] = useState<CountryCode>("IN");
  const [callingCode, setCallingCode] = useState("91");
  const [countryName, setCountryName] = useState("India");
  const [isPhoneNumberValid, setIsPhoneNumberValid] = useState(false);
  const [otp, setOtp] = useState("");

  const handleSendOtp = async (phone: string) => {
    console.log("Send OTP to:", phone);
    // TODO: integrate your API / Firebase / Twilio here
  };

  return (
    <AuthContainer
      topSpace={windowHeight(150)}
      imageShow={true}
      container={
        <View>
          <View>
            <Image source={Images.line} style={styles.transformLine} />
            <SignInText />

            <View style={[external.mt_25, external.Pb_10]}>
              <PhoneNumberInput
                phone_number={phoneNumber}
                setPhoneNumber={setPhoneNumber}
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
                onSendOtp={handleSendOtp}
              />

              <View style={[external.mt_25, external.Pb_15]}>
                <Button
                  title="Get OTP"
                  height={windowHeight(35)}
                  onPress={() => {
                    if (!isPhoneNumberValid) {
                      console.log("Please enter a valid phone number");
                      return;
                    }
                    router.push({
                      pathname: "/verification/phone-number",
                      params: { phoneNumber: `+${callingCode}${phoneNumber}` }
                    });
                  }}
                />
              </View>
            </View>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                gap: windowWidth(8),
                paddingBottom: windowHeight(20),
              }}
            >
              <Text style={{ fontSize: 14, color: "#000", fontWeight: "bold" }}>
                Don't have an account?
              </Text>
              <TouchableOpacity onPress={() => router.push("/(routes)/signup")}>
                <Text
                  style={{
                    fontSize: 14,
                    color: "#007BFF",
                    fontWeight: "bold",
                    textDecorationLine: "underline",
                  }}
                >
                  Sign Up
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      }
    />
  );
}