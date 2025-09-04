package com.bunchup.entity;

import com.mybatisflex.annotation.Id;
import com.mybatisflex.annotation.KeyType;
import com.mybatisflex.annotation.Table;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.util.Date;

@Data
@Table("tool_scope")
@Schema(description = "工具展示范围实体")
public class ToolScopeDO {
    @Id(keyType = KeyType.Auto)
    private Long id;
    private Long toolId;
    private String scopeType; // ALL-全部，CATEGORY-指定类别，GROUP-指定分组
    private Long targetId; // 目标ID（类别ID或分组ID）
    private Date createTime;
}