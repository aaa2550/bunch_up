import React from 'react';
import { View, StyleSheet } from 'react-native';
import ChatScreen from './ChatScreen';

const ChatWithSideMenu = ({ navigation, route }) => {
  return (
    <View style={styles.container}>
      <ChatScreen navigation={navigation} route={route} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
});

export default ChatWithSideMenu;
