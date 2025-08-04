package com.bunchup.repository.impl;

import com.bunchup.entity.CategoryDO;
import com.bunchup.mapper.CategoryMapper;
import com.bunchup.repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * 类别Repository实现类
 * 
 * @author bunchup
 */
@Repository
public class CategoryRepositoryImpl implements CategoryRepository {
    
    @Autowired
    private CategoryMapper categoryMapper;
    
    @Override
    public CategoryDO getById(Long id) {
        return categoryMapper.selectById(id);
    }
    
    @Override
    public List<CategoryDO> getAllActive() {
        return categoryMapper.selectAllActive();
    }
    
    @Override
    public List<CategoryDO> getAll() {
        return categoryMapper.selectAll();
    }
    
    @Override
    public int save(CategoryDO category) {
        return categoryMapper.insert(category);
    }
    
    @Override
    public int updateById(CategoryDO category) {
        return categoryMapper.updateById(category);
    }
} 