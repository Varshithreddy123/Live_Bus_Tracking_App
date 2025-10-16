import { StyleSheet } from 'react-native';
import color from '../../themes/app.colors';
import appFonts from '../../themes/app.fonts';
import { fontSizes, windowHeight, windowWidth, SCREEN_WIDTH, SCREEN_HEIGHT } from '../../themes/app.constant';
import { external } from '../../styles/external.style';

// Common Spacing & Radius
const SPACING = {
  horizontal: windowWidth(20),
  vertical: windowHeight(20),
  smallVertical: windowHeight(10),
  largeVertical: windowHeight(40),
};
const RADIUS = {
  small: windowHeight(4),
  medium: windowHeight(20),
  large: windowHeight(30),
};

export const styles = StyleSheet.create({
  // --- Swiper Pagination ---
  activeDotStyle: {
    backgroundColor: color.buttonBg,
    width: windowWidth(30),
    height: windowHeight(8),
    borderRadius: RADIUS.small,
    marginHorizontal: windowWidth(3),
  },
  paginationStyle: {
    bottom: windowHeight(40),
    paddingVertical: SPACING.smallVertical,
  },

  // --- Containers ---
  slideContainer: {
    ...external.fx_1,
    ...external.js_center,
    ...external.ai_center,
    backgroundColor: color.whiteColor,
    paddingTop: windowHeight(50),
    paddingBottom: SPACING.largeVertical,
  },
  contentContainer: {
    ...external.fx_1,
    ...external.js_center,
    ...external.ai_center,
    paddingHorizontal: SPACING.horizontal,
  },
  textContainer: {
    ...external.ai_center,
    paddingHorizontal: windowWidth(30),
  },
  buttonContainer: {
    width: SCREEN_WIDTH * 0.85,
    paddingHorizontal: SPACING.horizontal,
    marginTop: SPACING.vertical,
  },

  // --- Images ---
  imageBackground: {
    width: SCREEN_WIDTH * 0.8,
    height: SCREEN_HEIGHT * 0.4,
    resizeMode: 'contain',
    marginBottom: SPACING.vertical,
  },
  imageBgView: {
    width: SCREEN_WIDTH,
    ...external.ai_center,
    ...external.js_center,
    paddingVertical: SPACING.largeVertical,
    minHeight: windowHeight(250),
  },
  img: {
    width: SCREEN_WIDTH,
    paddingHorizontal: windowWidth(30),
    paddingVertical: windowHeight(50),
    ...external.ai_center,
    ...external.js_center,
    minHeight: windowHeight(200),
  },

  // --- Texts ---
  title: {
    fontFamily: appFonts.semiBold,
    fontSize: fontSizes.FONT24,
    color: color.whiteColor,
    textAlign: 'center',
    fontWeight: '600',
    marginBottom: windowHeight(16),
    lineHeight: fontSizes.FONT24 * 1.3,
  },
  text: {
    fontFamily: appFonts.semiBold,
    fontSize: fontSizes.FONT28,
    color: color.whiteColor,
    textAlign: 'center',
    fontWeight: '600',
    marginBottom: windowHeight(16),
    paddingHorizontal: SPACING.horizontal,
    lineHeight: fontSizes.FONT28 * 1.3,
  },
  subtitle: {
    fontFamily: appFonts.regular,
    fontSize: fontSizes.FONT16,
    color: color.subtitle,
    textAlign: 'center',
    lineHeight: fontSizes.FONT16 * 1.5,
    paddingHorizontal: SPACING.horizontal,
    fontWeight: '400',
  },
  description: {
    fontFamily: appFonts.regular,
    fontSize: fontSizes.FONT16,
    color: color.subtitle,
    textAlign: 'center',
    lineHeight: fontSizes.FONT16 * 1.5,
    paddingHorizontal: windowWidth(30),
    fontWeight: '400',
  },

  // --- Dark Theme Variants ---
  textDark: {
    fontFamily: appFonts.semiBold,
    fontSize: fontSizes.FONT28,
    color: color.primaryText,
    textAlign: 'center',
    fontWeight: '600',
    marginBottom: windowHeight(16),
    paddingHorizontal: SPACING.horizontal,
    lineHeight: fontSizes.FONT28 * 1.3,
  },
  subtitleDark: {
    fontFamily: appFonts.regular,
    fontSize: fontSizes.FONT16,
    color: color.regularText,
    textAlign: 'center',
    lineHeight: fontSizes.FONT16 * 1.5,
    paddingHorizontal: SPACING.horizontal,
    fontWeight: '400',
  },

  // --- Shadows ---
  shadowContainer: {
    shadowOffset: { width: 0, height: windowHeight(2) },
    shadowOpacity: 0.1,
    shadowRadius: windowHeight(4),
    elevation: 3,
  },

  // --- Back Arrow ---
  backArrow: {
    position: 'absolute',
    bottom: SPACING.vertical,
    alignSelf: 'center',
    zIndex: 100,
    padding: SPACING.smallVertical,
    borderRadius: RADIUS.large,
    backgroundColor: color.buttonBg,
    ...external.ai_center,
    ...external.js_center,
    minWidth: windowWidth(44),
    minHeight: windowWidth(44), // Minimum touch size for accessibility
  },
  backArrowIcon: {
    width: windowWidth(20),
    height: windowHeight(20),
    tintColor: color.whiteColor,
    resizeMode: 'contain',
  },
});
