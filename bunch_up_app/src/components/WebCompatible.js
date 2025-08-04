import React from 'react';
import {View, Text, TouchableOpacity, TextInput, FlatList, Image} from 'react-native';

// Web兼容的组件包装器
export const WebView = View;
export const WebText = Text;
export const WebTouchableOpacity = TouchableOpacity;
export const WebTextInput = TextInput;
export const WebFlatList = FlatList;
export const WebImage = Image;

// Web特定的样式适配
export const webStyles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '20px',
  },
  header: {
    position: 'sticky',
    top: 0,
    zIndex: 1000,
  },
  navigation: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 20px',
  },
}; 