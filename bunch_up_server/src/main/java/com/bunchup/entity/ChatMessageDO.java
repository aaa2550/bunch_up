package com.bunchup.entity;

import com.mybatisflex.annotation.Id;
import com.mybatisflex.annotation.KeyType;
import com.mybatisflex.annotation.Table;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.util.Date;

@Data
@Table("chat_message")
@Schema(description = "聊天消息实体")
public class ChatMessageDO {

    @Id(keyType = KeyType.Auto)
    @Schema(description = "消息ID")
    private Long id;
    @Schema(description = "发送者ID")
    private Long userId;
    @Schema(description = "发送者昵称")
    private String userName;
    @Schema(description = "群组ID")
    private Long groupId;
    @Schema(description = "消息内容")
    private String content;
    @Schema(description = "消息类型：1-文本，2-图片，3-文件")
    private Integer messageType;
    @Schema(description = "发送时间")
    private Date sendTime;
    @Schema(description = "消息状态：1-正常，0-已删除")
    private Integer status;

} 