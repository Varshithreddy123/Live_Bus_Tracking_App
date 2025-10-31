type ButtonProps = {
  title?: string;
  onPress?: () => void;
  width?: DimensionValue;
  height?:DimensitonValue;
  backgroundColor?: string;
  textColor?: string;
};

type DriverData = {
  id: string;
  name: string | null;
  email: string | null;
  phoneNumber: string | null;
  country: string | null;
  drinving_license: string | null;
  vehicleNumber: string | null;
  vehicleType: string;
  vehicleColor: string | null;
  vehicleImage: string | null;
  rating: number;
  totalEarning: number;
  totalRides: number;
  pendingRides: number;
  cancleRides: number;
  status: string;
  recentRides: any[];
};

type UseDriverDataReturn = {
  driverData: DriverData | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
};

type DriverType = {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  licenseNumber: string;
  vehicleDetails: {
    vehicleNumber: string;
    vehicleType: string;
    capacity: number;
  };
  profileCompleted: boolean;
};

declare module 'react-native' {
  interface ButtonProps extends ButtonProps {}
}

declare global {
  namespace ReactNavigation {
    interface RootParamList {
      Home: undefined;
      Login: undefined;
      Profile: { driverId: string };
    }
  }
}

export {};