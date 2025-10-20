import { View, Text } from 'react-native'
import React from 'react'
import OtpverificationScreen from '@/screens/verification/otp-verification.screen'
import { useLocalSearchParams } from 'expo-router'

export default function index() {
  const { phoneNumber } = useLocalSearchParams<{ phoneNumber: string }>()
  return (
    <OtpverificationScreen phoneNumber={phoneNumber} />
  )
}
