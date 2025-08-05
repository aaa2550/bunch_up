package com.bunchup.service;

import com.bunchup.dto.Category;

import java.util.List;

public interface CategoryService {
    
    List<Category> find();
    
    Category get(Long id);
    
    Category save(Category category);
    
    Category update(Category category);
    
    void delete(Long id);
    
    void initTestData();
} 