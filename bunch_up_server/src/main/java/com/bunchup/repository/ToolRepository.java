package com.bunchup.repository;

import com.bunchup.dto.Tool;
import com.bunchup.entity.ToolDO;
import com.mybatisflex.core.service.IService;

import java.util.List;

public interface ToolRepository extends IService<ToolDO> {
    
    /**
     * 根据类别ID获取工具列表
     * @param categoryId 类别ID
     * @return 工具列表
     */
    List<Tool> findByCategory(Long categoryId);
    
    /**
     * 根据分组ID获取工具列表
     * @param groupId 分组ID
     * @return 工具列表
     */
    List<Tool> findByGroup(Long groupId);
    
    /**
     * 获取所有启用的工具
     * @return 工具列表
     */
    List<Tool> findAllEnabled();
    
    /**
     * 根据ID获取工具详情
     * @param id 工具ID
     * @return 工具信息
     */
    Tool get(Long id);
    
    /**
     * 根据工具ID列表查找工具
     * @param toolIds 工具ID列表
     * @return 工具列表
     */
    List<Tool> findByIds(List<Long> toolIds);
}
