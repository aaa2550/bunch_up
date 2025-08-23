import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { fetchAITools } from '../api/toolAPI';

const AIToolBar = ({ categoryId, onToolClick }) => {
  const [tools, setTools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetchAITools(categoryId)
      .then(setTools)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [categoryId]);

  if (loading) return <View style={styles.container}><Text>加载中...</Text></View>;
  if (error) return <View style={styles.container}><Text style={{color:'red'}}>{error}</Text></View>;
  if (!tools.length) return <View style={styles.container}><Text>暂无可用AI工具</Text></View>;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>AI工具栏</Text>
      <FlatList
        data={tools}
        keyExtractor={item => item.id.toString()}
        renderItem={({item}) => (
          <TouchableOpacity style={styles.toolItem} onPress={() => onToolClick?.(item)}>
            <Image source={{uri: item.icon}} style={styles.icon} />
            <View style={styles.info}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.desc}>{item.description}</Text>
              <Text style={styles.type}>{item.isGlobal ? '全局通用' : '分类专用'}</Text>
            </View>
          </TouchableOpacity>
        )}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 260,
    backgroundColor: '#f8f9fa',
    borderLeftWidth: 1,
    borderLeftColor: '#e9ecef',
    padding: 10,
    height: '100%',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#1976d2',
  },
  toolItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  icon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    marginRight: 10,
    backgroundColor: '#fff',
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
  },
  desc: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  type: {
    fontSize: 11,
    color: '#f4511e',
    marginTop: 2,
  },
});

export default AIToolBar;
