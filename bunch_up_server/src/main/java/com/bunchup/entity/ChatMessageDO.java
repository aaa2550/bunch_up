package com.bunchup.entity;

import com.mybatisflex.annotation.Id;
import com.mybatisflex.annotation.Table;
import io.swagger.v3.oas.annotations.media.Schema;

import java.time.LocalDateTime;

@Table("chat_message")
@Schema(description = "聊天消息实体")
public class ChatMessageDO {
    
    @Id
    @Schema(description = "消息ID")
    private Long id;
    
    @Schema(description = "发送者ID")
    private Long userId;
    
    @Schema(description = "群组ID")
    private Long groupId;
    
    @Schema(description = "消息内容")
    private String content;
    
    @Schema(description = "消息类型：1-文本，2-图片，3-文件")
    private Integer messageType;
    
    @Schema(description = "发送时间")
    private LocalDateTime sendTime;
    
    @Schema(description = "消息状态：1-正常，0-已删除")
    private Integer status;
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public Long getUserId() {
        return userId;
    }
    
    public void setUserId(Long userId) {
        this.userId = userId;
    }
    
    public Long getGroupId() {
        return groupId;
    }
    
    public void setGroupId(Long groupId) {
        this.groupId = groupId;
    }
    
    public String getContent() {
        return content;
    }
    
    public void setContent(String content) {
        this.content = content;
    }
    
    public Integer getMessageType() {
        return messageType;
    }
    
    public void setMessageType(Integer messageType) {
        this.messageType = messageType;
    }
    
    public LocalDateTime getSendTime() {
        return sendTime;
    }
    
    public void setSendTime(LocalDateTime sendTime) {
        this.sendTime = sendTime;
    }
    
    public Integer getStatus() {
        return status;
    }
    
    public void setStatus(Integer status) {
        this.status = status;
    }
} 