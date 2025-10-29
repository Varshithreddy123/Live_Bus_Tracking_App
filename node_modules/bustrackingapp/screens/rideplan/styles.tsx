import { StyleSheet } from 'react-native';
import { windowHeight, windowWidth } from '@/themes/app.constant';
import color from '@/themes/app.colors';
import { external } from '@/styles/external.style';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.whiteColor,
  },

  mapContainer: {
    flex: 1,
    borderRadius: windowHeight(15),
    overflow: 'hidden',
    marginHorizontal: windowWidth(10),
    marginVertical: windowHeight(10),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },

  mapStyle: {
    flex: 1,
  },

  vehicleSelector: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginVertical: windowHeight(10),
  },

  vehicleButton: {
    backgroundColor: color.lightGray,
    paddingVertical: windowHeight(12),
    paddingHorizontal: windowWidth(20),
    borderRadius: windowHeight(12),
    ...external.ai_center,
    ...external.js_center,
  },

  selectedVehicleButton: {
    backgroundColor: color.primary,
  },

  vehicleText: {
    fontSize: windowHeight(16),
    fontWeight: '600',
    color: color.primaryText,
  },

  selectedVehicleText: {
    color: color.whiteColor,
  },

  infoContainer: {
    paddingHorizontal: windowWidth(15),
    paddingVertical: windowHeight(10),
  },

  travelTimeText: {
    fontSize: windowHeight(14),
    color: color.regularText,
    marginTop: windowHeight(4),
  },
});

export default styles;
