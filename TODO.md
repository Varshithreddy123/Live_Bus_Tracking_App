# Fix Registration Screen Issues

## Problem
- After successful registration, user is pushed to home tab but not remembered on app restart
- Existing users are not persisted in AsyncStorage after OTP verification

## Solution Steps
1. Update user/screens/registration/registration.screen.tsx to save user data to AsyncStorage after successful registration
2. Update user/screens/verification/otp-verification.screen.tsx to save existing user data to AsyncStorage after OTP verification
3. Test the complete flow to ensure users are remembered

## Files to Edit
- user/screens/registration/registration.screen.tsx
- user/screens/verification/otp-verification.screen.tsx
