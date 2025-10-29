import { StyleSheet } from 'react-native';
import color from '../../themes/app.colors';
import { windowHeight, windowWidth, SCREEN_WIDTH, SCREEN_HEIGHT } from '../../themes/app.constant';
import { external } from '../../styles/external.style';

export const styles = StyleSheet.create({
  // --- AuthContainer ---
  container: {
    flex: 1,
    backgroundColor: color.whiteColor,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: windowWidth(20),
  },
  backgroundImage: {
    width: '100%',
    height: windowHeight(300),
    position: 'absolute',
    top: 0,
    left: 0,
  },
  containerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: windowWidth(20),
    marginTop: windowHeight(200),
  },
  titleText: {
    fontFamily: 'TT-Ocosquares-Medium',
    fontSize: windowWidth(25),
    color: color.primaryText,
    textAlign: 'center',
    marginVertical: windowHeight(20),
  },

  // --- Images & Lines ---
  img: {
    width: SCREEN_WIDTH * 0.9,
    height: windowHeight(250),
    resizeMode: 'contain',
  },
  imageBgView: {
    width: SCREEN_WIDTH,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: windowHeight(20),
    minHeight: windowHeight(250),
  },
  transformLine: {
    width: windowWidth(200),
    height: windowHeight(2),
    backgroundColor: color.subtitle,
    marginVertical: windowHeight(10),
  },

  // --- Buttons ---
  button: {
    width: windowWidth(320),
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

  // --- Inputs ---
  inputContainer: {
    width: windowWidth(320),
    height: windowHeight(50),
    borderWidth: 1,
    borderColor: color.border,
    borderRadius: windowHeight(10),
    paddingHorizontal: windowWidth(12),
    marginTop: windowHeight(15),
    justifyContent: 'center',
  },
  inputText: {
    fontSize: windowHeight(16),
    color: color.primaryText,
    width: '100%',
    height: '100%',
  },

  // --- Spacing ---
  sectionSpacing: {
    height: windowHeight(20),
  },
});
