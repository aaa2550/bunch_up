package com.bunchup.repository.impl;

import com.bunchup.convert.CategoryConverter;
import com.bunchup.dto.Category;
import com.bunchup.entity.CategoryDO;
import com.bunchup.mapper.CategoryMapper;
import com.bunchup.repository.CategoryRepository;
import com.mybatisflex.spring.service.impl.ServiceImpl;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class CategoryRepositoryImpl extends ServiceImpl<CategoryMapper, CategoryDO> implements CategoryRepository {

    @Override
    public List<Category> find() {
        List<CategoryDO> categoryDOList = queryChain()
                .where(CategoryDO::getStatus).eq(1)
                .orderBy(CategoryDO::getSortOrder).asc()
                .list();
        return CategoryConverter.INSTANCE.convertToDTO(categoryDOList);
    }

    @Override
    public Category get(Long id) {
        CategoryDO categoryDO = queryChain()
                .where(CategoryDO::getId).eq(id)
                .one();
        return CategoryConverter.INSTANCE.convertToDTO(categoryDO);
    }

    @Override
    public Category save(Category category) {
        CategoryDO categoryDO = CategoryConverter.INSTANCE.convertToDO(category);
        super.save(categoryDO);
        return CategoryConverter.INSTANCE.convertToDTO(categoryDO);
    }

} 