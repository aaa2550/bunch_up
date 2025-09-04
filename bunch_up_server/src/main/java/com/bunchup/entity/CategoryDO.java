package com.bunchup.entity;

import com.mybatisflex.annotation.Id;
import com.mybatisflex.annotation.KeyType;
import com.mybatisflex.annotation.Table;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.util.Date;

/**
 * 类别实体类
 *
 * @author bunchup
 */
@Data
@Table("category")
@Schema(description = "类别实体")
public class CategoryDO {

    @Id(keyType = KeyType.Auto)
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