package com.bunchup.service.impl;

import com.bunchup.dto.Tool;
import com.bunchup.exception.BusinessException;
import com.bunchup.repository.ToolRepository;
import com.bunchup.repository.ToolScopeRepository;
import com.bunchup.service.ToolService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
public class ToolServiceImpl implements ToolService {
    
    @Autowired
    private ToolRepository toolRepository;
    
    @Autowired
    private ToolScopeRepository toolScopeRepository;

    @Override
    public List<Tool> getTools(Long categoryId) {
        if (categoryId == null) {
            return toolRepository.findAllEnabled();
        }
        
        // 多次单表查询，在Service层组合
        // 1. 查询全局工具ID
        List<Long> allScopeToolIds = toolScopeRepository.findAllScopeToolIds();
        
        // 2. 查询类别相关工具ID
        List<Long> categoryToolIds = toolScopeRepository.findToolIdsByCategory(categoryId);
        
        // 3. 合并工具ID列表
        Set<Long> toolIdSet = new HashSet<>();
        toolIdSet.addAll(allScopeToolIds);
        toolIdSet.addAll(categoryToolIds);
        
        if (toolIdSet.isEmpty()) {
            return new ArrayList<>();
        }
        
        // 4. 根据工具ID查询工具信息
        return toolRepository.findByIds(new ArrayList<>(toolIdSet));
    }

    @Override
    public List<Tool> getToolsByGroup(Long groupId) {
        if (groupId == null) {
            throw new BusinessException("分组ID不能为空");
        }
        
        // 多次单表查询，在Service层组合
        // 1. 查询全局工具ID
        List<Long> allScopeToolIds = toolScopeRepository.findAllScopeToolIds();
        
        // 2. 查询分组相关工具ID
        List<Long> groupToolIds = toolScopeRepository.findToolIdsByGroup(groupId);
        
        // 3. 合并工具ID列表
        Set<Long> toolIdSet = new HashSet<>();
        toolIdSet.addAll(allScopeToolIds);
        toolIdSet.addAll(groupToolIds);
        
        if (toolIdSet.isEmpty()) {
            return new ArrayList<>();
        }
        
        // 4. 根据工具ID查询工具信息
        return toolRepository.findByIds(new ArrayList<>(toolIdSet));
    }

    @Override
    public Tool getToolDetail(Long id) {
        if (id == null) {
            throw new BusinessException("工具ID不能为空");
        }
        
        Tool tool = toolRepository.get(id);
        if (tool == null) {
            throw new BusinessException("工具不存在或已下线");
        }
        
        return tool;
    }
}
