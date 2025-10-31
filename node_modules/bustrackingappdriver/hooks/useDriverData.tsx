import { useState, useEffect } from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = 'http://localhost:8080/api/v1/driver'; // Update this to your actual server URL

export const useDriverData = (): UseDriverDataReturn => {
  const [driverData, setDriverData] = useState<DriverData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDriverData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get token from AsyncStorage
      const token = await AsyncStorage.getItem('driverToken');

      if (!token) {
        setError('No authentication token found');
        setLoading(false);
        return;
      }

      const response = await axios.get(`${BASE_URL}/profile/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.data.success) {
        setDriverData(response.data.driver);
      } else {
        setError(response.data.message || 'Failed to fetch driver data');
      }
    } catch (err: any) {
      console.error('Error fetching driver data:', err);
      setError(err.response?.data?.message || 'Failed to fetch driver data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDriverData();
  }, []);

  const refetch = () => {
    fetchDriverData();
  };

  return {
    driverData,
    loading,
    error,
    refetch,
  };
};
