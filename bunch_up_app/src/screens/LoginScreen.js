import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

const LoginScreen = ({navigation}) => {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    console.log('开始登录...');
    if (!phone.trim()) {
      alert('请输入手机号');
      return;
    }

    if (!password.trim()) {
      alert('请输入密码');
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
          phone: phone,
          password: password
        })
      });

      const result = await response.json();
      
      if (result.code === 0) {
        // 保存token到localStorage
        localStorage.setItem('token', result.data.token);
        alert('登录成功！');
        
        if (navigation && navigation.reset) {
          navigation.reset({
            index: 0,
            routes: [{ name: 'Category' }],
          });
        }
      } else {
        alert(result.message || '登录失败');
      }
    } catch (error) {
      console.error('登录失败:', error);
      alert('登录失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}>
        <View style={styles.content}>
          {/* Logo区域 */}
          <View style={styles.logoContainer}>
            <View style={styles.logoCircle}>
              <Text style={styles.logoText}>团</Text>
            </View>
            <Text style={styles.appTitle}>抱团</Text>
            <Text style={styles.appSubtitle}>连接你我，共创未来</Text>
          </View>

          {/* 登录表单 */}
          <View style={styles.formContainer}>
            {/* 手机号输入 */}
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="请输入手机号"
                placeholderTextColor="#999999"
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
                placeholderTextColor="#999999"
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
            <View style={styles.registerContainer}>
              <Text style={styles.registerText}>还没有账号？</Text>
              <TouchableOpacity onPress={() => navigation?.navigate('Register')}>
                <Text style={styles.registerLink}>立即注册</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
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
});

export default LoginScreen; 