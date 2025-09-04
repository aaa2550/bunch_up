import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import SnakeGame from '../games/snake/components/SnakeGame';
import { joinGame, leaveGame } from '../api/gameAPI';

const GameToolBar = ({ groupId, groupName, onPointsEarned }) => {
  const [currentGame, setCurrentGame] = useState(null);
  const [gameModalVisible, setGameModalVisible] = useState(false);
  const [gameRoom, setGameRoom] = useState(null);
  const [loading, setLoading] = useState(false);

  // 支持的游戏类型
  const games = [
    {
      id: 'snake',
      name: '贪吃蛇',
      icon: '🐍',
      description: '与同组用户一起玩贪吃蛇',
      pointsPerScore: 1,
    },
    // 未来可以添加更多游戏
  ];

  const openGame = async (gameType) => {
    setLoading(true);
    try {
      // 生成房间ID（基于分组ID）
      const roomId = `${groupId}_${gameType}`;
      
      try {
        // 尝试加入游戏房间
        const roomData = await joinGame(roomId, gameType);
        setGameRoom(roomData);
      } catch (error) {
        console.warn('无法连接到游戏服务器，启动本地模式:', error);
        // 即使后端不可用，也设置一个默认的房间数据
        setGameRoom({ id: roomId, roomId: roomId, gameType: gameType, status: 'local' });
      }
      
      setCurrentGame(gameType);
      setGameModalVisible(true);
    } catch (error) {
      console.error('打开游戏失败:', error);
      // 不显示错误，直接启动本地模式
      const roomId = `${groupId}_${gameType}`;
      setGameRoom({ id: roomId, roomId: roomId, gameType: gameType, status: 'local' });
      setCurrentGame(gameType);
      setGameModalVisible(true);
    } finally {
      setLoading(false);
    }
  };

  const closeGame = async () => {
    if (gameRoom && gameRoom.status !== 'local') {
      try {
        await leaveGame(gameRoom.roomId || gameRoom.id);
      } catch (error) {
        console.error('离开游戏失败:', error);
      }
    }
    
    setGameModalVisible(false);
    setCurrentGame(null);
    setGameRoom(null);
  };

  const handleScoreUpdate = (score) => {
    // 根据得分计算积分
    const game = games.find(g => g.id === currentGame);
    if (game && onPointsEarned) {
      const points = score * game.pointsPerScore;
      onPointsEarned(points);
    }
  };

  const renderGameItem = (game) => (
    <TouchableOpacity
      key={game.id}
      style={styles.gameItem}
      onPress={() => openGame(game.id)}
      disabled={loading}
    >
      <Text style={styles.gameIcon}>{game.icon}</Text>
      <View style={styles.gameInfo}>
        <Text style={styles.gameName}>{game.name}</Text>
        <Text style={styles.gameDesc}>{game.description}</Text>
        <Text style={styles.groupHint}>当前分组：{groupName}</Text>
      </View>
      <View style={styles.playButton}>
        <Text style={styles.playButtonText}>开始</Text>
      </View>
    </TouchableOpacity>
  );

  const renderCurrentGame = () => {
    if (!currentGame || !gameRoom) return null;

    switch (currentGame) {
      case 'snake':
        return (
          <SnakeGame
            roomId={gameRoom.roomId || gameRoom.id}
            onClose={closeGame}
            onScoreUpdate={handleScoreUpdate}
          />
        );
      default:
        return null;
    }
  };

  if (!groupId) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>🎮 多人游戏</Text>
          <Text style={styles.subtitle}>请先选择一个分组</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>🎮 多人游戏</Text>
        <Text style={styles.subtitle}>与同组用户一起游戏赚积分</Text>
      </View>

      <View style={styles.gamesList}>
        {games.map(renderGameItem)}
      </View>

      <Modal
        visible={gameModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={closeGame}
      >
        <View style={styles.modalOverlay}>
          {renderCurrentGame()}
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 260,
    backgroundColor: '#f8f9fa',
    borderLeftWidth: 1,
    borderLeftColor: '#e9ecef',
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
    padding: 10,
  },
  header: {
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 12,
    color: '#666',
  },
  gamesList: {
    gap: 8,
  },
  gameItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  gameIcon: {
    fontSize: 20,
    marginRight: 10,
  },
  gameInfo: {
    flex: 1,
  },
  gameName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  gameDesc: {
    fontSize: 11,
    color: '#666',
    marginBottom: 2,
  },
  groupHint: {
    fontSize: 10,
    color: '#FF6B6B',
    fontStyle: 'italic',
  },
  playButton: {
    backgroundColor: '#667EEA',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  playButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default GameToolBar;