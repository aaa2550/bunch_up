package com.bunchup.dto;

import lombok.Data;
import io.swagger.v3.oas.annotations.media.Schema;

@Data
@Schema(description = "工具信息")
public class Tool {
    @Schema(description = "工具ID")
    private Long id;
    
    @Schema(description = "工具名称")
    private String name;
    
    @Schema(description = "工具描述")
    private String description;
    
    @Schema(description = "工具图标")
    private String icon;
    
    @Schema(description = "工具类型：NORMAL-普通工具，AGENT-AI工具")
    private String toolType;
    
    @Schema(description = "工具URL")
    private String url;
    
    @Schema(description = "是否默认工具：1-是，0-否")
    private Integer isDefault;
    
    @Schema(description = "状态：1-启用，0-禁用")
    private Integer status;
}
