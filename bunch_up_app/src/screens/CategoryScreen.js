import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from 'react-native';

const CategoryScreen = ({navigation}) => {
  // 模拟类别数据
  const categories = [
    {
      id: 1,
      name: '短视频主播',
      description: '短视频主播交流群',
      memberCount: 1250,
      groupCount: 3,
    },
    {
      id: 2,
      name: '炒股',
      description: '股票投资交流群',
      memberCount: 800,
      groupCount: 2,
    },
    {
      id: 3,
      name: '财经',
      description: '财经资讯交流群',
      memberCount: 650,
      groupCount: 2,
    },
    {
      id: 4,
      name: '程序员',
      description: '程序员技术交流群',
      memberCount: 1200,
      groupCount: 4,
    },
    {
      id: 5,
      name: '设计师',
      description: '设计师创意交流群',
      memberCount: 900,
      groupCount: 3,
    },
  ];

  const handleCategorySelect = (category) => {
    navigation.navigate('Chat', { category });
  };

  const renderCategoryItem = ({item}) => (
    <TouchableOpacity
      style={styles.categoryItem}
      onPress={() => handleCategorySelect(item)}>
      <View style={styles.categoryInfo}>
        <Text style={styles.categoryName}>{item.name}</Text>
        <Text style={styles.categoryDescription}>{item.description}</Text>
        <View style={styles.categoryStats}>
          <Text style={styles.statText}>{item.memberCount}人</Text>
          <Text style={styles.statText}>{item.groupCount}个群</Text>
        </View>
      </View>
      <Text style={styles.arrow}>›</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>选择类别</Text>
        <Text style={styles.headerSubtitle}>选择一个您感兴趣的类别开始聊天</Text>
      </View>

      <FlatList
        data={categories}
        renderItem={renderCategoryItem}
        keyExtractor={item => item.id.toString()}
        showsVerticalScrollIndicator={false}
        style={styles.categoryList}
      />
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
    paddingHorizontal: 32,
    paddingTop: 60,
    paddingBottom: 32,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333333',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666666',
  },
  categoryList: {
    flex: 1,
    paddingHorizontal: 32,
    paddingTop: 20,
  },
  categoryItem: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 20,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  categoryInfo: {
    flex: 1,
  },
  categoryName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 4,
  },
  categoryDescription: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 8,
  },
  categoryStats: {
    flexDirection: 'row',
  },
  statText: {
    fontSize: 12,
    color: '#999999',
    marginRight: 16,
  },
  arrow: {
    fontSize: 20,
    color: '#cccccc',
    fontWeight: 'bold',
  },
});

export default CategoryScreen; 