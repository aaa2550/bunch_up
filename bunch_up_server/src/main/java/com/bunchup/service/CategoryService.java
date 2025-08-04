package com.bunchup.service;

import com.bunchup.dto.Category;

import java.util.List;

/**
 * 类别服务接口
 * 
 * @author bunchup
 */
public interface CategoryService {
    
    /**
     * 根据ID获取类别
     */
    Category getById(Long id);
    
    /**
     * 获取所有启用的类别
     */
    List<Category> getAllActive();
    
    /**
     * 获取所有类别
     */
    List<Category> getAll();
} 