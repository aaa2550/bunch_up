package com.bunchup.repository.impl;

import com.bunchup.dto.Tool;
import com.bunchup.entity.ToolDO;
import com.bunchup.mapper.ToolMapper;
import com.bunchup.repository.ToolRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;

@Repository
public class ToolRepositoryImpl implements ToolRepository {
    @Autowired
    private ToolMapper toolMapper;

    @Override
    public List<Tool> findByCategory(Long categoryId) {
        List<ToolDO> list = toolMapper.selectByCategoryOrGlobal(categoryId);
        List<Tool> result = new ArrayList<>();
        for (ToolDO d : list) {
            Tool t = new Tool();
            t.setId(d.getId());
            t.setName(d.getName());
            t.setDescription(d.getDescription());
            t.setIcon(d.getIcon());
            t.setType(d.getType());
            t.setIsDefault(d.getIsDefault() != null && d.getIsDefault() == 1);
            t.setCategoryId(d.getCategoryId());
            t.setStatus(d.getStatus());
            result.add(t);
        }
        return result;
    }
}
