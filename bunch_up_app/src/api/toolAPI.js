// 工具API
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/v1';

// 根据分类获取工具列表（支持全局和分类）
export async function fetchToolsByCategory(categoryId) {
  const res = await axios.get(`${API_BASE_URL}/tools`, {
    params: { categoryId }
  });
  if (res.data.code !== 0) throw new Error(res.data.message || '获取工具失败');
  return res.data.data;
}

// 根据分组获取工具列表（支持全局和分组）
export async function fetchToolsByGroup(groupId) {
  const res = await axios.get(`${API_BASE_URL}/tools/group`, {
    params: { groupId }
  });
  if (res.data.code !== 0) throw new Error(res.data.message || '获取工具失败');
  return res.data.data;
}

// 为了兼容性，保留原来的函数名
export const fetchAITools = fetchToolsByCategory;
