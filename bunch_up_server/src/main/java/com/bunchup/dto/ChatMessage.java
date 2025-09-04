package com.bunchup.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import lombok.experimental.Accessors;

import java.time.LocalDateTime;
import java.util.Date;

@Data
@Accessors(chain = true)
@Schema(description = "聊天消息")
public class ChatMessage {
    
    @Schema(description = "消息ID")
    private Long id;
    
    @Schema(description = "发送者ID")
    private Long userId;
    
    @Schema(description = "发送者昵称")
    private String userName;
    
    @Schema(description = "发送者头像")
    private String userAvatar;
    
    @Schema(description = "消息内容")
    private String content;
    
    @Schema(description = "消息类型：1-文本，2-图片，3-文件")
    private Integer messageType;
    
    @Schema(description = "群组ID")
    private Long groupId;
    
    @Schema(description = "群组名称")
    private String groupName;
    
    @Schema(description = "发送时间")
    private Date sendTime;
    
    @Schema(description = "是否是自己发送的消息")
    private Boolean isSelf;
} 