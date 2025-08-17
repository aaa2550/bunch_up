package com.bunchup.service;

import com.bunchup.dto.Tool;

import java.util.List;

public interface ToolService {
    
    /**
     * 根据类别ID获取工具列表
     * @param categoryId 类别ID，如果为null则返回所有启用的工具
     * @return 工具列表
     */
    List<Tool> getTools(Long categoryId);
    
    /**
     * 根据分组ID获取工具列表
     * @param groupId 分组ID
     * @return 工具列表
     */
    List<Tool> getToolsByGroup(Long groupId);
    
    /**
     * 根据ID获取工具详情
     * @param id 工具ID
     * @return 工具信息
     */
    Tool getToolDetail(Long id);
}
