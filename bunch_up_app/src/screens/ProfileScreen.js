import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import WebIcon from '../components/WebIcon';
import {logout} from '../store/slices/authSlice';

const ProfileScreen = ({navigation}) => {
  const dispatch = useDispatch();
  const {user} = useSelector((state) => state.auth);

  const handleLogout = () => {
    Alert.alert(
      '退出登录',
      '确定要退出登录吗？',
      [
        {
          text: '取消',
          style: 'cancel',
        },
        {
          text: '确定',
          onPress: () => {
            dispatch(logout());
            navigation.reset({
              index: 0,
              routes: [{name: 'Login'}],
            });
          },
        },
      ],
    );
  };

  const menuItems = [
    {
      id: 1,
      title: '个人资料',
      icon: 'person',
      onPress: () => navigation.navigate('EditProfile'),
    },
    {
      id: 2,
      title: '我的工具',
      icon: 'build',
      onPress: () => navigation.navigate('MyTools'),
    },
    {
      id: 3,
      title: '消息设置',
      icon: 'notifications',
      onPress: () => navigation.navigate('NotificationSettings'),
    },
    {
      id: 4,
      title: '隐私设置',
      icon: 'security',
      onPress: () => navigation.navigate('PrivacySettings'),
    },
    {
      id: 5,
      title: '关于我们',
      icon: 'info',
      onPress: () => navigation.navigate('About'),
    },
    {
      id: 6,
      title: '退出登录',
      icon: 'logout',
      onPress: handleLogout,
    },
  ];

  const renderMenuItem = (item) => (
    <TouchableOpacity
      key={item.id}
      style={styles.menuItem}
      onPress={item.onPress}>
      <View style={styles.menuItemLeft}>
        <WebIcon name={item.icon} size={24} color="#666" />
        <Text style={styles.menuItemText}>{item.title}</Text>
      </View>
              <WebIcon name="chevron-right" size={24} color="#ccc" />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* 用户信息 */}
      <View style={styles.userInfo}>
        <Image
          source={{
            uri: user?.avatar || 'https://via.placeholder.com/80',
          }}
          style={styles.avatar}
        />
        <View style={styles.userDetails}>
          <Text style={styles.userName}>{user?.nickname || '用户昵称'}</Text>
          <Text style={styles.userPhone}>{user?.phone || '手机号'}</Text>
        </View>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => navigation.navigate('EditProfile')}>
          <WebIcon name="edit" size={20} color="#f4511e" />
        </TouchableOpacity>
      </View>

      {/* 菜单列表 */}
      <View style={styles.menuContainer}>
        {menuItems.map(renderMenuItem)}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    marginBottom: 10,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 15,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  userPhone: {
    fontSize: 14,
    color: '#666',
  },
  editButton: {
    padding: 10,
  },
  menuContainer: {
    backgroundColor: '#fff',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 15,
  },
});

export default ProfileScreen; 