package com.bunchup.service.impl;

import com.bunchup.dto.Category;
import com.bunchup.entity.CategoryDO;
import com.bunchup.repository.CategoryRepository;
import com.bunchup.service.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
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
    
    @Override
    public void initTestData() {
        // 检查是否已有数据
        List<CategoryDO> existingCategories = categoryRepository.getAll();
        if (!existingCategories.isEmpty()) {
            return; // 如果已有数据，不重复插入
        }
        
        // 插入测试数据
        CategoryDO[] testCategories = {
            createCategoryDO(1L, "短视频主播", "短视频主播交流群", "/icons/short-video.png", 1),
            createCategoryDO(2L, "炒股", "股票投资交流群", "/icons/stock.png", 2),
            createCategoryDO(3L, "财经", "财经资讯交流群", "/icons/finance.png", 3),
            createCategoryDO(4L, "程序员", "程序员技术交流群", "/icons/programmer.png", 4),
            createCategoryDO(5L, "设计师", "设计师创意交流群", "/icons/designer.png", 5)
        };
        
        for (CategoryDO category : testCategories) {
            categoryRepository.save(category);
        }
    }
    
    /**
     * 创建类别DO对象
     */
    private CategoryDO createCategoryDO(Long id, String name, String description, String icon, Integer sortOrder) {
        CategoryDO categoryDO = new CategoryDO();
        categoryDO.setId(id);
        categoryDO.setName(name);
        categoryDO.setDescription(description);
        categoryDO.setIcon(icon);
        categoryDO.setSortOrder(sortOrder);
        categoryDO.setStatus(1);
        categoryDO.setCreateTime(LocalDateTime.now());
        categoryDO.setUpdateTime(LocalDateTime.now());
        return categoryDO;
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