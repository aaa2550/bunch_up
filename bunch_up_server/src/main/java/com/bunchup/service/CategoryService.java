package com.bunchup.service;

import com.bunchup.dto.Category;

import java.util.List;

public interface CategoryService {
    
    List<Category> find();
    
    Category get(Long id);
    
    void initTestData();
} 