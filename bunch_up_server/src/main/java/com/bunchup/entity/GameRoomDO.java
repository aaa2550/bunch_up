package com.bunchup.entity;

import com.mybatisflex.annotation.Id;
import com.mybatisflex.annotation.KeyType;
import com.mybatisflex.annotation.Table;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.util.Date;

@Data
@Table("game_room")
@Schema(description = "游戏房间实体")
public class GameRoomDO {
    @Id(keyType = KeyType.Auto)
    private Long id;
    private String roomId; // 房间ID（通常是groupId_gameType格式）
    private String gameType; // 游戏类型：snake, tetris等
    private Long groupId; // 所属聊天分组ID
    private String gameState; // 游戏状态JSON
    private String status; // 房间状态：waiting, playing, ended
    private Integer maxPlayers; // 最大玩家数
    private Integer currentPlayers; // 当前玩家数
    private Date createTime;
    private Date updateTime;

}