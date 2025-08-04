import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

const ChatScreen = ({navigation, category}) => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const flatListRef = useRef(null);

  // 模拟聊天消息数据
  useEffect(() => {
    const mockMessages = [
      {
        id: 1,
        userId: 1,
        userName: '张三',
        content: `大家好，我是新手${category?.name || '用户'}`,
        messageType: 'TEXT',
        createTime: '10:30',
        isSelf: false,
      },
      {
        id: 2,
        userId: 2,
        userName: '李四',
        content: '欢迎加入我们的群',
        messageType: 'TEXT',
        createTime: '10:32',
        isSelf: false,
      },
      {
        id: 3,
        userId: 3,
        userName: '我',
        content: '谢谢大家，请多指教',
        messageType: 'TEXT',
        createTime: '10:35',
        isSelf: true,
      },
    ];
    setMessages(mockMessages);
  }, [category]);

  const sendMessage = () => {
    if (!inputText.trim()) return;

    const newMessage = {
      id: Date.now(),
      userId: 3,
      userName: '我',
      content: inputText,
      messageType: 'TEXT',
      createTime: new Date().toLocaleTimeString('zh-CN', {
        hour: '2-digit',
        minute: '2-digit',
      }),
      isSelf: true,
    };

    setMessages(prev => [...prev, newMessage]);
    setInputText('');

    // 滚动到底部
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({animated: true});
    }, 100);
  };

  const renderMessage = ({item}) => (
    <View style={[styles.messageContainer, item.isSelf && styles.selfMessage]}>
      {!item.isSelf && (
        <View style={styles.avatarContainer}>
          <View style={styles.avatar} />
        </View>
      )}
      <View style={[styles.messageBubble, item.isSelf && styles.selfBubble]}>
        {!item.isSelf && (
          <Text style={styles.userName}>{item.userName}</Text>
        )}
        <Text style={[styles.messageText, item.isSelf && styles.selfText]}>
          {item.content}
        </Text>
        <Text style={[styles.messageTime, item.isSelf && styles.selfTime]}>
          {item.createTime}
        </Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* 头部 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{category?.name || '聊天'}</Text>
        <View style={styles.headerRight} />
      </View>

      {/* 聊天消息列表 */}
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={item => item.id.toString()}
        style={styles.messageList}
        showsVerticalScrollIndicator={false}
      />

      {/* 输入框 */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.inputContainer}>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            placeholder="输入消息..."
            placeholderTextColor="#999999"
            value={inputText}
            onChangeText={setInputText}
            multiline
          />
          <TouchableOpacity
            style={[styles.sendButton, !inputText.trim() && styles.sendButtonDisabled]}
            onPress={sendMessage}
            disabled={!inputText.trim()}>
            <Text style={[styles.sendButtonText, !inputText.trim() && styles.sendButtonTextDisabled]}>
              发送
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fa',
    minHeight: '100vh',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 24,
    color: '#667eea',
    fontWeight: 'bold',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
  },
  headerRight: {
    width: 40,
  },
  messageList: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  messageContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  selfMessage: {
    flexDirection: 'row-reverse',
  },
  avatarContainer: {
    marginRight: 8,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#667eea',
  },
  messageBubble: {
    maxWidth: '70%',
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  selfBubble: {
    backgroundColor: '#667eea',
    borderColor: '#667eea',
  },
  userName: {
    fontSize: 12,
    color: '#999999',
    marginBottom: 4,
  },
  messageText: {
    fontSize: 16,
    color: '#333333',
    lineHeight: 20,
  },
  selfText: {
    color: '#ffffff',
  },
  messageTime: {
    fontSize: 12,
    color: '#999999',
    marginTop: 4,
  },
  selfTime: {
    color: '#ffffff',
    opacity: 0.8,
  },
  inputContainer: {
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  input: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
    fontSize: 16,
    color: '#333333',
    maxHeight: 100,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  sendButton: {
    backgroundColor: '#667eea',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#cccccc',
  },
  sendButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  sendButtonTextDisabled: {
    color: '#999999',
  },
});

export default ChatScreen; 