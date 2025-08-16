import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import WebIcon from './WebIcon';

const SideMenu = ({ currentMenu, onMenuChange }) => {
  const menuItems = [
    { id: 'search', name: '搜索', icon: 'search' },
    { id: 'message', name: '消息', icon: 'chat' },
    { id: 'tool', name: '工具', icon: 'build' },
    { id: 'profile', name: '我的', icon: 'person' },
    { id: 'settings', name: '设置', icon: 'settings' }
  ];

  return (
    <View style={styles.container}>
      <View style={styles.menuContainer}>
        {menuItems.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={[
              styles.menuItem,
              currentMenu === item.id && styles.activeMenuItem
            ]}
            onPress={() => onMenuChange(item.id)}
          >
            <WebIcon
              name={item.icon}
              size={24}
              color={currentMenu === item.id ? '#ffffff' : '#4a90e2'}
            />
            <Text
              style={[
                styles.menuText,
                currentMenu === item.id && styles.activeMenuText
              ]}
            >
              {item.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 80,
    backgroundColor: '#ffffff',
    borderRightWidth: 1,
    borderRightColor: '#e9ecef',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 2,
      height: 0,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  menuContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    paddingVertical: 10,
  },
  menuItem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 8,
    marginVertical: 3,
    borderRadius: 10,
    minWidth: 56,
    minHeight: 56,
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  activeMenuItem: {
    backgroundColor: '#667eea',
    borderColor: '#667eea',
    shadowColor: '#667eea',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
  },
  menuText: {
    fontSize: 11,
    color: '#5a6c7d',
    marginTop: 3,
    fontWeight: '600',
    textAlign: 'center',
  },
  activeMenuText: {
    color: '#ffffff',
    fontWeight: '700',
  },
});

export default SideMenu;
