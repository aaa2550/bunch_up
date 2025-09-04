package com.bunchup.controller;

import com.alibaba.fastjson2.JSON;
import com.bunchup.dto.GameMessage;
import com.bunchup.dto.GameRoom;
import com.bunchup.dto.WebSocketMessage;
import com.bunchup.service.GameService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.util.HashMap;
import java.util.Map;

@Controller
public class GameWebSocketController {

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @Autowired
    private GameService gameService;

    @MessageMapping("/game.join")
    public void joinGame(@Payload String message, SimpMessageHeaderAccessor headerAccessor) {
        try {
            GameMessage gameMessage = JSON.parseObject(message, GameMessage.class);
            
            // 解析roomId获取groupId (格式: groupId_gameType)
            String[] parts = gameMessage.getRoomId().split("_");
            Long groupId = Long.parseLong(parts[0]);
            
            // 加入游戏房间
            GameRoom gameRoom = gameService.joinGame(
                gameMessage.getRoomId(),
                gameMessage.getGameType(),
                groupId,
                gameMessage.getPlayerId(),
                gameMessage.getPlayerName()
            );

            // 广播玩家加入消息
            String destination = "/topic/game/" + gameMessage.getRoomId();
            Map<String, Object> response = new HashMap<>();
            response.put("type", "PLAYER_JOINED");
            response.put("playerId", gameMessage.getPlayerId());
            response.put("playerName", gameMessage.getPlayerName());
            response.put("gameRoom", gameRoom);
            
            messagingTemplate.convertAndSend(destination, new WebSocketMessage("GAME_UPDATE", response));
            
        } catch (Exception e) {
            System.err.println("处理加入游戏消息失败: " + e.getMessage());
        }
    }

    @MessageMapping("/game.leave")
    public void leaveGame(@Payload String message, SimpMessageHeaderAccessor headerAccessor) {
        try {
            GameMessage gameMessage = JSON.parseObject(message, GameMessage.class);
            
            // 离开游戏房间
            gameService.leaveGame(gameMessage.getRoomId(), gameMessage.getPlayerId());

            // 广播玩家离开消息
            String destination = "/topic/game/" + gameMessage.getRoomId();
            Map<String, Object> response = new HashMap<>();
            response.put("type", "PLAYER_LEFT");
            response.put("playerId", gameMessage.getPlayerId());
            
            messagingTemplate.convertAndSend(destination, new WebSocketMessage("GAME_UPDATE", response));
            
        } catch (Exception e) {
            System.err.println("处理离开游戏消息失败: " + e.getMessage());
        }
    }

    @MessageMapping("/game.start")
    public void startGame(@Payload String message, SimpMessageHeaderAccessor headerAccessor) {
        try {
            GameMessage gameMessage = JSON.parseObject(message, GameMessage.class);
            
            // 开始游戏
            gameService.startGame(gameMessage.getRoomId(), gameMessage.getPlayerId());

            // 广播游戏开始消息
            String destination = "/topic/game/" + gameMessage.getRoomId();
            Map<String, Object> response = new HashMap<>();
            response.put("type", "GAME_STARTED");
            response.put("roomId", gameMessage.getRoomId());
            
            messagingTemplate.convertAndSend(destination, new WebSocketMessage("GAME_UPDATE", response));
            
        } catch (Exception e) {
            System.err.println("处理开始游戏消息失败: " + e.getMessage());
        }
    }

    @MessageMapping("/game.move")
    public void updatePlayerMove(@Payload String message, SimpMessageHeaderAccessor headerAccessor) {
        try {
            GameMessage gameMessage = JSON.parseObject(message, GameMessage.class);
            
            // 更新玩家状态（如蛇的位置）
            gameService.updatePlayerState(gameMessage.getRoomId(), gameMessage.getPlayerId(), gameMessage.getData());

            // 广播玩家移动消息
            String destination = "/topic/game/" + gameMessage.getRoomId();
            Map<String, Object> response = new HashMap<>();
            response.put("type", "PLAYER_MOVE");
            response.put("playerId", gameMessage.getPlayerId());
            response.put("data", gameMessage.getData());
            
            messagingTemplate.convertAndSend(destination, new WebSocketMessage("GAME_UPDATE", response));
            
        } catch (Exception e) {
            System.err.println("处理玩家移动消息失败: " + e.getMessage());
        }
    }

    @MessageMapping("/game.score")
    public void updateScore(@Payload String message, SimpMessageHeaderAccessor headerAccessor) {
        try {
            GameMessage gameMessage = JSON.parseObject(message, GameMessage.class);
            
            // 更新玩家得分
            gameService.updatePlayerScore(gameMessage.getRoomId(), gameMessage.getPlayerId(), gameMessage.getScore());

            // 广播得分更新消息
            String destination = "/topic/game/" + gameMessage.getRoomId();
            Map<String, Object> response = new HashMap<>();
            response.put("type", "SCORE_UPDATE");
            response.put("playerId", gameMessage.getPlayerId());
            response.put("score", gameMessage.getScore());
            
            messagingTemplate.convertAndSend(destination, new WebSocketMessage("GAME_UPDATE", response));
            
        } catch (Exception e) {
            System.err.println("处理得分更新消息失败: " + e.getMessage());
        }
    }

    @MessageMapping("/game.over")
    public void gameOver(@Payload String message, SimpMessageHeaderAccessor headerAccessor) {
        try {
            GameMessage gameMessage = JSON.parseObject(message, GameMessage.class);
            
            // 处理游戏结束
            gameService.endGame(gameMessage.getRoomId(), gameMessage.getPlayerId(), gameMessage.getScore());

            // 广播游戏结束消息
            String destination = "/topic/game/" + gameMessage.getRoomId();
            Map<String, Object> response = new HashMap<>();
            response.put("type", "PLAYER_GAME_OVER");
            response.put("playerId", gameMessage.getPlayerId());
            response.put("finalScore", gameMessage.getScore());
            
            messagingTemplate.convertAndSend(destination, new WebSocketMessage("GAME_UPDATE", response));
            
        } catch (Exception e) {
            System.err.println("处理游戏结束消息失败: " + e.getMessage());
        }
    }
}