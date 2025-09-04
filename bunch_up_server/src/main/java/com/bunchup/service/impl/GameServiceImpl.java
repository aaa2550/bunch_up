package com.bunchup.service.impl;

import com.bunchup.dto.GameRoom;
import com.bunchup.dto.GamePlayer;
import com.bunchup.entity.GameRoomDO;
import com.bunchup.entity.GamePlayerDO;
import com.bunchup.mapper.GameRoomMapper;
import com.bunchup.mapper.GamePlayerMapper;
import com.bunchup.service.GameService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class GameServiceImpl implements GameService {
    
    @Autowired
    private GameRoomMapper gameRoomMapper;
    
    @Autowired
    private GamePlayerMapper gamePlayerMapper;
    
    @Autowired
    private ObjectMapper objectMapper;

    @Override
    @Transactional
    public GameRoom joinGame(String roomId, String gameType, Long groupId, Long userId, String playerName) {
        // 检查是否已存在房间
        GameRoomDO roomDO = gameRoomMapper.selectByRoomId(roomId);
        
        if (roomDO == null) {
            // 创建新房间
            roomDO = new GameRoomDO();
            roomDO.setRoomId(roomId);
            roomDO.setGameType(gameType);
            roomDO.setGroupId(groupId);
            roomDO.setStatus("waiting");
            roomDO.setMaxPlayers(gameType.equals("snake") ? 8 : 4); // 贪吃蛇最多8人
            roomDO.setCurrentPlayers(0);
            roomDO.setCreateTime(new Date());
            roomDO.setUpdateTime(new Date());
            gameRoomMapper.insert(roomDO);
        }
        
        // 检查玩家是否已在房间中
        GamePlayerDO existingPlayer = gamePlayerMapper.selectByRoomAndUser(roomId, userId);
        if (existingPlayer == null) {
            // 添加新玩家
            GamePlayerDO playerDO = new GamePlayerDO();
            playerDO.setRoomId(roomId);
            playerDO.setUserId(userId);
            playerDO.setPlayerName(playerName);
            playerDO.setScore(0);
            playerDO.setStatus("playing");
            playerDO.setJoinTime(new Date());
            playerDO.setUpdateTime(new Date());
            gamePlayerMapper.insert(playerDO);
            
            // 更新房间玩家数量
            Integer activeCount = gamePlayerMapper.countActivePlayersByRoom(roomId);
            roomDO.setCurrentPlayers(activeCount);
            roomDO.setUpdateTime(new Date());
            gameRoomMapper.update(roomDO);
        } else {
            // 重新激活玩家
            existingPlayer.setStatus("playing");
            existingPlayer.setUpdateTime(new Date());
            gamePlayerMapper.update(existingPlayer);
        }
        
        return convertToGameRoom(roomDO);
    }

    @Override
    @Transactional
    public void leaveGame(String roomId, Long userId) {
        GamePlayerDO playerDO = gamePlayerMapper.selectByRoomAndUser(roomId, userId);
        if (playerDO != null) {
            playerDO.setStatus("disconnected");
            playerDO.setUpdateTime(new Date());
            gamePlayerMapper.update(playerDO);
            
            // 更新房间玩家数量
            GameRoomDO roomDO = gameRoomMapper.selectByRoomId(roomId);
            if (roomDO != null) {
                Integer activeCount = gamePlayerMapper.countActivePlayersByRoom(roomId);
                roomDO.setCurrentPlayers(activeCount);
                roomDO.setUpdateTime(new Date());
                gameRoomMapper.update(roomDO);
            }
        }
    }

    @Override
    public GameRoom getGameRoom(String roomId) {
        GameRoomDO roomDO = gameRoomMapper.selectByRoomId(roomId);
        return roomDO != null ? convertToGameRoom(roomDO) : null;
    }

    @Override
    @Transactional
    public void startGame(String roomId, Long userId) {
        GameRoomDO roomDO = gameRoomMapper.selectByRoomId(roomId);
        if (roomDO != null && "waiting".equals(roomDO.getStatus())) {
            roomDO.setStatus("playing");
            roomDO.setUpdateTime(new Date());
            gameRoomMapper.update(roomDO);
        }
    }

    @Override
    @Transactional
    public void updatePlayerScore(String roomId, Long userId, Integer score) {
        GamePlayerDO playerDO = gamePlayerMapper.selectByRoomAndUser(roomId, userId);
        if (playerDO != null) {
            playerDO.setScore(score);
            playerDO.setUpdateTime(new Date());
            gamePlayerMapper.update(playerDO);
        }
    }

    @Override
    @Transactional
    public void updatePlayerState(String roomId, Long userId, Object playerState) {
        GamePlayerDO playerDO = gamePlayerMapper.selectByRoomAndUser(roomId, userId);
        if (playerDO != null) {
            try {
                String stateJson = objectMapper.writeValueAsString(playerState);
                playerDO.setPlayerState(stateJson);
                playerDO.setUpdateTime(new Date());
                gamePlayerMapper.update(playerDO);
            } catch (Exception e) {
                throw new RuntimeException("Failed to update player state", e);
            }
        }
    }

    @Override
    @Transactional
    public void endGame(String roomId, Long userId, Integer finalScore) {
        GamePlayerDO playerDO = gamePlayerMapper.selectByRoomAndUser(roomId, userId);
        if (playerDO != null) {
            playerDO.setScore(finalScore);
            playerDO.setStatus("game_over");
            playerDO.setUpdateTime(new Date());
            gamePlayerMapper.update(playerDO);
        }
        
        // 检查是否所有玩家都结束游戏
        List<GamePlayerDO> activePlayers = gamePlayerMapper.selectByRoomId(roomId)
            .stream()
            .filter(p -> "playing".equals(p.getStatus()))
            .collect(Collectors.toList());
        
        if (activePlayers.isEmpty()) {
            // 所有玩家都结束游戏，关闭房间
            GameRoomDO roomDO = gameRoomMapper.selectByRoomId(roomId);
            if (roomDO != null) {
                roomDO.setStatus("ended");
                roomDO.setUpdateTime(new Date());
                gameRoomMapper.update(roomDO);
            }
        }
    }

    @Override
    public List<GamePlayer> getRoomPlayers(String roomId) {
        List<GamePlayerDO> playerDOs = gamePlayerMapper.selectByRoomId(roomId);
        return playerDOs.stream()
            .map(this::convertToGamePlayer)
            .collect(Collectors.toList());
    }

    @Override
    public List<GamePlayer> getLeaderboard(String gameType, Integer limit) {
        // 这里可以根据游戏类型和时间范围查询排行榜
        // 暂时返回空列表，可以后续扩展
        return List.of();
    }

    private GameRoom convertToGameRoom(GameRoomDO roomDO) {
        GameRoom gameRoom = new GameRoom();
        gameRoom.setId(roomDO.getId());
        gameRoom.setRoomId(roomDO.getRoomId());
        gameRoom.setGameType(roomDO.getGameType());
        gameRoom.setGroupId(roomDO.getGroupId());
        gameRoom.setStatus(roomDO.getStatus());
        gameRoom.setMaxPlayers(roomDO.getMaxPlayers());
        gameRoom.setCurrentPlayers(roomDO.getCurrentPlayers());
        gameRoom.setCreateTime(roomDO.getCreateTime());
        gameRoom.setUpdateTime(roomDO.getUpdateTime());
        
        // 获取玩家列表
        List<GamePlayer> players = getRoomPlayers(roomDO.getRoomId());
        gameRoom.setPlayers(players);
        
        return gameRoom;
    }

    private GamePlayer convertToGamePlayer(GamePlayerDO playerDO) {
        GamePlayer gamePlayer = new GamePlayer();
        gamePlayer.setId(playerDO.getId());
        gamePlayer.setRoomId(playerDO.getRoomId());
        gamePlayer.setUserId(playerDO.getUserId());
        gamePlayer.setPlayerName(playerDO.getPlayerName());
        gamePlayer.setScore(playerDO.getScore());
        gamePlayer.setStatus(playerDO.getStatus());
        gamePlayer.setJoinTime(playerDO.getJoinTime());
        gamePlayer.setUpdateTime(playerDO.getUpdateTime());
        
        // 解析玩家状态
        if (playerDO.getPlayerState() != null) {
            try {
                Object playerState = objectMapper.readValue(playerDO.getPlayerState(), Object.class);
                gamePlayer.setPlayerState(playerState);
            } catch (Exception e) {
                // 忽略解析错误
            }
        }
        
        return gamePlayer;
    }
}