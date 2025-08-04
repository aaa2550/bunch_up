import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/v1';

// 创建axios实例
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器
api.interceptors.request.use(
  (config) => {
    // 从本地存储获取token（Web环境）
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// 响应拦截器
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token过期，清除本地存储并跳转到登录页（Web环境）
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        // 这里可以添加导航到登录页的逻辑
      }
    }
    return Promise.reject(error);
  },
);

export const authAPI = {
  // 用户注册
  register: (phone, password, verifyCode) => {
    return api.post('/auth/register', {
      phone,
      password,
      verifyCode,
    });
  },

  // 用户登录
  login: (phone, password) => {
    return api.post('/auth/login', {
      phone,
      password,
    });
  },

  // 验证码登录
  loginByVerifyCode: (phone, verifyCode) => {
    return api.post('/auth/loginByVerifyCode', {
      phone,
      verifyCode,
    });
  },

  // 发送验证码
  sendVerifyCode: (phone, type) => {
    return api.post('/auth/sendVerifyCode', {
      phone,
      type,
    });
  },
}; 