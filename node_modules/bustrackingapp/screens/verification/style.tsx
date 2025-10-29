import { StyleSheet } from 'react-native';
import color from '../../themes/app.colors';
import { windowHeight, windowWidth, SCREEN_WIDTH } from '../../themes/app.constant';

export const styles = StyleSheet.create({
  // --- Main Container ---
  container: {
    flex: 1,
    backgroundColor: color.whiteColor,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: windowWidth(20),
  },

  // --- Title & Subtitle ---
  titleText: {
    fontFamily: 'TT-Ocosquares-Medium',
    fontSize: windowHeight(25),
    color: color.primaryText,
    textAlign: 'center',
    marginBottom: windowHeight(10),
  },
  subtitleText: {
    fontSize: windowHeight(16),
    color: color.subtitle,
    textAlign: 'center',
    marginBottom: windowHeight(30),
  },

  // --- OTP Input Container ---
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: windowHeight(20),
  },

  // --- OTP Input Box ---
  OTPTextInput: {
    width: windowWidth(50),
    height: windowHeight(50),
    borderWidth: 1.5,
    borderColor: color.border || '#cccccc',
    borderRadius: windowHeight(8),
    marginHorizontal: windowWidth(8),
    fontSize: windowHeight(18),
    color: color.primaryText,
    textAlign: 'center',
    backgroundColor: color.whiteColor,
    fontWeight: '600',
  },

  // --- OTP Button ---
  buttonContainer: {
    width: SCREEN_WIDTH * 0.85,
    height: windowHeight(50),
    backgroundColor: color.buttonBg,
    borderRadius: windowHeight(10),
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: windowHeight(20),
  },
  buttonText: {
    color: color.whiteColor,
    fontSize: windowHeight(16),
    fontWeight: '600',
  },

  // --- Spacing ---
  sectionSpacing: {
    height: windowHeight(20),
  },
});
