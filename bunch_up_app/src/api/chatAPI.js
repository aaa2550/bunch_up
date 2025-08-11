// 获取分组列表
export async function fetchGroupsByCategory(categoryId) {
  const res = await fetch(`/api/v1/groups/category/${categoryId}`);
  if (!res.ok) throw new Error('获取分组失败');
  const result = await res.json();
  if (result.code !== 0) throw new Error(result.message || '获取分组失败');
  return result.data;
}

// 获取群组消息
export async function fetchMessagesByGroup(groupId, limit = 200) {
  const res = await fetch(`/api/v1/chat/group/${groupId}/messages?limit=${limit}`);
  if (!res.ok) throw new Error('获取消息失败');
  const result = await res.json();
  if (result.code !== 0) throw new Error(result.message || '获取消息失败');
  return result.data;
}

// 获取群组在线人数
export async function fetchGroupOnlineCount(groupId) {
  const res = await fetch(`/api/v1/groups/${groupId}/online-count`);
  if (!res.ok) throw new Error('获取在线人数失败');
  const result = await res.json();
  if (result.code !== 0) throw new Error(result.message || '获取在线人数失败');
  return result.data;
}