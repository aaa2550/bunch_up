// AI工具API
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/v1';

// 获取AI工具列表（支持全局和分类）
export async function fetchAITools(categoryId) {
  const res = await axios.get(`${API_BASE_URL}/tools`, {
    params: { categoryId }
  });
  if (res.data.code !== 0) throw new Error(res.data.message || '获取AI工具失败');
  return res.data.data;
}
