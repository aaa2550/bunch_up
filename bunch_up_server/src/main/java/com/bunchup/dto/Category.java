package com.bunchup.dto;

import io.swagger.v3.oas.annotations.media.Schema;

import java.util.Date;

/**
 * 类别DTO
 *
 * @author bunchup
 */
@Schema(description = "类别DTO")
public class Category {

    @Schema(description = "类别ID")
    private Long id;

    @Schema(description = "类别名称")
    private String name;

    @Schema(description = "类别描述")
    private String description;

    @Schema(description = "类别图标")
    private String icon;

    @Schema(description = "状态：1-正常，0-禁用")
    private Integer status;

    @Schema(description = "排序")
    private Integer sortOrder;

    @Schema(description = "创建时间")
    private Date createTime;

    @Schema(description = "更新时间")
    private Date updateTime;

} 