package com.bunchup.service.impl;

import com.bunchup.dto.Category;
import com.bunchup.repository.CategoryRepository;
import com.bunchup.service.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CategoryServiceImpl implements CategoryService {
    
    @Autowired
    private CategoryRepository categoryRepository;
    
    @Override
    public List<Category> find() {
        return categoryRepository.find();
    }
    
    @Override
    public Category get(Long id) {
        return categoryRepository.get(id);
    }
    
    @Override
    public Category save(Category category) {
        return categoryRepository.save(category);
    }
    
    @Override
    public Category update(Category category) {
        return categoryRepository.update(category);
    }
    
    @Override
    public void delete(Long id) {
        categoryRepository.delete(id);
    }
    
    @Override
    public void initTestData() {
        List<Category> categories = categoryRepository.find();
        if (categories.isEmpty()) {
            Category category1 = createCategoryDO("短视频主播", "🎥", 1);
            Category category2 = createCategoryDO("炒股", "📈", 2);
            Category category3 = createCategoryDO("财经", "💰", 3);
            Category category4 = createCategoryDO("程序员", "💻", 4);
            Category category5 = createCategoryDO("设计师", "🎨", 5);
            
            categoryRepository.save(category1);
            categoryRepository.save(category2);
            categoryRepository.save(category3);
            categoryRepository.save(category4);
            categoryRepository.save(category5);
    }
    }
    
    private Category createCategoryDO(String name, String icon, Integer sortOrder) {
        Category category = new Category();
        category.setName(name);
        category.setIcon(icon);
        category.setSortOrder(sortOrder);
        category.setStatus(1);
        return category;
    }
} 