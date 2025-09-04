package com.bunchup.entity;

import com.mybatisflex.annotation.Id;
import com.mybatisflex.annotation.KeyType;
import com.mybatisflex.annotation.Table;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.util.Date;

@Data
@Table("tool")
@Schema(description = "AI工具实体")
public class ToolDO {
    @Id(keyType = KeyType.Auto)
    private Long id;
    private String name;
    private String description;
    private String icon;
    private String toolType; // NORMAL-普通工具，AGENT-AI工具
    private String url; // 工具URL
    private Boolean isDefault;
    private Integer status; // 1 正常 0 禁用
    private Date createTime;
    private Date updateTime;

}
