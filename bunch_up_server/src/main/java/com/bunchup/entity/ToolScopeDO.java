package com.bunchup.entity;

import com.mybatisflex.annotation.Id;
import com.mybatisflex.annotation.Table;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Table("tool_scope")
public class ToolScopeDO {
    @Id
    private Long id;
    private Long toolId;
    private String scopeType;
    private Long targetId;
    private LocalDateTime createTime;
}
