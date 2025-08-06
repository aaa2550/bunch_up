package com.bunchup.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Schema(description = "聊天群组")
public class ChatGroup {
    
    @Schema(description = "群组ID")
    private Long id;
    
    @Schema(description = "群组名称")
    private String name;
    
    @Schema(description = "群组描述")
    private String description;
    
    @Schema(description = "群组头像")
    private String avatar;
    
    @Schema(description = "类别ID")
    private Long categoryId;
    
    @Schema(description = "群组状态：1-正常，0-禁用")
    private Integer status;
    
    @Schema(description = "创建时间")
    private LocalDateTime createTime;
    
    @Schema(description = "更新时间")
    private LocalDateTime updateTime;
} 