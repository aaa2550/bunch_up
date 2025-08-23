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
    private String type; // AGENT or NORMAL
    private Boolean isDefault;
    private Long categoryId; // null for global
    private Integer status;
}
