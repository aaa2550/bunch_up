package com.bunchup.repository.impl;

import com.bunchup.convert.ToolConverter;
import com.bunchup.dto.Tool;
import com.bunchup.entity.ToolDO;
import com.bunchup.mapper.ToolMapper;
import com.bunchup.repository.ToolRepository;
import com.mybatisflex.spring.service.impl.ServiceImpl;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;

@Repository
public class ToolRepositoryImpl extends ServiceImpl<ToolMapper, ToolDO> implements ToolRepository {

    @Override
    public List<Tool> findByCategory(Long categoryId) {
        // 单一查询：查询所有启用的工具，范围逻辑由Service层处理
        List<ToolDO> toolDOList = queryChain()
            .where(ToolDO::getStatus).eq(1)
            .orderBy(ToolDO::getIsDefault).desc()
            .orderBy(ToolDO::getId).asc()
            .list();
            
        return ToolConverter.INSTANCE.convertToDTO(toolDOList);
    }

    @Override
    public List<Tool> findByGroup(Long groupId) {
        // 单一查询：查询所有启用的工具，范围逻辑由Service层处理
        List<ToolDO> toolDOList = queryChain()
            .where(ToolDO::getStatus).eq(1)
            .orderBy(ToolDO::getIsDefault).desc()
            .orderBy(ToolDO::getId).asc()
            .list();
            
        return ToolConverter.INSTANCE.convertToDTO(toolDOList);
    }

    @Override
    public List<Tool> findAllEnabled() {
        List<ToolDO> toolDOList = queryChain()
            .where(ToolDO::getStatus).eq(1)
            .orderBy(ToolDO::getIsDefault).desc()
            .orderBy(ToolDO::getId).asc()
            .list();
            
        return ToolConverter.INSTANCE.convertToDTO(toolDOList);
    }

    @Override
    public Tool get(Long id) {
        ToolDO toolDO = queryChain()
            .where(ToolDO::getId).eq(id)
            .one();
            
        return ToolConverter.INSTANCE.convertToDTO(toolDO);
    }
    
    @Override
    public List<Tool> findByIds(List<Long> toolIds) {
        if (toolIds == null || toolIds.isEmpty()) {
            return new ArrayList<>();
        }
        
        List<ToolDO> toolDOList = queryChain()
            .where(ToolDO::getId).in(toolIds)
            .and(ToolDO::getStatus).eq(1)
            .orderBy(ToolDO::getIsDefault).desc()
            .orderBy(ToolDO::getId).asc()
            .list();
            
        return ToolConverter.INSTANCE.convertToDTO(toolDOList);
    }
}
