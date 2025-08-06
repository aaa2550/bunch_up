import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import Toast from '../components/Toast';

const LoginScreen = ({navigation}) => {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');

  const handleLogin = async () => {
    if (!phone.trim() || !password.trim()) {
      setToastMessage('请输入手机号和密码');
      setToastType('warning');
      setShowToast(true);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('http://localhost:8080/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phone: phone.trim(),
          password: password,
        }),
      });

      const result = await response.json();

      if (result.code === 0) {
        // 登录成功
        setToastMessage('登录成功！');
        setToastType('success');
        setShowToast(true);
        
        // 存储token
        localStorage.setItem('token', result.data.token);
        localStorage.setItem('user', JSON.stringify(result.data.user));

        // 延迟跳转，让用户看到成功提示
        setTimeout(() => {
      navigation.reset({
        index: 0,
              routes: [{ name: 'Category' }],
          });
        }, 1500);
      } else {
        setToastMessage(result.message || '登录失败');
        setToastType('error');
        setShowToast(true);
      }
    } catch (error) {
      console.error('登录出错:', error);
      setToastMessage('网络错误，请重试');
      setToastType('error');
      setShowToast(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.keyboardView}>
        <View style={styles.content}>
          <View style={styles.logoContainer}>
            <View style={styles.logoCircle}>
              <Text style={styles.logoText}>抱</Text>
            </View>
            <Text style={styles.appTitle}>抱团</Text>
            <Text style={styles.appSubtitle}>在线聊天和工具平台</Text>
          </View>

          <View style={styles.formContainer}>
            {/* 手机号输入 */}
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="请输入手机号"
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
                maxLength={11}
              />
            </View>

            {/* 密码输入 */}
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="请输入密码"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                />
              </View>

            {/* 登录按钮 */}
            <TouchableOpacity
              style={[styles.loginButton, loading && styles.loginButtonDisabled]}
              onPress={handleLogin}
              disabled={loading}>
              <Text style={styles.loginButtonText}>
                {loading ? '登录中...' : '登录'}
              </Text>
            </TouchableOpacity>

            {/* 注册链接 */}
            <TouchableOpacity
              style={styles.registerLink}
              onPress={() => navigation.navigate('Register')}>
              <Text style={styles.registerLinkText}>立即注册</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

      {/* Toast提示 */}
      <Toast
        visible={showToast}
        message={toastMessage}
        type={toastType}
        onHide={() => setShowToast(false)}
      />
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
  keyboardView: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    width: 400,
    maxWidth: '90%',
    paddingVertical: 40,
    paddingHorizontal: 32,
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
  logoContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#1976d2',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  logoText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  appTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1976d2',
    marginBottom: 4,
  },
  appSubtitle: {
    fontSize: 14,
    color: '#666666',
  },
  formContainer: {
    width: '100%',
  },
  inputContainer: {
    paddingVertical: 12,
    minHeight: 48,
    justifyContent: 'center',
  },
  input: {
    height: 48,
    lineHeight: 48,
    textAlignVertical: 'center',
    fontSize: 16,
    color: '#333333',
    borderWidth: 1,
    borderColor: '#e9ecef',
    borderRadius: 4,
    paddingHorizontal: 12,
  },
  loginButton: {
    backgroundColor: '#1976d2',
    borderRadius: 4,
    paddingVertical: 16,
    marginTop: 24,
    marginBottom: 16,
    alignItems: 'center',
  },
  loginButtonDisabled: {
    backgroundColor: '#cccccc',
  },
  loginButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  registerText: {
    fontSize: 14,
    color: '#666666',
  },
  registerLink: {
    fontSize: 14,
    color: '#667eea',
    fontWeight: '600',
    marginLeft: 4,
  },
  registerLinkText: {
    fontSize: 14,
    color: '#667eea',
    fontWeight: '600',
    marginLeft: 4,
  },
});

export default LoginScreen; 