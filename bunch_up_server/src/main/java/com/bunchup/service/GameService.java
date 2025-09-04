package com.bunchup.service;

import com.bunchup.dto.GameRoom;
import com.bunchup.dto.GamePlayer;

import java.util.List;

public interface GameService {
    
    /**
     * 加入游戏房间
     */
    GameRoom joinGame(String roomId, String gameType, Long groupId, Long userId, String playerName);
    
    /**
     * 离开游戏房间
     */
    void leaveGame(String roomId, Long userId);
    
    /**
     * 获取游戏房间信息
     */
    GameRoom getGameRoom(String roomId);
    
    /**
     * 开始游戏
     */
    void startGame(String roomId, Long userId);
    
    /**
     * 更新玩家得分
     */
    void updatePlayerScore(String roomId, Long userId, Integer score);
    
    /**
     * 更新玩家状态
     */
    void updatePlayerState(String roomId, Long userId, Object playerState);
    
    /**
     * 游戏结束
     */
    void endGame(String roomId, Long userId, Integer finalScore);
    
    /**
     * 获取房间内的玩家列表
     */
    List<GamePlayer> getRoomPlayers(String roomId);
    
    /**
     * 获取游戏排行榜
     */
    List<GamePlayer> getLeaderboard(String gameType, Integer limit);
}