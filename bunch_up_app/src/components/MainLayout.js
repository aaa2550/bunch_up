import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import SideMenu from './SideMenu';
import SearchScreen from '../screens/SearchScreen';
import ChatListScreen from '../screens/ChatListScreen';
import ToolScreen from '../screens/ToolScreen';
import ProfileScreen from '../screens/ProfileScreen';
import SettingsScreen from '../screens/SettingsScreen';

const MainLayout = ({ navigation }) => {
  const [currentMenu, setCurrentMenu] = useState('message');

  const renderContent = () => {
    switch (currentMenu) {
      case 'search':
        return <SearchScreen navigation={navigation} />;
      case 'message':
        return <ChatListScreen navigation={navigation} />;
      case 'tool':
        return <ToolScreen navigation={navigation} />;
      case 'profile':
        return <ProfileScreen navigation={navigation} />;
      case 'settings':
        return <SettingsScreen navigation={navigation} />;
      default:
        return <ChatListScreen navigation={navigation} />;
    }
  };

  return (
    <View style={styles.container}>
      <SideMenu currentMenu={currentMenu} onMenuChange={setCurrentMenu} />
      <View style={styles.content}>
        {renderContent()}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#ffffff',
  },
  content: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
});

export default MainLayout;
