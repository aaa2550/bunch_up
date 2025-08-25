package com.bunchup.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
@Schema(description = "AI工具DTO")
public class Tool {
    private Long id;
    private String name;
    private String description;
    private String icon;
    private String toolType; // NORMAL-普通工具，AGENT-AI工具
    private String url; // 工具URL
    private Boolean isDefault;
    private Integer status;
}
