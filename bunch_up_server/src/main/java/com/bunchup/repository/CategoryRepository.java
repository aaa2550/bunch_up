package com.bunchup.repository;

import com.bunchup.dto.Category;
import com.bunchup.entity.CategoryDO;
import com.mybatisflex.core.service.IService;

import java.util.List;

public interface CategoryRepository extends IService<CategoryDO> {
    
    List<Category> find();
    Category get(Long id);
    Category save(Category category);
    Category update(Category category);
    void delete(Long id);
} 