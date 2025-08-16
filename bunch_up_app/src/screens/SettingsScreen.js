import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch } from 'react-native';

const SettingsScreen = ({ navigation }) => {
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = React.useState(false);

  const settingsSections = [
    {
      title: '通知设置',
      items: [
        {
          id: 'notifications',
          title: '推送通知',
          type: 'switch',
          value: notificationsEnabled,
          onValueChange: setNotificationsEnabled,
        },
        {
          id: 'sound',
          title: '声音提醒',
          type: 'switch',
          value: true,
          onValueChange: () => {},
        },
      ],
    },
    {
      title: '显示设置',
      items: [
        {
          id: 'darkMode',
          title: '深色模式',
          type: 'switch',
          value: darkModeEnabled,
          onValueChange: setDarkModeEnabled,
        },
        {
          id: 'fontSize',
          title: '字体大小',
          type: 'arrow',
          value: '中',
        },
      ],
    },
    {
      title: '账户设置',
      items: [
        {
          id: 'profile',
          title: '个人资料',
          type: 'arrow',
        },
        {
          id: 'password',
          title: '修改密码',
          type: 'arrow',
        },
        {
          id: 'logout',
          title: '退出登录',
          type: 'arrow',
          danger: true,
        },
      ],
    },
  ];

  const handleSettingPress = (setting) => {
    if (setting.id === 'logout') {
      // 处理退出登录
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    }
  };

  const renderSettingItem = (item) => {
    return (
      <TouchableOpacity
        key={item.id}
        style={[styles.settingItem, item.danger && styles.dangerItem]}
        onPress={() => handleSettingPress(item)}
        disabled={item.type === 'switch'}
      >
        <Text style={[styles.settingTitle, item.danger && styles.dangerText]}>
          {item.title}
        </Text>
        {item.type === 'switch' ? (
          <Switch
            value={item.value}
            onValueChange={item.onValueChange}
            trackColor={{ false: '#e9ecef', true: '#4a90e2' }}
            thumbColor={item.value ? '#ffffff' : '#ffffff'}
          />
        ) : (
          <View style={styles.settingRight}>
            {item.value && <Text style={styles.settingValue}>{item.value}</Text>}
            <Text style={styles.arrow}>›</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>设置</Text>
      </View>
      
      <ScrollView style={styles.content}>
        {settingsSections.map((section) => (
          <View key={section.title} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <View style={styles.sectionContent}>
              {section.items.map(renderSettingItem)}
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    padding: 20,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
  },
  content: {
    flex: 1,
  },
  section: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666666',
    marginBottom: 8,
    paddingHorizontal: 20,
  },
  sectionContent: {
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#e9ecef',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
       paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  dangerItem: {
    borderBottomColor: '#ffebee',
  },
  settingTitle: {
    fontSize: 16,
    color: '#333333',
  },
  dangerText: {
    color: '#f44336',
  },
  settingRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingValue: {
    fontSize: 14,
    color: '#999999',
    marginRight: 8,
  },
  arrow: {
    fontSize: 18,
    color: '#cccccc',
  },
});

export default SettingsScreen;
