import React, { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useDispatch } from 'react-redux';
import { loadAuthData } from '../utils/storage';
import { setAuthData } from '../store/slices/authSlice';

const InitializeApp = ({ children }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const initializeAuth = async () => {
      const authData = await loadAuthData();
      if (authData) {
        dispatch(setAuthData(authData));
      }
    };

    initializeAuth();
  }, [dispatch]);

  return children;
};

export default InitializeApp;
