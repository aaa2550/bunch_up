package com.bunchup.entity;

import com.mybatisflex.annotation.Id;
import com.mybatisflex.annotation.Table;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Table("tool_form_fields")
public class ToolFormFieldDO {
    @Id
    private Long id;
    private Long toolId;
    private String fieldName;
    private String fieldType;
    private String fieldLabel;
    private String placeholder;
    private Integer maxLength;
    private Boolean required;
    private Integer sortOrder;
    private String options;
    private LocalDateTime createTime;
}
