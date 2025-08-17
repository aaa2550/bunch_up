package com.bunchup.repository;

import com.bunchup.entity.ToolScopeDO;
import com.mybatisflex.core.service.IService;

import java.util.List;

public interface ToolScopeRepository extends IService<ToolScopeDO> {
    
    /**
     * 查找所有范围的工具ID
     * @return 工具ID列表
     */
    List<Long> findAllScopeToolIds();
    
    /**
     * 根据类别ID查找工具ID
     * @param categoryId 类别ID
     * @return 工具ID列表
     */
    List<Long> findToolIdsByCategory(Long categoryId);
    
    /**
     * 根据分组ID查找工具ID
     * @param groupId 分组ID
     * @return 工具ID列表
     */
    List<Long> findToolIdsByGroup(Long groupId);
}
