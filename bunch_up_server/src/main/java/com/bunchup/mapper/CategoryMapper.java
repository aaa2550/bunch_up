package com.bunchup.mapper;

import com.bunchup.entity.CategoryDO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Update;

import java.util.List;

/**
 * 类别Mapper接口
 * 
 * @author bunchup
 */
@Mapper
public interface CategoryMapper {
    
    @Select("SELECT * FROM category WHERE id = #{id}")
    CategoryDO selectById(Long id);
    
    @Select("SELECT * FROM category WHERE status = 1 ORDER BY sort_order ASC")
    List<CategoryDO> selectAllActive();
    
    @Select("SELECT * FROM category ORDER BY sort_order ASC")
    List<CategoryDO> selectAll();
    
    @Insert("INSERT INTO category (name, description, icon, status, sort_order, create_time, update_time) " +
            "VALUES (#{name}, #{description}, #{icon}, #{status}, #{sortOrder}, #{createTime}, #{updateTime})")
    int insert(CategoryDO category);
    
    @Update("UPDATE category SET name = #{name}, description = #{description}, icon = #{icon}, " +
            "status = #{status}, sort_order = #{sortOrder}, update_time = #{updateTime} WHERE id = #{id}")
    int updateById(CategoryDO category);
} 