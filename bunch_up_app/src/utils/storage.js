import AsyncStorage from '@react-native-async-storage/async-storage';

const AUTH_KEY = 'auth_data';

export const saveAuthData = async (data) => {
  try {
    await AsyncStorage.setItem(AUTH_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving auth data:', error);
  }
};

export const loadAuthData = async () => {
  try {
    const data = await AsyncStorage.getItem(AUTH_KEY);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error loading auth data:', error);
    return null;
  }
};

export const clearAuthData = async () => {
  try {
    await AsyncStorage.removeItem(AUTH_KEY);
  } catch (error) {
    console.error('Error clearing auth data:', error);
  }
};
