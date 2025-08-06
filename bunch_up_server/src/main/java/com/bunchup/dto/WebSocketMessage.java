package com.bunchup.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
@Schema(description = "WebSocket消息")
public class WebSocketMessage {
    
    @Schema(description = "消息类型：CHAT-聊天消息，JOIN-加入群组，LEAVE-离开群组，HEARTBEAT-心跳")
    private String type;
    
    @Schema(description = "消息数据")
    private Object data;
    
    @Schema(description = "时间戳")
    private Long timestamp;
    
    public WebSocketMessage() {
        this.timestamp = System.currentTimeMillis();
    }
    
    public WebSocketMessage(String type, Object data) {
        this.type = type;
        this.data = data;
        this.timestamp = System.currentTimeMillis();
    }
} 