// 工具相关的API接口

// 获取指定分类的工具列表
export async function fetchToolsByCategory(categoryId) {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const res = await fetch(`/api/v1/tools/category/${categoryId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${user.token}`
    }
  });
  
  if (!res.ok) {
    throw new Error('获取工具列表失败');
  }
  
  const result = await res.json();
  if (result.code !== 0) {
    throw new Error(result.message || '获取工具列表失败');
  }
  
  return result.data;
}

// 获取指定分组的工具列表
export async function fetchToolsByGroup(groupId) {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const res = await fetch(`/api/v1/tools/group/${groupId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${user.token}`
    }
  });
  
  if (!res.ok) {
    throw new Error('获取分组工具列表失败');
  }
  
  const result = await res.json();
  if (result.code !== 0) {
    throw new Error(result.message || '获取分组工具列表失败');
  }
  
  return result.data;
}

// 获取所有启用的工具列表
export async function fetchAllEnabledTools() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const res = await fetch('/api/v1/tools', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${user.token}`
    }
  });
  
  if (!res.ok) {
    throw new Error('获取工具列表失败');
  }
  
  const result = await res.json();
  if (result.code !== 0) {
    throw new Error(result.message || '获取工具列表失败');
  }
  
  return result.data;
}