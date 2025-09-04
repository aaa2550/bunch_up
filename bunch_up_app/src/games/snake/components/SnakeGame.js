import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import useWebSocket from '../../../hooks/useWebSocket';

const GRID_SIZE = 20;
const CANVAS_SIZE = 400;
const INITIAL_SNAKE = [{ x: 10, y: 10 }];
const INITIAL_DIRECTION = { x: 1, y: 0 }; // Start moving right

// 贪吃蛇游戏颜色
const COLORS = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', 
  '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F'
];

const SnakeGame = ({ roomId, onClose, onScoreUpdate }) => {
  const [gameState, setGameState] = useState({
    snakes: {},
    food: { x: 15, y: 15 },
    players: {},
    gameStatus: 'waiting', // waiting, countdown, playing, ended
    scores: {},
    countdown: 0 // Add countdown state
  });
  
  const [myPlayerId, setMyPlayerId] = useState(null);
  const [mySnake, setMySnake] = useState(INITIAL_SNAKE);
  const [direction, setDirection] = useState(INITIAL_DIRECTION);
  const [score, setScore] = useState(0);
  const gameLoopRef = useRef();
  const directionRef = useRef(INITIAL_DIRECTION);
  const subscriptionRef = useRef();
  const containerRef = useRef(); // 用于焦点管理

  // 当游戏开始时给组件焦点，确保键盘事件能被捕获
  useEffect(() => {
    if ((gameState.gameStatus === 'playing' || gameState.gameStatus === 'countdown') && containerRef.current && typeof window !== 'undefined') {
      // Delay focus to ensure DOM is ready
      setTimeout(() => {
        containerRef.current.focus();
        console.log('游戏开始，组件获得焦点');
      }, 100);
    }
  }, [gameState.gameStatus]);

  // WebSocket连接
  const { sendMessage, isConnected, subscribe } = useWebSocket('http://localhost:8080/ws');

  // Add keyboard event listener
  useEffect(() => {
    const handleKeyPress = (event) => {
      // Check if game is in playing state
      if (gameState.gameStatus !== 'playing') return;
      
      // Prevent default behavior (like page scrolling)
      event.preventDefault();
      
      let newDirection = null;
      
      switch (event.key) {
        case 'ArrowUp':
          newDirection = { x: 0, y: -1 };
          break;
        case 'ArrowDown':
          newDirection = { x: 0, y: 1 };
          break;
        case 'ArrowLeft':
          newDirection = { x: -1, y: 0 };
          break;
        case 'ArrowRight':
          newDirection = { x: 1, y: 0 };
          break;
        case 'w':
        case 'W':
          newDirection = { x: 0, y: -1 };
          break;
        case 's':
        case 'S':
          newDirection = { x: 0, y: 1 };
          break;
        case 'a':
        case 'A':
          newDirection = { x: -1, y: 0 };
          break;
        case 'd':
        case 'D':
          newDirection = { x: 1, y: 0 };
          break;
      }
      
      if (newDirection) {
        console.log('Key pressed:', event.key, 'New direction:', newDirection);
        changeDirection(newDirection);
      }
    };

    // Add keyboard listener for web environment
    if (typeof window !== 'undefined') {
      window.addEventListener('keydown', handleKeyPress, true);
      console.log('Keyboard listener added');
      return () => {
        window.removeEventListener('keydown', handleKeyPress, true);
        console.log('Keyboard listener removed');
      };
    }
  }, [gameState.gameStatus]); // Add gameState.gameStatus as dependency

  // 初始化游戏
  useEffect(() => {
    initializeGame();
    return () => {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
      }
      leaveGame();
    };
  }, []);

  const initializeGame = async () => {
    try {
      // 尝试获取用户信息，如果没有则使用默认值
      let user = {};
      try {
        user = JSON.parse(localStorage.getItem('user') || '{}');
      } catch (e) {
        console.warn('无法解析用户信息，使用默认值');
      }
      
      const playerId = user.id || `player_${Date.now()}`; // 生成临时ID如果用户未登录
      setMyPlayerId(playerId);

      // 设置默认玩家信息
      setGameState(prev => ({
        ...prev,
        players: { [playerId]: { name: user.nickname || `玩家${playerId.slice(-4)}` } }
      }));

      // 如果WebSocket已连接，则订阅游戏房间消息
      if (isConnected && subscribe) {
        subscriptionRef.current = subscribe(`/topic/game/${roomId}`, handleGameMessage);
        
        // 发送加入游戏消息
        sendMessage('/app/game.join', {
          type: 'GAME_JOIN',
          roomId: roomId,
          gameType: 'snake',
          playerId: playerId,
          playerName: user.nickname || `玩家${playerId.slice(-4)}`
        });
      } else {
        // WebSocket未连接时，设置为单机模式
        console.log('WebSocket未连接，启动单机模式');
      }
    } catch (error) {
      console.error('初始化游戏失败:', error);
      // 即使初始化失败，也设置一个默认的玩家ID
      const playerId = `player_${Date.now()}`;
      setMyPlayerId(playerId);
      setGameState(prev => ({
        ...prev,
        players: { [playerId]: { name: `玩家${playerId.slice(-4)}` } }
      }));
    }
  };

  const leaveGame = () => {
    if (myPlayerId && isConnected) {
      sendMessage('/app/game.leave', {
        type: 'GAME_LEAVE',
        roomId: roomId,
        playerId: myPlayerId
      });
    }
    if (subscriptionRef.current) {
      subscriptionRef.current.unsubscribe();
    }
  };

  // 处理WebSocket消息
  const handleGameMessage = (message) => {
    console.log('收到游戏消息:', message);
    
    if (message.type === 'GAME_UPDATE' && message.data) {
      const data = message.data;
      
      switch (data.type) {
        case 'PLAYER_JOINED':
          setGameState(prev => ({
            ...prev,
            players: { ...prev.players, [data.playerId]: { name: data.playerName } }
          }));
          break;
        case 'PLAYER_LEFT':
          setGameState(prev => {
            const newPlayers = { ...prev.players };
            delete newPlayers[data.playerId];
            const newSnakes = { ...prev.snakes };
            delete newSnakes[data.playerId];
            return { ...prev, players: newPlayers, snakes: newSnakes };
          });
          break;
        case 'GAME_STARTED':
          setGameState(prev => ({ ...prev, gameStatus: 'playing' }));
          startGameLoop();
          break;
        case 'PLAYER_MOVE':
          if (data.playerId !== myPlayerId) {
            setGameState(prev => ({
              ...prev,
              snakes: { ...prev.snakes, [data.playerId]: data.data }
            }));
          }
          break;
        case 'SCORE_UPDATE':
          setGameState(prev => ({
            ...prev,
            scores: { ...prev.scores, [data.playerId]: data.score }
          }));
          break;
        case 'PLAYER_GAME_OVER':
          if (data.playerId === myPlayerId) {
            setGameState(prev => ({ ...prev, gameStatus: 'ended' }));
            stopGameLoop();
            if (onScoreUpdate) {
              onScoreUpdate(data.finalScore || 0);
            }
          }
          break;
      }
    }
  };

  // 初始化WebSocket连接
  useEffect(() => {
    if (isConnected) {
      initializeGame();
    }
  }, [isConnected]);

  const startGameLoop = () => {
    // Clear any existing interval
    if (gameLoopRef.current) {
      clearInterval(gameLoopRef.current);
    }
    
    gameLoopRef.current = setInterval(() => {
      moveSnake();
    }, 150); // Changed to 150ms interval as requested
    console.log('Game loop started with 150ms interval');
  };

  const stopGameLoop = () => {
    if (gameLoopRef.current) {
      clearInterval(gameLoopRef.current);
      gameLoopRef.current = null;
    }
  };

  const moveSnake = useCallback(() => {
    setMySnake(currentSnake => {
      // Get current game state to check if game is still playing
      let shouldContinue = true;
      let currentStatus = '';
      setGameState(currentGameState => {
        currentStatus = currentGameState.gameStatus;
        if (currentGameState.gameStatus !== 'playing') {
          shouldContinue = false;
        }
        return currentGameState;
      });
      
      console.log('Move snake called. Game status:', currentStatus);
      
      if (!shouldContinue) {
        console.log('Not continuing move because game is not in playing state');
        return currentSnake;
      }

      const newSnake = [...currentSnake];
      const head = { ...newSnake[0] };
      
      // Move the head based on current direction
      head.x += directionRef.current.x;
      head.y += directionRef.current.y;
      
      console.log('Moving snake head to:', head, 'Direction:', directionRef.current);

      // Check boundary collision - ensure proper wall collision detection
      if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
        console.log('Game over: boundary collision at position', head);
        console.log('Grid boundaries: 0 to', GRID_SIZE - 1);
        handleGameOver('boundary_collision');
        return currentSnake;
      }

      // Check self collision
      if (newSnake.some(segment => segment.x === head.x && segment.y === head.y)) {
        console.log('Game over: self collision at position', head);
        handleGameOver('self_collision');
        return currentSnake;
      }

      // Add new head
      newSnake.unshift(head);

      // Check food collision and update game state accordingly
      let ateFood = false;
      setGameState(currentGameState => {
        if (head.x === currentGameState.food.x && head.y === currentGameState.food.y) {
          ateFood = true;
          console.log('Food eaten! Generating new food...');
          
          // Update score
          setScore(prevScore => {
            const newScore = prevScore + 10;
            console.log('Score updated:', newScore);
            
            // Send score update via WebSocket if connected
            if (isConnected && myPlayerId) {
              sendMessage('/app/game.score', {
                type: 'GAME_SCORE',
                roomId: roomId,
                playerId: myPlayerId,
                score: newScore
              });
            }
            return newScore;
          });
          
          // Generate new food position
          const newFood = generateNewFoodPosition(newSnake);
          console.log('New food position:', newFood);
          return { ...currentGameState, food: newFood };
        }
        return currentGameState;
      });

      // If no food was eaten, remove the tail
      if (!ateFood) {
        newSnake.pop();
      }

      // Send snake position update via WebSocket if connected
      if (isConnected && myPlayerId) {
        sendMessage('/app/game.move', {
          type: 'GAME_MOVE',
          roomId: roomId,
          playerId: myPlayerId,
          data: newSnake
        });
      }

      console.log('Snake moved successfully. New length:', newSnake.length);
      return newSnake;
    });
  }, [isConnected, myPlayerId, roomId]);

  const handleGameOver = useCallback((reason = 'unknown') => {
    console.log('Game Over triggered. Reason:', reason);
    setGameState(prev => ({ ...prev, gameStatus: 'ended' }));
    stopGameLoop();
    
    if (isConnected && myPlayerId) {
      sendMessage('/app/game.over', {
        type: 'GAME_OVER',
        roomId: roomId,
        playerId: myPlayerId,
        score: score
      });
    }
    
    if (onScoreUpdate) {
      onScoreUpdate(score);
    }
  }, [isConnected, myPlayerId, roomId, score, onScoreUpdate]);

  const changeDirection = useCallback((newDirection) => {
    // Ensure only 4-directional movement (up, down, left, right)
    const validDirections = [
      { x: 0, y: -1 }, // up
      { x: 0, y: 1 },  // down
      { x: -1, y: 0 }, // left
      { x: 1, y: 0 }   // right
    ];
    
    const isValidDirection = validDirections.some(dir => 
      dir.x === newDirection.x && dir.y === newDirection.y
    );
    
    if (!isValidDirection) {
      console.log('Invalid direction - only 4-directional movement allowed:', newDirection);
      return;
    }
    
    // Prevent reverse movement (can't go directly opposite to current direction)
    const current = directionRef.current;
    if (
      (newDirection.x === -current.x && newDirection.y === -current.y) ||
      (newDirection.x === 0 && newDirection.y === 0)
    ) {
      console.log('Invalid direction change - reverse movement blocked:', newDirection, 'Current:', current);
      return;
    }
    
    // Prevent changing direction to the same direction
    if (newDirection.x === current.x && newDirection.y === current.y) {
      console.log('Same direction - no change needed:', newDirection);
      return;
    }
    
    directionRef.current = newDirection;
    setDirection(newDirection);
    
    console.log('Direction changed successfully:', newDirection);
  }, []);

  // 生成新食物位置的纯函数
  const generateNewFoodPosition = (snake) => {
    let newFood;
    do {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE)
      };
    } while (snake.some(segment => segment.x === newFood.x && segment.y === newFood.y));
    
    return newFood;
  };

  const generateNewFood = () => {
    const newFood = generateNewFoodPosition(mySnake);
    setGameState(prev => ({ ...prev, food: newFood }));
  };

  const resetGame = () => {
    console.log('Resetting game...');
    
    // Stop any existing intervals
    if (gameLoopRef.current) {
      clearInterval(gameLoopRef.current);
      gameLoopRef.current = null;
    }
    
    // Reset all game state
    const initialSnake = [{ x: 10, y: 10 }];
    const initialDirection = { x: 1, y: 0 }; // Start moving right
    const initialFood = generateNewFoodPosition(initialSnake);
    
    setMySnake(initialSnake);
    setDirection(initialDirection);
    directionRef.current = initialDirection;
    setScore(0);
    setGameState(prev => ({
      ...prev,
      gameStatus: 'waiting',
      food: initialFood,
      snakes: {},
      scores: {},
      countdown: 0
    }));
    
    console.log('Game reset complete');
  };

  const startCountdown = () => {
    console.log('Starting countdown...');
    setGameState(prev => ({ ...prev, gameStatus: 'countdown', countdown: 3 }));
    
    let countdownValue = 3;
    const countdownInterval = setInterval(() => {
      countdownValue--;
      if (countdownValue > 0) {
        setGameState(prev => ({ ...prev, countdown: countdownValue }));
        console.log('Countdown:', countdownValue);
      } else {
        clearInterval(countdownInterval);
        console.log('Countdown finished, starting game!');
        actuallyStartGame();
      }
    }, 1000); // 1 second intervals for countdown
    
    // Store interval ID to clear if needed
    gameLoopRef.current = countdownInterval;
  };
  
  const actuallyStartGame = () => {
    console.log('Actually starting game now...');
    
    // Reset game state
    const initialSnake = [{ x: 10, y: 10 }];
    const initialDirection = { x: 1, y: 0 }; // Start moving right
    const initialFood = generateNewFoodPosition(initialSnake);
    
    setMySnake(initialSnake);
    setDirection(initialDirection);
    directionRef.current = initialDirection;
    setScore(0);
    
    // Set game state to playing
    setGameState(prev => ({ 
      ...prev, 
      gameStatus: 'playing',
      food: initialFood,
      countdown: 0
    }));
    
    console.log('Game state set to playing. Initial food position:', initialFood);
    
    // Start the game loop
    startGameLoop();
    
    // Send WebSocket message if connected
    if (isConnected && myPlayerId) {
      sendMessage('/app/game.start', {
        type: 'GAME_START',
        roomId: roomId,
        playerId: myPlayerId
      });
    }
  };

  const startGame = () => {
    console.log('Start game button clicked');
    
    // Stop any existing game loop
    if (gameLoopRef.current) {
      clearInterval(gameLoopRef.current);
      gameLoopRef.current = null;
    }
    
    // Start countdown instead of immediately starting the game
    startCountdown();
  };

  const renderGame = () => {
    const grid = [];
    
    // 创建游戏网格
    for (let row = 0; row < GRID_SIZE; row++) {
      for (let col = 0; col < GRID_SIZE; col++) {
        let cellType = 'empty';
        let color = '#F0F0F0';

        // 检查食物
        if (gameState.food.x === col && gameState.food.y === row) {
          cellType = 'food';
          color = '#FF4757';
        }

        // 检查我的蛇
        if (mySnake.some(segment => segment.x === col && segment.y === row)) {
          cellType = 'mySnake';
          color = '#2ED573';
        }

        // 检查其他玩家的蛇
        Object.entries(gameState.snakes).forEach(([playerId, snake], index) => {
          if (playerId !== myPlayerId && snake.some(segment => segment.x === col && segment.y === row)) {
            cellType = 'otherSnake';
            color = COLORS[index % COLORS.length];
          }
        });

        grid.push(
          <View
            key={`${row}-${col}`}
            style={[
              styles.cell,
              { backgroundColor: color }
            ]}
          />
        );
      }
    }

    return grid;
  };

  return (
    <View 
      ref={containerRef}
      style={styles.container}
      // 为Web环境添加tabIndex使其可以获得焦点
      {...(typeof window !== 'undefined' ? { tabIndex: 0 } : {})}
      onFocus={() => console.log('游戏组件获得焦点')}
    >
      <View style={styles.header}>
        <Text style={styles.title}>多人贪吃蛇</Text>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Text style={styles.closeText}>×</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.gameInfo}>
        <Text style={styles.score}>积分: {score}</Text>
        <Text style={styles.players}>玩家: {Object.keys(gameState.players).length}</Text>
        <Text style={styles.status}>
          状态: {
            gameState.gameStatus === 'waiting' ? '等待开始' :
            gameState.gameStatus === 'playing' ? '游戏中' : '游戏结束'
          }
        </Text>
      </View>
      
      {gameState.gameStatus === 'countdown' && (
        <View style={styles.countdownDisplay}>
          <Text style={styles.countdownText}>{gameState.countdown}</Text>
          <Text style={styles.countdownLabel}>准备开始...</Text>
        </View>
      )}
      
      {gameState.gameStatus === 'playing' && (
        <View style={styles.instructions}>
          <Text style={styles.instructionText}>使用方向键或WASD控制蛇的移动</Text>
          <Text style={styles.debugText}>
            蛇长度: {mySnake.length} | 当前方向: {direction.x === 0 && direction.y === -1 ? '上' : 
                      direction.x === 0 && direction.y === 1 ? '下' : 
                      direction.x === -1 && direction.y === 0 ? '左' : 
                      direction.x === 1 && direction.y === 0 ? '右' : '等待'}
          </Text>
          <Text style={styles.debugText}>
            移动间隔: 150ms | 食物位置: ({gameState.food.x}, {gameState.food.y})
          </Text>
        </View>
      )}

      <View style={styles.gameCanvas}>
        {renderGame()}
        
        {gameState.gameStatus === 'countdown' && (
          <View style={styles.countdownOverlay}>
            <View style={styles.countdownContent}>
              <Text style={styles.countdownText}>{gameState.countdown}</Text>
              <Text style={styles.countdownLabel}>准备开始...</Text>
            </View>
          </View>
        )}
      </View>

      <View style={styles.controls}>
        {gameState.gameStatus === 'waiting' && (
          <TouchableOpacity style={styles.startButton} onPress={startGame}>
            <Text style={styles.buttonText}>开始游戏</Text>
          </TouchableOpacity>
        )}

        {gameState.gameStatus === 'playing' && (
          <View style={styles.directionPad}>
            <TouchableOpacity
              style={styles.directionButton}
              onPress={() => changeDirection({ x: 0, y: -1 })}
            >
              <Text style={styles.directionText}>↑</Text>
            </TouchableOpacity>
            <View style={styles.horizontalButtons}>
              <TouchableOpacity
                style={styles.directionButton}
                onPress={() => changeDirection({ x: -1, y: 0 })}
              >
                <Text style={styles.directionText}>←</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.directionButton}
                onPress={() => changeDirection({ x: 1, y: 0 })}
              >
                <Text style={styles.directionText}>→</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={styles.directionButton}
              onPress={() => changeDirection({ x: 0, y: 1 })}
            >
              <Text style={styles.directionText}>↓</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {gameState.gameStatus === 'ended' && (
        <View style={styles.gameOver}>
          <Text style={styles.gameOverText}>游戏结束</Text>
          <Text style={styles.finalScore}>最终得分: {score}</Text>
          <TouchableOpacity style={styles.restartButton} onPress={resetGame}>
            <Text style={styles.buttonText}>重新开始</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    width: '90%',
    maxWidth: 500,
    maxHeight: '90%',
    // 为Web添加焦点样式
    ...(typeof window !== 'undefined' ? {
      outline: 'none', // 移除默认焦点边框
      cursor: 'default',
    } : {}),
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#FF6B6B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  gameInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  score: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2ED573',
  },
  players: {
    fontSize: 14,
    fontWeight: '600',
    color: '#5352ED',
  },
  status: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FF4757',
  },
  gameCanvas: {
    width: CANVAS_SIZE,
    height: CANVAS_SIZE,
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    padding: 4,
    alignSelf: 'center',
    marginBottom: 16,
  },
  cell: {
    width: CANVAS_SIZE / GRID_SIZE - 1,
    height: CANVAS_SIZE / GRID_SIZE - 1,
    margin: 0.5,
    borderRadius: 1,
  },
  controls: {
    alignItems: 'center',
  },
  startButton: {
    backgroundColor: '#2ED573',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 25,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  directionPad: {
    alignItems: 'center',
  },
  directionButton: {
    width: 50,
    height: 50,
    backgroundColor: '#667EEA',
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 5,
  },
  horizontalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 120,
  },
  directionText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  gameOver: {
    alignItems: 'center',
    marginTop: 16,
  },
  gameOverText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF4757',
    marginBottom: 8,
  },
  finalScore: {
    fontSize: 16,
    color: '#333',
    marginBottom: 12,
  },
  restartButton: {
    backgroundColor: '#5352ED',
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 20,
  },
  instructions: {
    alignItems: 'center',
    marginBottom: 12,
  },
  instructionText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  debugText: {
    fontSize: 10,
    color: '#999',
    textAlign: 'center',
    marginTop: 4,
  },
  countdownDisplay: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
  },
  countdownOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },
  countdownContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  countdownText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#FF6B6B',
    textAlign: 'center',
  },
  countdownLabel: {
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'center',
    marginTop: 8,
  },
});

export default SnakeGame;