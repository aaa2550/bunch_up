// 游戏API
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/v1';

// 加入游戏房间
export async function joinGame(roomId, gameType = 'snake') {
  const res = await axios.post(`${API_BASE_URL}/game/join`, {
    roomId,
    gameType
  });
  if (res.data.code !== 0) throw new Error(res.data.message || '加入游戏失败');
  return res.data.data;
}

// 离开游戏房间
export async function leaveGame(roomId) {
  const res = await axios.post(`${API_BASE_URL}/game/leave`, {
    roomId
  });
  if (res.data.code !== 0) throw new Error(res.data.message || '离开游戏失败');
  return res.data.data;
}

// 获取游戏房间信息
export async function getGameRoom(roomId) {
  const res = await axios.get(`${API_BASE_URL}/game/room/${roomId}`);
  if (res.data.code !== 0) throw new Error(res.data.message || '获取游戏房间失败');
  return res.data.data;
}

// 获取游戏排行榜
export async function getGameLeaderboard(gameType = 'snake', limit = 10) {
  const res = await axios.get(`${API_BASE_URL}/game/leaderboard`, {
    params: { gameType, limit }
  });
  if (res.data.code !== 0) throw new Error(res.data.message || '获取排行榜失败');
  return res.data.data;
}