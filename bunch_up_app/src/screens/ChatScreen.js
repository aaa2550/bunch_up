import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  TextInput,
  ScrollView,
} from 'react-native';
import useWebSocket from '../hooks/useWebSocket';
import { fetchGroupsByCategory } from '../api/chatAPI';

const ChatScreen = ({ navigation, route }) => {
  const { category } = route.params || {};
  const [currentGroup, setCurrentGroup] = useState(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [groups, setGroups] = useState([]);
  const scrollViewRef = useRef();
  const subscription = useRef(null);

  // TODO: Replace with actual user info from auth context/store
  const currentUser = { id: 1, name: '我' };

  const { isConnected, subscribe, sendMessage } = useWebSocket('http://localhost:8080/ws');

  useEffect(() => {
    if (!category?.id) return;
    let isMounted = true;
    (async () => {
      try {
        const groupList = await fetchGroupsByCategory(category.id);
        if (isMounted) {
          setGroups(groupList);
          if (groupList.length > 0) handleGroupSelect(groupList[0]);
        }
      } catch (e) {
        setGroups([]);
      }
    })();
    return () => { isMounted = false; };
  }, [category, isConnected]);

  useEffect(() => {
    if (scrollViewRef.current) {
        scrollViewRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

  const handleGroupSelect = (group) => {
    if (currentGroup?.id === group.id) return;
    
    // TODO: Replace with actual API call to get chat history for the group
    setMessages([]); // Clear messages when switching groups
    setCurrentGroup(group);

    if (isConnected) {
        if (subscription.current) {
            subscription.current.unsubscribe();
            sendMessage('/app/chat.leave', { groupId: currentGroup.id, userName: currentUser.name });
        }
        
        subscription.current = subscribe(`/topic/chat/${group.id}`, (receivedMessage) => {
             if (receivedMessage.type === 'CHAT' && receivedMessage.data.groupId === group.id) {
                setMessages((prevMessages) => [...prevMessages, receivedMessage.data]);
            }
        });

        sendMessage('/app/chat.join', { groupId: group.id, userName: currentUser.name });
    }
  };

  const handleSendMessage = () => {
    if (message.trim() && currentGroup && isConnected) {
      const newMessage = {
        groupId: currentGroup.id,
        userId: currentUser.id,
        userName: currentUser.name,
        content: message.trim(),
      };
      sendMessage('/app/chat.send', newMessage);
      // Optimistically add to messages list
      setMessages((prevMessages) => [...prevMessages, {...newMessage, sendTime: new Date().toISOString(), id: Date.now()}]);
      setMessage('');
    }
  };
  
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSendMessage();
    }
  };

  const renderGroupItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.groupItem, currentGroup?.id === item.id && styles.activeGroupItem]}
      onPress={() => handleGroupSelect(item)}>
      <View style={styles.groupInfo}>
        <Text style={styles.groupName}>{item.name}</Text>
        <Text style={styles.groupStats}>{item.memberCount}人</Text>
      </View>
      <Text style={styles.lastMessage} numberOfLines={1}>{item.lastMessage}</Text>
    </TouchableOpacity>
  );

  const renderMessage = ({ item }) => {
    const isSelf = item.userId === currentUser.id;
    return (
        <View style={[styles.messageContainer, isSelf && styles.selfMessageContainer]}>
          {!isSelf && (
            <View style={styles.avatarContainer}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{item.userName?.charAt(0) || 'U'}</Text>
              </View>
            </View>
          )}
          <View style={[styles.messageBubble, isSelf ? styles.selfBubble : {}]}>
            {!isSelf && (
              <Text style={styles.userName}>{item.userName}</Text>
            )}
            <Text style={[styles.messageText, isSelf && styles.selfText]}>
              {item.content}
            </Text>
          </View>
        </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Dock and Sidebar remain the same as original */}
      <View style={styles.dock}>
        <TouchableOpacity style={styles.dockItem}>
          <View style={styles.dockIcon}><Text style={styles.dockIconText}>📱</Text></View>
          <Text style={styles.dockLabel}>工具</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.dockItem}>
          <View style={styles.dockIcon}><Text style={styles.dockIconText}>⚙️</Text></View>
          <Text style={styles.dockLabel}>设置</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.dockItem}>
          <View style={styles.dockIcon}><Text style={styles.dockIconText}>👤</Text></View>
          <Text style={styles.dockLabel}>我的</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.dockItem}>
          <View style={styles.dockIcon}><Text style={styles.dockIconText}>💬</Text></View>
          <Text style={styles.dockLabel}>消息</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.dockItem}>
          <View style={styles.dockIcon}><Text style={styles.dockIconText}>🔍</Text></View>
          <Text style={styles.dockLabel}>搜索</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.sidebar}>
        <View style={styles.sidebarHeader}>
          <Text style={styles.sidebarTitle}>分组列表</Text>
        </View>
        <FlatList
          data={groups}
          renderItem={renderGroupItem}
          keyExtractor={item => item.id.toString()}
          showsVerticalScrollIndicator={false}
          style={styles.groupList}
        />
      </View>
      
      <View style={styles.chatArea}>
        <View style={styles.chatHeader}>
          <Text style={styles.chatTitle}>{currentGroup?.name || '选择分组'}</Text>
          <Text style={styles.chatSubtitle}>{currentGroup?.memberCount || 0}人</Text>
        </View>
        
        <ScrollView 
            ref={scrollViewRef} 
            style={styles.messageList} 
            showsVerticalScrollIndicator={false}
            onContentSizeChange={() => scrollViewRef.current.scrollToEnd({ animated: true })}
        >
          {messages.map((item) => (
            <View key={item.id || item.sendTime || Math.random()}>
              {renderMessage({ item })}
            </View>
          ))}
        </ScrollView>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="输入消息..."
            value={message}
            onChangeText={setMessage}
            multiline
            onKeyPress={handleKeyPress}
          />
          <TouchableOpacity
            style={styles.sendButton}
            onPress={handleSendMessage}>
            <Text style={styles.sendButtonText}>
              发送
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

// --- STYLES REVERTED TO ORIGINAL ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e3f2fd',
    height: '100vh',
    maxHeight: '100vh',
    display: 'flex',
    flexDirection: 'row',
    overflow: 'hidden',
  },
  dock: {
    width: 60,
    backgroundColor: '#ffffff',
    borderRightWidth: 1,
    borderRightColor: '#e9ecef',
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  dockItem: {
    alignItems: 'center',
    marginBottom: 20,
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderRadius: 8,
  },
  dockIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  dockIconText: { fontSize: 16 },
  dockLabel: {
    fontSize: 10,
    color: '#666666',
    textAlign: 'center',
  },
  sidebar: {
    width: 280,
    backgroundColor: '#ffffff',
    borderRightWidth: 1,
    borderRightColor: '#e9ecef',
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  sidebarHeader: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
    backgroundColor: '#f8f9fa',
  },
  sidebarTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1976d2',
  },
  groupList: { flex: 1 },
  groupItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  activeGroupItem: {
    backgroundColor: '#f8f9fa',
    borderLeftWidth: 3,
    borderLeftColor: '#007AFF',
  },
  groupInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  groupName: {
    fontSize: 13,
    fontWeight: '500',
    color: '#333333',
  },
  groupStats: {
    fontSize: 11,
    color: '#666666',
  },
  lastMessage: {
    fontSize: 11,
    color: '#999999',
  },
  chatArea: {
    flex: 1,
    backgroundColor: '#ffffff',
    display: 'flex',
    flexDirection: 'column',
    borderRadius: 12,
    margin: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
    overflow: 'hidden',
    height: 'calc(100vh - 32px)',
    maxHeight: 'calc(100vh - 32px)',
  },
  chatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
    backgroundColor: '#f8f9fa',
  },
  chatTitle: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: '#1976d2',
  },
  chatSubtitle: {
    fontSize: 11,
    color: '#666666',
  },
  messageList: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  messageContainer: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  selfMessageContainer: {
    justifyContent: 'flex-end',
  },
  avatarContainer: {
    marginRight: 8,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 12,
    color: '#ffffff',
    fontWeight: '500',
  },
  messageBubble: {
    maxWidth: '70%',
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  selfBubble: {
    backgroundColor: '#007AFF',
  },
  userName: {
    fontSize: 11,
    color: '#666666',
    marginBottom: 2,
  },
  messageText: {
    fontSize: 13,
    color: '#333333',
    lineHeight: 18,
  },
  selfText: {
    color: '#ffffff',
  },
  inputContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    minHeight: 60,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#e9ecef',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    maxHeight: 80,
    fontSize: 13,
    marginRight: 12,
    minHeight: 40,
    textAlignVertical: 'center',
    lineHeight: 20,
  },
  sendButton: {
    backgroundColor: '#007AFF',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    minHeight: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonText: {
    fontSize: 12,
    color: '#ffffff',
    fontWeight: '500',
  },
});

export default ChatScreen;
