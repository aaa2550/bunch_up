package com.bunchup.repository;

import com.bunchup.entity.CategoryDO;

import java.util.List;

/**
 * 类别Repository接口
 * 
 * @author bunchup
 */
public interface CategoryRepository {
    
    /**
     * 根据ID获取类别
     */
    CategoryDO getById(Long id);
    
    /**
     * 获取所有启用的类别
     */
    List<CategoryDO> getAllActive();
    
    /**
     * 获取所有类别
     */
    List<CategoryDO> getAll();
    
    /**
     * 保存类别
     */
    int save(CategoryDO category);
    
    /**
     * 更新类别
     */
    int updateById(CategoryDO category);
} 