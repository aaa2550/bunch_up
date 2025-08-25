package com.bunchup.entity;

import com.mybatisflex.annotation.Id;
import com.mybatisflex.annotation.Table;
import io.swagger.v3.oas.annotations.media.Schema;

import java.time.LocalDateTime;

@Table("tool")
@Schema(description = "AI工具实体")
public class ToolDO {
    @Id
    private Long id;

    private String name;

    private String description;

    private String icon;

    private String toolType; // NORMAL-普通工具，AGENT-AI工具
    
    private String url; // 工具URL

    private Integer isDefault;

    private Integer status; // 1 正常 0 禁用

    private LocalDateTime createTime;

    private LocalDateTime updateTime;

    // getters/setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getIcon() { return icon; }
    public void setIcon(String icon) { this.icon = icon; }
    public String getToolType() { return toolType; }
    public void setToolType(String toolType) { this.toolType = toolType; }
    public String getUrl() { return url; }
    public void setUrl(String url) { this.url = url; }
    public Integer getIsDefault() { return isDefault; }
    public void setIsDefault(Integer isDefault) { this.isDefault = isDefault; }

    public Integer getStatus() { return status; }
    public void setStatus(Integer status) { this.status = status; }
    public LocalDateTime getCreateTime() { return createTime; }
    public void setCreateTime(LocalDateTime createTime) { this.createTime = createTime; }
    public LocalDateTime getUpdateTime() { return updateTime; }
    public void setUpdateTime(LocalDateTime updateTime) { this.updateTime = updateTime; }
}
