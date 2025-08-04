import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  TextInput,
  ScrollView,
} from 'react-native';

const ChatScreen = ({navigation, route}) => {
  const {category} = route.params || {};
  const [currentGroup, setCurrentGroup] = useState(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    // 模拟分组数据
    const mockGroups = [
      {id: 1, name: '新手主播群', memberCount: 125, lastMessage: '欢迎新朋友加入！'},
      {id: 2, name: '经验主播群', memberCount: 89, lastMessage: '今天直播效果不错'},
      {id: 3, name: 'MCN机构群', memberCount: 45, lastMessage: '有新的合作机会'},
    ];
    setGroups(mockGroups);
    setCurrentGroup(mockGroups[0]);

    // 模拟消息数据
    const mockMessages = [
      {id: 1, userId: 1, userName: '主播小王', content: '大家好，我是新来的主播', time: '14:30'},
      {id: 2, userId: 2, userName: '经验主播', content: '欢迎新朋友！有什么问题可以问我', time: '14:32'},
      {id: 3, userId: 1, userName: '主播小王', content: '谢谢！我想了解一下直播技巧', time: '14:33'},
      {id: 4, userId: 3, userName: 'MCN小李', content: '我们机构可以提供专业培训', time: '14:35'},
    ];
    setMessages(mockMessages);
  }, [category]);

  const handleSendMessage = () => {
    if (message.trim()) {
      const newMessage = {
        id: Date.now(),
        userId: 1,
        userName: '我',
        content: message.trim(),
        time: new Date().toLocaleTimeString('zh-CN', {hour: '2-digit', minute: '2-digit'}),
      };
      setMessages([...messages, newMessage]);
      setMessage('');
    }
  };

  const handleGroupSelect = (group) => {
    setCurrentGroup(group);
    // 这里可以加载对应群组的消息
  };

  const renderGroupItem = ({item}) => (
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

  const renderMessage = ({item}) => {
    const isSelf = item.userId === 1;
    return (
      <View style={[styles.messageContainer, isSelf && styles.selfMessageContainer]}>
        {!isSelf && (
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{item.userName.charAt(0)}</Text>
            </View>
          </View>
        )}
        <View style={[styles.messageBubble, isSelf && styles.selfBubble]}>
          {!isSelf && <Text style={styles.userName}>{item.userName}</Text>}
          <Text style={[styles.messageText, isSelf && styles.selfText]}>{item.content}</Text>
          <Text style={[styles.messageTime, isSelf && styles.selfTime]}>{item.time}</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* 头部 */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{category?.name || '聊天'}</Text>
        <View style={styles.headerRight} />
      </View>

      {/* 主体内容 */}
      <View style={styles.mainContent}>
        {/* 左侧分组列表 */}
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

        {/* 右侧聊天窗口 */}
        <View style={styles.chatArea}>
          <View style={styles.chatHeader}>
            <Text style={styles.chatTitle}>{currentGroup?.name || '选择分组'}</Text>
            <Text style={styles.chatSubtitle}>{currentGroup?.memberCount || 0}人</Text>
          </View>
          
          <ScrollView style={styles.messageList} showsVerticalScrollIndicator={false}>
            {messages.map((item, index) => renderMessage({item}))}
          </ScrollView>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="输入消息..."
              value={message}
              onChangeText={setMessage}
              multiline
            />
            <TouchableOpacity
              style={[styles.sendButton, !message.trim() && styles.sendButtonDisabled]}
              onPress={handleSendMessage}
              disabled={!message.trim()}>
              <Text style={[styles.sendButtonText, !message.trim() && styles.sendButtonTextDisabled]}>
                发送
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e3f2fd',
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 40,
    paddingBottom: 12,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  backButtonText: {
    fontSize: 18,
    color: '#007AFF',
  },
  headerTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    textAlign: 'center',
  },
  headerRight: {
    width: 34,
  },
  mainContent: {
    flex: 1,
    flexDirection: 'row',
    height: 'calc(100vh - 64px)',
    margin: 16,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  sidebar: {
    width: 280,
    backgroundColor: '#ffffff',
    borderRightWidth: 1,
    borderRightColor: '#e9ecef',
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
  groupList: {
    flex: 1,
  },
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
  },
  chatHeader: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
    backgroundColor: '#f8f9fa',
  },
  chatTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1976d2',
    marginBottom: 2,
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
  messageTime: {
    fontSize: 10,
    color: '#999999',
    marginTop: 4,
  },
  selfTime: {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  inputContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
    alignItems: 'flex-end',
    backgroundColor: '#ffffff',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#e9ecef',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    maxHeight: 80,
    fontSize: 13,
    marginRight: 8,
  },
  sendButton: {
    backgroundColor: '#007AFF',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  sendButtonDisabled: {
    backgroundColor: '#cccccc',
  },
  sendButtonText: {
    fontSize: 12,
    color: '#ffffff',
    fontWeight: '500',
  },
  sendButtonTextDisabled: {
    color: '#999999',
  },
});

export default ChatScreen; 