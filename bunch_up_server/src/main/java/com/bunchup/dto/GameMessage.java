package com.bunchup.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
@Schema(description = "游戏WebSocket消息DTO")
public class GameMessage {
    private String type; // 消息类型：GAME_JOIN, GAME_LEAVE, GAME_START, GAME_MOVE, GAME_SCORE, GAME_OVER等
    private String roomId; // 房间ID
    private Long playerId; // 玩家ID
    private String playerName; // 玩家昵称
    private String gameType; // 游戏类型
    private Object data; // 消息数据（具体游戏相关数据）
    private Integer score; // 得分
    private Object gameState; // 游戏状态
}