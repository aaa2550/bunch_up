import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import WebIcon from '../components/WebIcon';

const ToolScreen = ({navigation}) => {
  // 模拟工具数据
  const tools = [
    {
      id: 1,
      name: 'AI助手',
      description: '智能AI助手，帮助解答问题',
      icon: 'https://via.placeholder.com/60',
      type: 'AGENT',
      isDefault: true,
    },
    {
      id: 2,
      name: '数据分析',
      description: '数据分析工具',
      icon: 'https://via.placeholder.com/60',
      type: 'NORMAL',
      isDefault: true,
    },
    {
      id: 3,
      name: '内容生成',
      description: 'AI内容生成工具',
      icon: 'https://via.placeholder.com/60',
      type: 'AGENT',
      isDefault: false,
    },
    {
      id: 4,
      name: '图片处理',
      description: '图片编辑和处理工具',
      icon: 'https://via.placeholder.com/60',
      type: 'NORMAL',
      isDefault: false,
    },
    {
      id: 5,
      name: '语音转文字',
      description: '语音识别和转文字工具',
      icon: 'https://via.placeholder.com/60',
      type: 'AGENT',
      isDefault: false,
    },
  ];

  const renderToolItem = ({item}) => (
    <TouchableOpacity
      style={styles.toolItem}
      onPress={() => navigation.navigate('ToolDetail', {tool: item})}>
      <Image source={{uri: item.icon}} style={styles.toolIcon} />
      <View style={styles.toolInfo}>
        <View style={styles.toolHeader}>
          <Text style={styles.toolName}>{item.name}</Text>
          {item.isDefault && (
            <View style={styles.defaultBadge}>
              <Text style={styles.defaultText}>默认</Text>
            </View>
          )}
        </View>
        <Text style={styles.toolDescription}>{item.description}</Text>
        <View style={styles.toolType}>
          <WebIcon
            name={item.type === 'AGENT' ? 'smart-toy' : 'build'}
            size={16}
            color={item.type === 'AGENT' ? '#f4511e' : '#666'}
          />
          <Text
            style={[
              styles.toolTypeText,
              {color: item.type === 'AGENT' ? '#f4511e' : '#666'},
            ]}>
            {item.type === 'AGENT' ? 'AI工具' : '普通工具'}
          </Text>
        </View>
      </View>
                <WebIcon name="chevron-right" size={24} color="#ccc" />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={tools}
        renderItem={renderToolItem}
        keyExtractor={item => item.id.toString()}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  toolItem: {
    flexDirection: 'row',
    padding: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    alignItems: 'center',
  },
  toolIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  toolInfo: {
    flex: 1,
  },
  toolHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  toolName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginRight: 10,
  },
  defaultBadge: {
    backgroundColor: '#f4511e',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  defaultText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  toolDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  toolType: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  toolTypeText: {
    fontSize: 12,
    marginLeft: 5,
  },
});

export default ToolScreen; 