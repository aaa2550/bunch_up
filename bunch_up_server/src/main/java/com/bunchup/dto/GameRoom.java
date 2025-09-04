package com.bunchup.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;

@Data
@Schema(description = "游戏房间DTO")
public class GameRoom {
    private Long id;
    private String roomId;
    private String gameType;
    private Long groupId;
    private String status;
    private Integer maxPlayers;
    private Integer currentPlayers;
    private Date createTime;
    private Date updateTime;
    
    // 游戏状态相关
    private Object gameState; // 游戏状态对象
    private List<GamePlayer> players; // 当前玩家列表
}