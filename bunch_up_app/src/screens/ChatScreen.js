import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  TextInput,
  ScrollView,
  Modal, // Added Modal import
} from 'react-native';
import useWebSocket from '../hooks/useWebSocket';
import { fetchGroupsByCategory, fetchMessagesByGroup, fetchGroupOnlineCount } from '../api/chatAPI';
import { formatChatTime, shouldShowTime, formatFullDateTime, isSameDay } from '../utils/timeUtils';

const ChatScreen = ({ navigation, route }) => {
  const { category } = route.params || {};
  const [currentGroup, setCurrentGroup] = useState(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [groups, setGroups] = useState([]);
  const [onlineCount, setOnlineCount] = useState(0);
  const scrollViewRef = useRef();
  const subscription = useRef(null);
  const [currentTab, setCurrentTab] = useState('chat'); // 当前选中的选项卡
  const [showProfileModal, setShowProfileModal] = useState(false); // 个人资料弹窗
  const [showSettingsModal, setShowSettingsModal] = useState(false); // 设置弹窗
  const [currentTheme, setCurrentTheme] = useState('default'); // 当前主题

  // 主题配置
  const themes = {
    default: {
      primary: '#007AFF',
      secondary: '#5856D6',
      background: '#F2F2F7',
      surface: '#FFFFFF',
      text: '#000000',
      textSecondary: '#8E8E93',
      border: '#C6C6C8'
    },
    dark: {
      primary: '#0A84FF',
      secondary: '#5E5CE6',
      background: '#000000',
      surface: '#1C1C1E',
      text: '#FFFFFF',
      textSecondary: '#8E8E93',
      border: '#38383A'
    },
    warm: {
      primary: '#FF9500',
      secondary: '#FF3B30',
      background: '#FFF9F0',
      surface: '#FFFFFF',
      text: '#2C2C2E',
      textSecondary: '#8E8E93',
      border: '#FFE4C4'
    },
    nature: {
      primary: '#34C759',
      secondary: '#30D158',
      background: '#F0FFF4',
      surface: '#FFFFFF',
      text: '#1C1C1E',
      textSecondary: '#8E8E93',
      border: '#C4FFD4'
    }
  };

  const currentThemeColors = themes[currentTheme];

  // 处理选项卡切换
  const handleTabChange = (tab) => {
    setCurrentTab(tab);
    if (tab === 'profile') {
      setShowProfileModal(true);
    } else if (tab === 'settings') {
      setShowSettingsModal(true);
    }
  };

  // 处理主题切换
  const handleThemeChange = (theme) => {
    setCurrentTheme(theme);
    setShowSettingsModal(false);
  };

  // 渲染侧边选项卡
  const renderSidebarTabs = () => {
    const tabs = [
      { key: 'chat', icon: '💬', label: '聊天', color: currentThemeColors.primary },
      { key: 'profile', icon: '👤', label: '个人', color: currentThemeColors.secondary },
      { key: 'settings', icon: '⚙️', label: '设置', color: currentThemeColors.textSecondary }
    ];

    return (
      <View style={[styles.sidebarTabs, { backgroundColor: currentThemeColors.surface }]}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={[
              styles.tabItem,
              currentTab === tab.key && { backgroundColor: currentThemeColors.background }
            ]}
            onPress={() => handleTabChange(tab.key)}
          >
            <Text style={[styles.tabIcon, { color: tab.color }]}>{tab.icon}</Text>
            <Text style={[
              styles.tabLabel,
              { color: currentTab === tab.key ? currentThemeColors.text : currentThemeColors.textSecondary }
            ]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  // 渲染个人资料弹窗
  const renderProfileModal = () => (
    <Modal
      visible={showProfileModal}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setShowProfileModal(false)}
    >
      <View style={[styles.modalOverlay, { backgroundColor: 'rgba(0,0,0,0.5)' }]}>
        <View style={[styles.modalContent, { backgroundColor: currentThemeColors.surface }]}>
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, { color: currentThemeColors.text }]}>个人资料</Text>
            <TouchableOpacity onPress={() => setShowProfileModal(false)}>
              <Text style={[styles.closeButton, { color: currentThemeColors.textSecondary }]}>✕</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.profileForm}>
            <View style={styles.formRow}>
              <Text style={[styles.formLabel, { color: currentThemeColors.text }]}>头像</Text>
              <TouchableOpacity style={[styles.avatarUpload, { borderColor: currentThemeColors.border }]}>
                <Text style={styles.avatarUploadText}>点击上传</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.formRow}>
              <Text style={[styles.formLabel, { color: currentThemeColors.text }]}>昵称</Text>
              <TextInput
                style={[styles.formInput, { 
                  borderColor: currentThemeColors.border,
                  color: currentThemeColors.text,
                  backgroundColor: currentThemeColors.background
                }]}
                placeholder="请输入昵称"
                placeholderTextColor={currentThemeColors.textSecondary}
                defaultValue={currentUser?.nickname || ''}
              />
            </View>
            
            <View style={styles.formRow}>
              <Text style={[styles.formLabel, { color: currentThemeColors.text }]}>职业</Text>
              <TextInput
                style={[styles.formInput, { 
                  borderColor: currentThemeColors.border,
                  color: currentThemeColors.text,
                  backgroundColor: currentThemeColors.background
                }]}
                placeholder="请输入职业"
                placeholderTextColor={currentThemeColors.textSecondary}
                defaultValue={currentUser?.profession || ''}
              />
            </View>
            
            <View style={styles.formRow}>
              <Text style={[styles.formLabel, { color: currentThemeColors.text }]}>性别</Text>
              <View style={styles.genderSelector}>
                <TouchableOpacity style={[styles.genderOption, { backgroundColor: currentThemeColors.background }]}>
                  <Text style={[styles.genderText, { color: currentThemeColors.text }]}>男</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.genderOption, { backgroundColor: currentThemeColors.background }]}>
                  <Text style={[styles.genderText, { color: currentThemeColors.text }]}>女</Text>
                </TouchableOpacity>
              </View>
            </View>
            
            <View style={styles.formRow}>
              <Text style={[styles.formLabel, { color: currentThemeColors.text }]}>年龄</Text>
              <TextInput
                style={[styles.formInput, { 
                  borderColor: currentThemeColors.border,
                  color: currentThemeColors.text,
                  backgroundColor: currentThemeColors.background
                }]}
                placeholder="请输入年龄"
                placeholderTextColor={currentThemeColors.textSecondary}
                keyboardType="numeric"
                defaultValue={currentUser?.age?.toString() || ''}
              />
            </View>
            
            <View style={styles.formRow}>
              <Text style={[styles.formLabel, { color: currentThemeColors.text }]}>修改密码</Text>
              <TouchableOpacity style={[styles.passwordButton, { backgroundColor: currentThemeColors.primary }]}>
                <Text style={[styles.passwordButtonText, { color: '#FFFFFF' }]}>修改密码</Text>
              </TouchableOpacity>
            </View>
          </View>
          
          <TouchableOpacity 
            style={[styles.saveButton, { backgroundColor: currentThemeColors.primary }]}
            onPress={() => setShowProfileModal(false)}
          >
            <Text style={[styles.saveButtonText, { color: '#FFFFFF' }]}>保存</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  // 渲染设置弹窗
  const renderSettingsModal = () => (
    <Modal
      visible={showSettingsModal}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setShowSettingsModal(false)}
    >
      <View style={[styles.modalOverlay, { backgroundColor: 'rgba(0,0,0,0.5)' }]}>
        <View style={[styles.modalContent, { backgroundColor: currentThemeColors.surface }]}>
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, { color: currentThemeColors.text }]}>主题设置</Text>
            <TouchableOpacity onPress={() => setShowSettingsModal(false)}>
              <Text style={[styles.closeButton, { color: currentThemeColors.textSecondary }]}>✕</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.themeSelector}>
            {Object.entries(themes).map(([key, theme]) => (
              <TouchableOpacity
                key={key}
                style={[
                  styles.themeOption,
                  { 
                    backgroundColor: theme.background,
                    borderColor: currentTheme === key ? theme.primary : theme.border,
                    borderWidth: currentTheme === key ? 3 : 1
                  }
                ]}
                onPress={() => handleThemeChange(key)}
              >
                <View style={[styles.themePreview, { backgroundColor: theme.surface }]}>
                  <View style={[styles.themePreviewHeader, { backgroundColor: theme.primary }]} />
                  <View style={[styles.themePreviewContent, { backgroundColor: theme.background }]} />
                </View>
                <Text style={[styles.themeName, { color: theme.text }]}>
                  {key === 'default' ? '默认' : 
                   key === 'dark' ? '深色' : 
                   key === 'warm' ? '暖色' : '自然'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    </Modal>
  );

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
    <View style={[styles.container, { backgroundColor: currentThemeColors.background }]}>
      {/* 侧边选项卡 */}
      {renderSidebarTabs()}
      
      <View style={styles.sidebar}>
        <View style={styles.sidebarHeader}>
          <Text style={[styles.sidebarTitle, { color: currentThemeColors.text }]}>分组列表</Text>
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
        <View style={[styles.chatHeader, { backgroundColor: currentThemeColors.surface }]}>
          <Text style={[styles.chatTitle, { color: currentThemeColors.text }]}>{currentGroup?.name || '选择分组'}</Text>
          <Text style={[styles.chatSubtitle, { color: currentThemeColors.textSecondary }]}>{onlineCount}人</Text>
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

        <View style={[styles.inputContainer, { backgroundColor: currentThemeColors.surface }]}>
          <TextInput
            style={[styles.input, { 
              color: currentThemeColors.text,
              backgroundColor: currentThemeColors.background,
              borderColor: currentThemeColors.border
            }]}
            placeholder="输入消息..."
            placeholderTextColor={currentThemeColors.textSecondary}
            value={message}
            onChangeText={setMessage}
            multiline
            onKeyPress={handleKeyPress}
          />
          <TouchableOpacity
            style={[styles.sendButton, { backgroundColor: currentThemeColors.primary }]}
            onPress={handleSendMessage}>
            <Text style={[styles.sendButtonText, { color: '#FFFFFF' }]}>
              发送
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 个人资料弹窗 */}
      {renderProfileModal()}
      
      {/* 设置弹窗 */}
      {renderSettingsModal()}
    </View>
  );
};

// --- STYLES REVERTED TO ORIGINAL ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#F2F2F7',
  },
  sidebarTabs: {
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
  tabItem: {
    alignItems: 'center',
    marginBottom: 20,
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderRadius: 8,
    minHeight: 50,
    justifyContent: 'center',
  },
  tabIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  tabLabel: {
    fontSize: 10,
    textAlign: 'center',
    fontWeight: '500',
  },
  sidebar: {
    width: 200,
    backgroundColor: '#ffffff',
    borderRightWidth: 1,
    borderRightColor: '#e9ecef',
  },
  sidebarHeader: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  sidebarTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
  },
  groupList: {
    flex: 1,
  },
  groupItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  groupAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#007AFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  groupAvatarText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  groupInfo: {
    flex: 1,
  },
  groupName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000000',
    marginBottom: 2,
  },
  groupDescription: {
    fontSize: 12,
    color: '#666666',
  },
  chatArea: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  chatTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
  },
  chatSubtitle: {
    fontSize: 14,
    color: '#666666',
  },
  messageList: {
    flex: 1,
    padding: 16,
  },
  messageContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'flex-end',
  },
  selfMessageContainer: {
    justifyContent: 'flex-end',
  },
  otherMessageContainer: {
    justifyContent: 'flex-start',
  },
  avatarContainer: {
    marginHorizontal: 8,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#007AFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  messageBubble: {
    maxWidth: '70%',
    padding: 12,
    borderRadius: 18,
    position: 'relative',
  },
  selfBubble: {
    backgroundColor: '#007AFF',
    borderBottomRightRadius: 4,
  },
  otherBubble: {
    backgroundColor: '#E5E5EA',
    borderBottomLeftRadius: 4,
  },
  userName: {
    fontSize: 12,
    color: '#666666',
    marginBottom: 4,
    fontWeight: '500',
  },
  messageText: {
    fontSize: 16,
    color: '#000000',
    lineHeight: 20,
  },
  selfText: {
    color: '#ffffff',
  },
  bubbleArrow: {
    position: 'absolute',
    bottom: 0,
    width: 0,
    height: 0,
    borderStyle: 'solid',
  },
  selfBubbleArrow: {
    right: -8,
    borderLeftWidth: 8,
    borderRightWidth: 0,
    borderTopWidth: 8,
    borderBottomWidth: 0,
    borderLeftColor: '#007AFF',
    borderRightColor: 'transparent',
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
  },
  otherBubbleArrow: {
    left: -8,
    borderRightWidth: 8,
    borderLeftWidth: 0,
    borderTopWidth: 8,
    borderBottomWidth: 0,
    borderRightColor: '#E5E5EA',
    borderLeftColor: 'transparent',
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
    alignItems: 'flex-end',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 12,
    fontSize: 16,
    maxHeight: 100,
    textAlignVertical: 'top',
  },
  sendButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  timeDivider: {
    alignItems: 'center',
    marginVertical: 8,
  },
  timeText: {
    fontSize: 12,
    color: '#999999',
    backgroundColor: '#F2F2F7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  dateDivider: {
    alignItems: 'center',
    marginVertical: 16,
  },
  dateText: {
    fontSize: 14,
    color: '#666666',
    backgroundColor: '#E5E5EA',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    fontWeight: '500',
  },
  // New styles for modals
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    borderRadius: 12,
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  closeButton: {
    fontSize: 20,
  },
  profileForm: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  formRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  formLabel: {
    fontSize: 14,
    marginRight: 15,
    minWidth: 40,
  },
  formInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 14,
  },
  avatarUpload: {
    borderWidth: 1,
    borderColor: '#e9ecef',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarUploadText: {
    fontSize: 12,
    color: '#666666',
  },
  genderSelector: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  genderOption: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 8,
  },
  genderText: {
    fontSize: 14,
  },
  passwordButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  passwordButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  saveButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  saveButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  themeSelector: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  themeOption: {
    alignItems: 'center',
    width: '25%',
    paddingVertical: 10,
    borderRadius: 12,
  },
  themePreview: {
    width: 60,
    height: 60,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  themePreviewHeader: {
    width: '100%',
    height: 10,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  themePreviewContent: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },
  themeName: {
    fontSize: 12,
    textAlign: 'center',
  },
});

export default ChatScreen;
