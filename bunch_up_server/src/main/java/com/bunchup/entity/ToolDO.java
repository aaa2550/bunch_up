package com.bunchup.entity;

import com.mybatisflex.annotation.Id;
import com.mybatisflex.annotation.Table;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Table("tool")
public class ToolDO {
    @Id
    private Long id;
    private String name;
    private String description;
    private String icon;
    private String toolType;
    private String url;
    private Integer isDefault;
    private Integer status;
    private LocalDateTime createTime;
    private LocalDateTime updateTime;
}
