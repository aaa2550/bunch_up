// 获取分组列表
export async function fetchGroupsByCategory(categoryId) {
  const res = await fetch(`/api/v1/groups/category/${categoryId}`);
  if (!res.ok) throw new Error('获取分组失败');
  const result = await res.json();
  if (result.code !== 0) throw new Error(result.message || '获取分组失败');
  return result.data;
}

export async function fetchMessagesByGroup(groupId, limit = 50) {
  const res = await fetch(`/chat/messages/${groupId}?limit=${limit}`);
  if (!res.ok) throw new Error('获取消息失败');
  const result = await res.json();
  if (result.code !== 0) throw new Error(result.message || '获取消息失败');
  return result.data;
}