import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import SnakeGame from '../games/snake/components/SnakeGame';

const GameTestScreen = ({ navigation }) => {
  const [showGame, setShowGame] = useState(false);
  const [score, setScore] = useState(0);

  const handleGameClose = () => {
    setShowGame(false);
  };

  const handleScoreUpdate = (newScore) => {
    setScore(newScore);
    console.log('游戏得分更新:', newScore);
  };

  const startGame = () => {
    setShowGame(true);
  };

  const goBack = () => {
    navigation.goBack();
  };

  if (showGame) {
    return (
      <View style={styles.gameContainer}>
        <SnakeGame
          roomId="test_room_snake"
          onClose={handleGameClose}
          onScoreUpdate={handleScoreUpdate}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={goBack}>
          <Text style={styles.backButtonText}>← 返回</Text>
        </TouchableOpacity>
        <Text style={styles.title}>贪吃蛇游戏测试</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>🐍 贪吃蛇游戏</Text>
          <Text style={styles.infoText}>这是一个多人贪吃蛇游戏</Text>
          <Text style={styles.infoText}>• 使用方向键或WASD控制蛇的移动</Text>
          <Text style={styles.infoText}>• 蛇每150毫秒移动一次，不断吃食物</Text>
          <Text style={styles.infoText}>• 吃食物可以获得积分并增长蛇身</Text>
          <Text style={styles.infoText}>• 碰到墙或自己身体游戏结束</Text>
          <Text style={styles.infoText}>• 游戏开始前有3-2-1倒计时</Text>
          <Text style={styles.infoText}>• 只能上下左右移动，不能斜向移动</Text>
          <Text style={styles.fixedText}>✅ 已修复键盘控制问题</Text>
          <Text style={styles.fixedText}>✅ 已修复游戏响应问题</Text>
          <Text style={styles.fixedText}>✅ 已实现150ms移动间隔</Text>
          <Text style={styles.fixedText}>✅ 已添加3-2-1倒计时</Text>
          <Text style={styles.fixedText}>✅ 已修复边界碰撞检测</Text>
        </View>

        <View style={styles.scoreCard}>
          <Text style={styles.scoreTitle}>上次得分</Text>
          <Text style={styles.scoreValue}>{score}</Text>
        </View>

        <TouchableOpacity style={styles.startButton} onPress={startGame}>
          <Text style={styles.startButtonText}>开始游戏</Text>
        </TouchableOpacity>

        <View style={styles.controlsInfo}>
          <Text style={styles.controlsTitle}>游戏控制说明：</Text>
          <Text style={styles.controlsText}>键盘方向键：↑ ↓ ← →</Text>
          <Text style={styles.controlsText}>或使用 WASD 键</Text>
          <Text style={styles.controlsText}>游戏中点击方向按钮也可以控制</Text>
          <Text style={styles.tipText}>💡 游戏开始后请确保点击游戏区域以获得键盘焦点</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  gameContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  backButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#6c757d',
    borderRadius: 8,
    marginRight: 16,
  },
  backButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  content: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
  },
  infoCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    width: '100%',
    maxWidth: 400,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
    textAlign: 'center',
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    lineHeight: 20,
  },
  scoreCard: {
    backgroundColor: '#667EEA',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    alignItems: 'center',
    minWidth: 150,
  },
  scoreTitle: {
    fontSize: 16,
    color: 'white',
    marginBottom: 8,
  },
  scoreValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
  },
  startButton: {
    backgroundColor: '#2ED573',
    borderRadius: 25,
    paddingHorizontal: 40,
    paddingVertical: 16,
    marginBottom: 30,
  },
  startButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  controlsInfo: {
    backgroundColor: '#fff3cd',
    borderRadius: 8,
    padding: 16,
    width: '100%',
    maxWidth: 400,
    borderWidth: 1,
    borderColor: '#ffeaa7',
  },
  controlsTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#856404',
    marginBottom: 8,
  },
  controlsText: {
    fontSize: 12,
    color: '#856404',
    marginBottom: 4,
  },
  fixedText: {
    fontSize: 12,
    color: '#28a745',
    marginBottom: 4,
    fontWeight: '600',
  },
  tipText: {
    fontSize: 11,
    color: '#dc3545',
    marginTop: 8,
    fontStyle: 'italic',
  },
});

export default GameTestScreen;