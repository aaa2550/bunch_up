package com.bunchup.service.impl;

import com.bunchup.dto.Category;
import com.bunchup.entity.CategoryDO;
import com.bunchup.repository.CategoryRepository;
import com.bunchup.service.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

/**
 * 类别服务实现类
 * 
 * @author bunchup
 */
@Service
public class CategoryServiceImpl implements CategoryService {
    
    @Autowired
    private CategoryRepository categoryRepository;
    
    @Override
    public Category getById(Long id) {
        CategoryDO categoryDO = categoryRepository.getById(id);
        return categoryDO != null ? convertToDTO(categoryDO) : null;
    }
    
    @Override
    public List<Category> getAllActive() {
        List<CategoryDO> categoryDOList = categoryRepository.getAllActive();
        return categoryDOList.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    @Override
    public List<Category> getAll() {
        List<CategoryDO> categoryDOList = categoryRepository.getAll();
        return categoryDOList.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    /**
     * 转换为DTO
     */
    private Category convertToDTO(CategoryDO categoryDO) {
        Category category = new Category();
        category.setId(categoryDO.getId());
        category.setName(categoryDO.getName());
        category.setDescription(categoryDO.getDescription());
        category.setIcon(categoryDO.getIcon());
        category.setStatus(categoryDO.getStatus());
        category.setSortOrder(categoryDO.getSortOrder());
        category.setCreateTime(categoryDO.getCreateTime());
        category.setUpdateTime(categoryDO.getUpdateTime());
        return category;
    }
} 