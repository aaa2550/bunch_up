package com.bunchup.entity;

import com.mybatisflex.annotation.Id;
import com.mybatisflex.annotation.KeyType;
import com.mybatisflex.annotation.Table;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.util.Date;

@Data
@Table("chat_group")
@Schema(description = "聊天群组实体")
public class ChatGroupDO {

    @Id(keyType = KeyType.Auto)
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
    private Date createTime;
    @Schema(description = "更新时间")
    private Date updateTime;

} 