import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from 'react-native';

const CategoryScreen = ({navigation}) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('http://localhost:8080/category/list');
      const result = await response.json();
      
      if (result.code === 0 && result.data && result.data.length > 0) {
        setCategories(result.data);
      } else {
        // 使用默认数据
        setCategories([
          {id: 1, name: '短视频主播', description: '短视频主播交流群'},
          {id: 2, name: '炒股', description: '股票投资交流群'},
          {id: 3, name: '财经', description: '财经资讯交流群'},
          {id: 4, name: '程序员', description: '程序员技术交流群'},
          {id: 5, name: '设计师', description: '设计师创意交流群'},
        ]);
      }
    } catch (error) {
      console.error('获取类别出错:', error);
      // 网络错误时使用默认数据
      setCategories([
        {id: 1, name: '短视频主播', description: '短视频主播交流群'},
        {id: 2, name: '炒股', description: '股票投资交流群'},
        {id: 3, name: '财经', description: '财经资讯交流群'},
        {id: 4, name: '程序员', description: '程序员技术交流群'},
        {id: 5, name: '设计师', description: '设计师创意交流群'},
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleCategorySelect = (category) => {
    navigation.navigate('Chat', { category });
  };

  const renderCategoryItem = ({item}) => (
    <TouchableOpacity
      style={styles.categoryItem}
      onPress={() => handleCategorySelect(item)}>
      <View style={styles.categoryContent}>
        <Text style={styles.categoryName}>{item.name}</Text>
        <Text style={styles.categoryDescription}>{item.description}</Text>
      </View>
      <Text style={styles.arrow}>›</Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>加载中...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>选择类别</Text>
          <Text style={styles.headerSubtitle}>选择一个您感兴趣的类别</Text>
        </View>

        <View style={styles.categoryContainer}>
      <FlatList
        data={categories}
        renderItem={renderCategoryItem}
        keyExtractor={item => item.id.toString()}
        showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.categoryList}
      />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e3f2fd',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#e3f2fd',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 14,
    color: '#666666',
  },
  content: {
    width: 480,
    maxWidth: '90%',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
    backgroundColor: '#f8f9fa',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1976d2',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#666666',
  },
  categoryContainer: {
    maxHeight: 400,
  },
  categoryList: {
    paddingTop: 8,
    paddingBottom: 16,
  },
  categoryItem: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 24,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  categoryContent: {
    flex: 1,
  },
  categoryName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333333',
    marginBottom: 2,
  },
  categoryDescription: {
    fontSize: 11,
    color: '#666666',
  },
  arrow: {
    fontSize: 12,
    color: '#cccccc',
    marginLeft: 8,
  },
});

export default CategoryScreen; 