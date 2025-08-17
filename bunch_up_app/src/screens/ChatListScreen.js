import React, { useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import { useSelector } from 'react-redux';
import WebIcon from '../components/WebIcon';
import { formatSessionTime } from '../utils/timeUtils';
import ToolBar from '../components/ToolBar';

const ChatListScreen = ({navigation}) => {
  const currentCategory = useSelector(state => state.category.currentCategory);
  const { isAuthenticated } = useSelector(state => state.auth);

  useEffect(() => {
    if (!isAuthenticated) {
      navigation.replace('Login');
      return;
    }
    if (!currentCategory) {
      navigation.replace('Category');
    }
  }, [currentCategory, isAuthenticated, navigation]);

  // 模拟聊天列表数据
  const chatList = [
    {
      id: 1,
      name: '新手主播群',
      lastMessage: '大家好，我是新手主播',
      time: new Date().getTime() - 2 * 60 * 60 * 1000, // 2小时前
      unreadCount: 2,
      avatar: 'https://via.placeholder.com/50',
    },
    {
      id: 2,
      name: '经验主播群',
      lastMessage: '分享一些直播技巧',
      time: new Date().getTime() - 24 * 60 * 60 * 1000, // 1天前
      unreadCount: 0,
      avatar: 'https://via.placeholder.com/50',
    },
    {
      id: 3,
      name: 'MCN机构群',
      lastMessage: '欢迎加入我们的机构',
      time: new Date().getTime() - 3 * 24 * 60 * 60 * 1000, // 3天前
      unreadCount: 5,
      avatar: 'https://via.placeholder.com/50',
    },
  ];

  const renderChatItem = ({item}) => (
    <TouchableOpacity
      style={styles.chatItem}
      onPress={() => navigation.navigate('Chat', {groupId: item.id})}>
      <Image source={{uri: item.avatar}} style={styles.avatar} />
      <View style={styles.chatInfo}>
        <View style={styles.chatHeader}>
          <Text style={styles.chatName}>{item.name}</Text>
          <Text style={styles.chatTime}>{formatSessionTime(item.time)}</Text>
        </View>
        <View style={styles.chatFooter}>
          <Text style={styles.lastMessage} numberOfLines={1}>
            {item.lastMessage}
          </Text>
          {item.unreadCount > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadCount}>{item.unreadCount}</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <FlatList
          data={chatList}
          renderItem={renderChatItem}
          keyExtractor={item => item.id.toString()}
          showsVerticalScrollIndicator={false}
        />
      </View>
      <ToolBar />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
  },
  chatItem: {
    flexDirection: 'row',
    padding: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  chatInfo: {
    flex: 1,
    justifyContent: 'space-between',
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  chatName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  chatTime: {
    fontSize: 12,
    color: '#999',
  },
  chatFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 5,
  },
  lastMessage: {
    flex: 1,
    fontSize: 14,
    color: '#666',
    marginRight: 10,
  },
  unreadBadge: {
    backgroundColor: '#f4511e',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  unreadCount: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default ChatListScreen; 