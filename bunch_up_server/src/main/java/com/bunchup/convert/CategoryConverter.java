package com.bunchup.convert;

import com.bunchup.dto.Category;
import com.bunchup.entity.CategoryDO;
import com.mybatisflex.core.paginate.Page;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

import java.util.List;

@Mapper
public interface CategoryConverter {
    CategoryConverter INSTANCE = Mappers.getMapper(CategoryConverter.class);
    
    Category convertToDTO(CategoryDO obj);
    List<Category> convertToDTO(List<CategoryDO> list);
    Page<Category> convertToDTO(Page<CategoryDO> page);
    CategoryDO convertToDO(Category obj);
    List<CategoryDO> convertToDO(List<Category> list);
} 