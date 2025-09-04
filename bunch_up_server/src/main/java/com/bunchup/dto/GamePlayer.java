package com.bunchup.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.Date;

@Data
@Schema(description = "游戏玩家DTO")
public class GamePlayer {
    private Long id;
    private String roomId;
    private Long userId;
    private String playerName;
    private Integer score;
    private String status;
    private Date joinTime;
    private Date updateTime;
    
    // 游戏状态相关
    private Object playerState; // 玩家状态对象（如蛇的位置）
}