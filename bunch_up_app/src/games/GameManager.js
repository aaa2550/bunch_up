import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import SnakeGame from './snake/components/SnakeGame';
import { joinGame, leaveGame, getGameRoom } from '../api/gameAPI';

const GameManager = ({ groupId, onPointsEarned }) => {
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
      description: '多人贪吃蛇，获得积分',
      pointsPerScore: 1, // 每得1分获得1积分
    },
    // 可以在这里添加更多游戏
    // {
    //   id: 'tetris',
    //   name: '俄罗斯方块',
    //   icon: '🧩',
    //   description: '经典俄罗斯方块',
    //   pointsPerScore: 2,
    // }
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
        setGameRoom({ id: roomId, gameType: gameType, status: 'local' });
      }
      
      setCurrentGame(gameType);
      setGameModalVisible(true);
    } catch (error) {
      console.error('打开游戏失败:', error);
      // 不显示错误，直接启动本地模式
      const roomId = `${groupId}_${gameType}`;
      setGameRoom({ id: roomId, gameType: gameType, status: 'local' });
      setCurrentGame(gameType);
      setGameModalVisible(true);
    } finally {
      setLoading(false);
    }
  };

  const closeGame = async () => {
    if (gameRoom && gameRoom.status !== 'local') {
      try {
        await leaveGame(gameRoom.id);
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
      </View>
      <View style={styles.playButton}>
        <Text style={styles.playButtonText}>玩</Text>
      </View>
    </TouchableOpacity>
  );

  const renderCurrentGame = () => {
    if (!currentGame || !gameRoom) return null;

    switch (currentGame) {
      case 'snake':
        return (
          <SnakeGame
            roomId={gameRoom.id}
            onClose={closeGame}
            onScoreUpdate={handleScoreUpdate}
          />
        );
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>🎮 游戏换积分</Text>
        <Text style={styles.subtitle}>玩游戏赚取积分，兑换更多功能</Text>
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
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 16,
    margin: 8,
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
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
    padding: 12,
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  gameIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  gameInfo: {
    flex: 1,
  },
  gameName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  gameDesc: {
    fontSize: 12,
    color: '#666',
  },
  playButton: {
    backgroundColor: '#667EEA',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  playButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default GameManager;