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

const RegisterScreen = ({navigation}) => {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [verifyCode, setVerifyCode] = useState('');
  const [countdown, setCountdown] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!phone.trim()) {
      alert('请输入手机号');
      return;
    }

    if (!password.trim()) {
      alert('请输入密码');
      return;
    }

    if (password !== confirmPassword) {
      alert('两次输入的密码不一致');
      return;
    }

    if (!verifyCode.trim()) {
      alert('请输入验证码');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('http://localhost:8080/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phone: phone,
          password: password,
          verifyCode: verifyCode
        })
      });

      const result = await response.json();
      
      if (result.code === 0) {
        alert('注册成功！');
        navigation?.replace('Login');
      } else {
        alert(result.message || '注册失败');
      }
    } catch (error) {
      console.error('注册失败:', error);
      alert('注册失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  const handleSendCode = async () => {
    if (!phone.trim()) {
      alert('请输入手机号');
      return;
    }

    if (countdown > 0) {
      return;
    }

    try {
      const formData = new FormData();
      formData.append('phone', phone);
      formData.append('type', 'register');

      const response = await fetch('http://localhost:8080/auth/sendVerifyCode', {
        method: 'POST',
        body: formData
      });

      const result = await response.json();
      
      if (result.code === 0) {
        alert('验证码已发送');
        setCountdown(60);
        const timer = setInterval(() => {
          setCountdown(prev => {
            if (prev <= 1) {
              clearInterval(timer);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      } else {
        alert(result.message || '发送验证码失败');
      }
    } catch (error) {
      console.error('发送验证码失败:', error);
      alert('发送验证码失败，请重试');
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

          {/* 注册表单 */}
          <View style={styles.formContainer}>
            {/* 手机号输入 */}
            <TextInput
              style={styles.input}
              placeholder="请输入手机号"
              placeholderTextColor="#999999"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              maxLength={11}
            />

            {/* 验证码输入 */}
            <View style={styles.verifyCodeContainer}>
              <TextInput
                style={styles.verifyCodeInput}
                placeholder="请输入验证码"
                placeholderTextColor="#999999"
                value={verifyCode}
                onChangeText={setVerifyCode}
                keyboardType="number-pad"
                maxLength={6}
              />
              <TouchableOpacity
                style={[styles.sendCodeButton, countdown > 0 && styles.sendCodeButtonDisabled]}
                onPress={handleSendCode}
                disabled={countdown > 0}>
                <Text style={[styles.sendCodeButtonText, countdown > 0 && styles.sendCodeButtonTextDisabled]}>
                  {countdown > 0 ? `${countdown}s` : '发送验证码'}
                </Text>
              </TouchableOpacity>
            </View>

            {/* 密码输入 */}
            <TextInput
              style={styles.input}
              placeholder="请输入密码"
              placeholderTextColor="#999999"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />

            {/* 确认密码输入 */}
            <TextInput
              style={styles.input}
              placeholder="请再次输入密码"
              placeholderTextColor="#999999"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
            />

            {/* 注册按钮 */}
            <TouchableOpacity
              style={[styles.registerButton, loading && styles.registerButtonDisabled]}
              onPress={handleRegister}
              disabled={loading}>
              <Text style={styles.registerButtonText}>
                {loading ? '注册中...' : '注册'}
              </Text>
            </TouchableOpacity>

            {/* 登录链接 */}
            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>已有账号？</Text>
              <TouchableOpacity onPress={() => navigation?.replace('Login')}>
                <Text style={styles.loginLink}>立即登录</Text>
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
    backgroundColor: '#f5f7fa',
    minHeight: '100vh',
  },
  keyboardView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  content: {
    width: 400,
    maxWidth: '90%',
    paddingHorizontal: 32,
    paddingVertical: 40,
    backgroundColor: '#ffffff',
    borderRadius: 8,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#667eea',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  logoText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  appTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#333333',
    marginBottom: 8,
  },
  appSubtitle: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
  },
  formContainer: {
    width: '100%',
  },
  input: {
    backgroundColor: '#f8f9fa',
    borderRadius: 4,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e9ecef',
    fontSize: 16,
    color: '#333333',
    height: 48,
  },
  verifyCodeContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  verifyCodeInput: {
    backgroundColor: '#f8f9fa',
    borderRadius: 4,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#e9ecef',
    fontSize: 16,
    color: '#333333',
    height: 48,
    flex: 1,
    marginRight: 12,
  },
  sendCodeButton: {
    backgroundColor: '#667eea',
    borderRadius: 4,
    paddingHorizontal: 16,
    paddingVertical: 12,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 100,
  },
  sendCodeButtonDisabled: {
    backgroundColor: '#cccccc',
  },
  sendCodeButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  sendCodeButtonTextDisabled: {
    color: '#999999',
  },
  registerButton: {
    backgroundColor: '#667eea',
    borderRadius: 4,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 24,
  },
  registerButtonDisabled: {
    backgroundColor: '#cccccc',
  },
  registerButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginText: {
    fontSize: 14,
    color: '#666666',
  },
  loginLink: {
    fontSize: 14,
    color: '#667eea',
    fontWeight: '600',
    marginLeft: 4,
  },
});

export default RegisterScreen; 