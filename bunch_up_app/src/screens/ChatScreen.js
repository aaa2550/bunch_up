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
import { fetchGroupsByCategory, fetchMessagesByGroup, fetchGroupOnlineCount } from '../api/chatAPI';
import { fetchToolsByCategory } from '../api/toolAPI';
import { formatChatTime, shouldShowTime, formatFullDateTime, isSameDay } from '../utils/timeUtils';

const ChatScreen = ({ navigation, route }) => {
  const { category } = route.params || {};
  const [currentGroup, setCurrentGroup] = useState(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [groups, setGroups] = useState([]);
  const [onlineCount, setOnlineCount] = useState(0);
  const [tools, setTools] = useState([]);
  const scrollViewRef = useRef();
  const subscription = useRef(null);

  // 动态添加鼠标悬停样式
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .tool-item:hover {
        transform: translateY(-1px);
        background-color: rgba(102, 126, 234, 0.08);
      }
      .tool-item:hover .tool-icon {
        background-color: #5a67d8;
        transform: scale(1.03);
        box-shadow: 0 2px 8px rgba(102, 126, 234, 0.25);
      }
      .tool-item {
        transition: all 0.15s ease;
        display: flex;
        flex-direction: column;
        align-items: center;
        position: relative;
      }
      .tool-icon {
        transition: all 0.15s ease;
      }
      /* 扁平化tooltip样式 */
      .tool-item[title]:hover::after {
        content: attr(title);
        position: absolute;
        bottom: -32px;
        left: 50%;
        transform: translateX(-50%);
        background-color: #2d3748;
        color: #ffffff;
        padding: 6px 10px;
        border-radius: 6px;
        font-size: 12px;
        font-weight: 500;
        white-space: nowrap;
        z-index: 1000;
        max-width: 180px;
        text-overflow: ellipsis;
        overflow: hidden;
        border: 1px solid #4a5568;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
        animation: fadeInUp 0.2s ease;
      }
      .tool-item[title]:hover::before {
        content: '';
        position: absolute;
        bottom: -26px;
        left: 50%;
        transform: translateX(-50%);
        width: 0;
        height: 0;
        border-left: 5px solid transparent;
        border-right: 5px solid transparent;
        border-bottom: 5px solid #2d3748;
        z-index: 1001;
      }
      @keyframes fadeInUp {
        0% {
          opacity: 0;
          transform: translateX(-50%) translateY(4px);
        }
        100% {
          opacity: 1;
          transform: translateX(-50%) translateY(0);
        }
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  // 获取当前登录用户信息
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const currentUser = { id: user.id, name: user.nickname || user.name || '' };

  // 检查用户是否已登录
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    console.log('ChatScreen - 检查用户登录状态:', user);
    
    if (!user.id || !user.token) {
      console.log('ChatScreen - 用户未登录，跳转到登录页面');
      // 用户未登录，跳转到登录页面
      navigation.replace('Login');
      return;
    }
    
    console.log('ChatScreen - 用户已登录:', user.nickname || user.name);
  }, [navigation]);

  const { isConnected, subscribe, sendMessage } = useWebSocket('http://localhost:8080/ws');

  useEffect(() => {
    if (!category?.id) return;
    let isMounted = true;
    (async () => {
      try {
        // 同时获取分组列表和工具列表
        const [groupList, toolList] = await Promise.all([
          fetchGroupsByCategory(category.id),
          fetchToolsByCategory(category.id)
        ]);
        
        if (isMounted) {
          setGroups(groupList);
          setTools(toolList || []);
          console.log('ChatScreen - 获取到的工具列表:', toolList);
          
          if (groupList.length > 0) handleGroupSelect(groupList[0]);
        }
      } catch (e) {
        console.error('ChatScreen - 获取数据失败:', e);
        setGroups([]);
        setTools([]);
      }
    })();
    return () => { isMounted = false; };
  }, [category, isConnected]);

  useEffect(() => {
    if (scrollViewRef.current) {
        scrollViewRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

  // 订阅WebSocket消息，依赖currentGroup和isConnected
  useEffect(() => {
    if (!currentGroup || !isConnected) return;
    if (subscription.current) {
      subscription.current.unsubscribe();
      sendMessage('/app/chat.leave', { groupId: currentGroup.id, userName: currentUser.name });
    }
    subscription.current = subscribe(`/topic/chat/${currentGroup.id}`, (receivedMessage) => {
      if (receivedMessage.type === 'CHAT' && receivedMessage.data.groupId === currentGroup.id) {
        setMessages((prevMessages) => {
          if (prevMessages.some(m => m.id === receivedMessage.data.id && m.content === receivedMessage.data.content)) {
            return prevMessages;
          }
          return [...prevMessages, receivedMessage.data];
        });
      }
    });
    sendMessage('/app/chat.join', { groupId: currentGroup.id, userName: currentUser.name });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentGroup, isConnected]);

  const handleGroupSelect = async (group) => {
    if (currentGroup?.id === group.id) return;
    setCurrentGroup(group);
    // 拉取历史消息
    try {
      const history = await fetchMessagesByGroup(group.id, 200);
      console.log('从后端获取的历史消息:', history);
      console.log('第一条消息示例:', history?.[0]);
      setMessages(history || []);
      
      // 获取在线人数
      const count = await fetchGroupOnlineCount(group.id);
      setOnlineCount(count || 0);
    } catch (e) {
      console.error('获取消息失败:', e);
      setMessages([]);
      setOnlineCount(0);
    }
  };

  const handleSendMessage = () => {
    if (message.trim() && currentGroup && isConnected) {
      const newMessage = {
        groupId: currentGroup.id,
        userId: currentUser.id,
        userName: currentUser.name,
        content: message.trim(),
        messageType: 1,
      };
      sendMessage('/app/chat.send', newMessage);
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

  const renderMessage = ({ item, index }) => {
    const isSelf = String(item.userId) === String(currentUser.id);
    const previousMessage = index > 0 ? messages[index - 1] : null;
    const shouldShowTimeFlag = shouldShowTime(item, previousMessage);
    const shouldShowDate = previousMessage && !isSameDay(new Date(item.sendTime), new Date(previousMessage.sendTime));
    
    // 添加调试日志
    console.log(`Message ${index}:`, {
      id: item.id,
      userId: item.userId,
      userName: item.userName,
      content: item.content,
      isSelf: isSelf,
      currentUser: currentUser
    });
    
    return (
      <View>
        {/* 跨天日期显示 */}
        {shouldShowDate && (
          <View style={styles.dateDivider}>
            <Text style={styles.dateText}>
              {formatFullDateTime(item.sendTime)}
            </Text>
          </View>
        )}
        
        {/* 时间显示（5分钟跨度） */}
        {shouldShowTimeFlag && !shouldShowDate && (
          <View style={styles.timeDivider}>
            <Text style={styles.timeText}>
              {formatChatTime(item.sendTime)}
            </Text>
          </View>
        )}
        
        <View style={[
          styles.messageContainer,
          isSelf ? styles.selfMessageContainer : styles.otherMessageContainer
        ]}>
          {!isSelf && (
            <View style={styles.avatarContainer}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{item.userName?.charAt(0) || 'U'}</Text>
              </View>
            </View>
          )}
          <View style={[styles.messageBubble, isSelf ? styles.selfBubble : styles.otherBubble]}>
            {!isSelf && (
              <Text style={styles.userName}>{item.userName || `用户${item.userId}`}</Text>
            )}
            <Text style={[styles.messageText, isSelf && styles.selfText]}>
              {item.content}
            </Text>
            {/* 聊天气泡小尖角 */}
            <View style={[styles.bubbleArrow, isSelf ? styles.selfBubbleArrow : styles.otherBubbleArrow]} />
          </View>
          {isSelf && (
            <View style={styles.avatarContainer}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{item.userName?.charAt(0) || 'U'}</Text>
              </View>
            </View>
          )}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* 程序坞 */}
      <View style={styles.dock}>
        <View style={styles.dockContainer}>
          <TouchableOpacity style={styles.dockItem}>
            <View style={styles.dockIcon}>
              <Text style={styles.dockIconText}>💬</Text>
            </View>
            <Text style={styles.dockLabel}>消息</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.dockItem}>
            <View style={styles.dockIcon}>
              <Text style={styles.dockIconText}>🛠️</Text>
            </View>
            <Text style={styles.dockLabel}>工具</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.dockItem}>
            <View style={styles.dockIcon}>
              <Text style={styles.dockIconText}>⚙️</Text>
            </View>
            <Text style={styles.dockLabel}>设置</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.dockItem}>
            <View style={styles.dockIcon}>
              <Text style={styles.dockIconText}>👤</Text>
            </View>
            <Text style={styles.dockLabel}>我的</Text>
          </TouchableOpacity>
        </View>
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
        {/* 聊天主体区域 */}
        <View style={styles.chatMain}>
          <View style={styles.chatHeader}>
            <Text style={styles.chatTitle}>{currentGroup?.name || '选择分组'}</Text>
            <Text style={styles.chatSubtitle}>{onlineCount}人</Text>
          </View>
          
          <ScrollView 
              ref={scrollViewRef} 
              style={styles.messageList} 
              showsVerticalScrollIndicator={false}
              onContentSizeChange={() => scrollViewRef.current.scrollToEnd({ animated: true })}
          >
            {messages.map((item, index) => (
              <View key={item.id || item.sendTime || Math.random()}>
                {renderMessage({ item, index })}
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

        {/* AI工具栏 - 右侧 */}
        {tools.length > 0 && (
          <View style={styles.toolsSidebar}>
            <View style={styles.toolsHeader}>
              <Text style={styles.toolsTitle}>AI工具</Text>
            </View>
            <ScrollView 
              showsVerticalScrollIndicator={false}
              style={styles.toolsScrollView}
            >
              <View style={styles.toolsGrid}>
                {tools.map((tool) => (
                  <div
                    key={tool.id}
                    className="tool-item"
                    title={tool.description || tool.name} // 悬停提示
                    style={styles.toolItem}
                    onClick={() => {
                      if (tool.url) {
                        // 在新标签页中打开工具
                        window.open(tool.url, '_blank');
                      }
                    }}
                  >
                    <View style={styles.toolIcon} className="tool-icon">
                      <Text style={styles.toolIconText}>
                        {tool.toolType === 'AI_AGENT' ? '🤖' : '🛠️'}
                      </Text>
                    </View>
                    <Text style={styles.toolName} numberOfLines={2}>
                      {tool.name}
                    </Text>
                  </div>
                ))}
              </View>
            </ScrollView>
          </View>
        )}
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
    width: 70,
    backgroundColor: '#f8f9fa',
    borderRightWidth: 2,
    borderRightColor: '#e9ecef',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#667eea',
    shadowOffset: { width: 3, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 6,
  },
  dockContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
  },
  dockItem: {
    alignItems: 'center',
    marginBottom: 12,
    paddingVertical: 6,
    paddingHorizontal: 6,
    borderRadius: 12,
    backgroundColor: 'transparent',
  },
  dockIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 3,
    borderWidth: 2,
    borderColor: '#667eea',
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  dockIconText: { 
    fontSize: 18,
    textShadow: '0px 1px 2px rgba(102, 126, 234, 0.3)',
  },
  dockLabel: {
    fontSize: 11,
    color: '#667eea',
    textAlign: 'center',
    fontWeight: '600',
    marginTop: 1,
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
    flexDirection: 'row',
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
  chatMain: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
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
  otherMessageContainer: {
    justifyContent: 'flex-start',
  },
  avatarContainer: {
    marginHorizontal: 8,
    alignSelf: 'flex-end',
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
    position: 'relative',
  },
  selfBubble: {
    backgroundColor: '#007AFF',
  },
  otherBubble: {
    backgroundColor: '#f0f0f0',
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
  bubbleArrow: {
    position: 'absolute',
    width: 0,
    height: 0,
    top: 12,
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderTopWidth: 8,
    borderBottomWidth: 0,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
  },
  selfBubbleArrow: {
    right: -8,
    borderLeftColor: '#007AFF',
    borderRightColor: 'transparent',
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
  },
  otherBubbleArrow: {
    left: -8,
    borderLeftColor: 'transparent',
    borderRightColor: '#f0f0f0',
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
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
  dateDivider: {
    alignSelf: 'center',
    marginVertical: 10,
    paddingHorizontal: 10,
    backgroundColor: '#e0e0e0',
    borderRadius: 8,
  },
  dateText: {
    fontSize: 12,
    color: '#666666',
    fontWeight: '500',
  },
  timeDivider: {
    alignSelf: 'center',
    marginVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
  },
  timeText: {
    fontSize: 11,
    color: '#999999',
  },
  // AI工具栏样式 - 右侧边栏
  toolsSidebar: {
    width: 240,
    backgroundColor: '#f8f9fa',
    borderLeftWidth: 1,
    borderLeftColor: '#e9ecef',
    display: 'flex',
    flexDirection: 'column',
  },
  toolsHeader: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
    backgroundColor: '#ffffff',
  },
  toolsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1976d2',
    textAlign: 'center',
  },
  toolsScrollView: {
    flex: 1,
    padding: 8,
  },
  toolsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 2,
    paddingHorizontal: 4,
  },
  toolItem: {
    alignItems: 'center',
    width: 'calc(33.333% - 1px)',
    marginBottom: 8,
    padding: 4,
    backgroundColor: 'transparent',
    borderRadius: 8,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  toolIcon: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: '#667eea',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  toolIconText: {
    fontSize: 16,
    filter: 'drop-shadow(0px 1px 2px rgba(255, 255, 255, 0.8))',
  },
  toolName: {
    fontSize: 10,
    color: '#333333',
    textAlign: 'center',
    fontWeight: '500',
    lineHeight: 12,
    height: 24,
  },
});

export default ChatScreen;
