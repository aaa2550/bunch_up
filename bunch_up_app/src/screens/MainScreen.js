import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import WebIcon from '../components/WebIcon';

import ChatListScreen from './ChatListScreen';
import CategoryScreen from './CategoryScreen';
import ToolScreen from './ToolScreen';
import ProfileScreen from './ProfileScreen';

const Tab = createBottomTabNavigator();

const MainScreen = () => {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarIcon: ({focused, color, size}) => {
          let iconName;

          if (route.name === 'ChatList') {
            iconName = 'chat';
          } else if (route.name === 'Category') {
            iconName = 'category';
          } else if (route.name === 'Tool') {
            iconName = 'build';
          } else if (route.name === 'Profile') {
            iconName = 'person';
          }

          return <WebIcon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#f4511e',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}>
      <Tab.Screen
        name="ChatList"
        component={ChatListScreen}
        options={{title: '聊天'}}
      />
      <Tab.Screen
        name="Category"
        component={CategoryScreen}
        options={{title: '类别'}}
      />
      <Tab.Screen
        name="Tool"
        component={ToolScreen}
        options={{title: '工具'}}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{title: '我的'}}
      />
    </Tab.Navigator>
  );
};

export default MainScreen; 