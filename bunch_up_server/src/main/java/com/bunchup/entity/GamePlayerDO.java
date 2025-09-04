package com.bunchup.entity;

import com.mybatisflex.annotation.Id;
import com.mybatisflex.annotation.KeyType;
import com.mybatisflex.annotation.Table;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.util.Date;

@Data
@Table("game_player")
@Schema(description = "游戏玩家实体")
public class GamePlayerDO {
    @Id(keyType = KeyType.Auto)
    private Long id;
    private String roomId; // 游戏房间ID
    private Long userId; // 玩家用户ID
    private String playerName; // 玩家昵称
    private Integer score; // 当前得分
    private String playerState; // 玩家状态JSON（如蛇的位置等）
    private String status; // 玩家状态：playing, game_over, disconnected
    private Date joinTime;
    private Date updateTime;

}