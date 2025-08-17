package com.bunchup.repository.impl;

import com.bunchup.entity.ToolScopeDO;
import com.bunchup.mapper.ToolScopeMapper;
import com.bunchup.repository.ToolScopeRepository;
import com.mybatisflex.spring.service.impl.ServiceImpl;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.stream.Collectors;

@Repository
public class ToolScopeRepositoryImpl extends ServiceImpl<ToolScopeMapper, ToolScopeDO> implements ToolScopeRepository {

    @Override
    public List<Long> findAllScopeToolIds() {
        List<ToolScopeDO> scopes = queryChain()
            .where(ToolScopeDO::getScopeType).eq("ALL")
            .list();
            
        return scopes.stream()
            .map(ToolScopeDO::getToolId)
            .distinct()
            .collect(Collectors.toList());
    }

    @Override
    public List<Long> findToolIdsByCategory(Long categoryId) {
        List<ToolScopeDO> scopes = queryChain()
            .where(ToolScopeDO::getScopeType).eq("CATEGORY")
            .and(ToolScopeDO::getTargetId).eq(categoryId)
            .list();
            
        return scopes.stream()
            .map(ToolScopeDO::getToolId)
            .distinct()
            .collect(Collectors.toList());
    }

    @Override
    public List<Long> findToolIdsByGroup(Long groupId) {
        List<ToolScopeDO> scopes = queryChain()
            .where(ToolScopeDO::getScopeType).eq("GROUP")
            .and(ToolScopeDO::getTargetId).eq(groupId)
            .list();
            
        return scopes.stream()
            .map(ToolScopeDO::getToolId)
            .distinct()
            .collect(Collectors.toList());
    }
}
