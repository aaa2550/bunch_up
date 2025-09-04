package com.bunchup.repository.impl;

import com.bunchup.dto.Tool;
import com.bunchup.entity.ToolDO;
import com.bunchup.mapper.ToolMapper;
import com.bunchup.repository.ToolRepository;
import com.mybatisflex.spring.service.impl.ServiceImpl;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class ToolRepositoryImpl extends ServiceImpl<ToolMapper, ToolDO> implements ToolRepository {
    @Override
    public List<Tool> findByCategory(Long categoryId) {
        return INSTANCE.convertToDTO(getMapper().selectByCategoryOrGlobal(categoryId));
    }
}
