package com.bunchup.mapper;

import com.bunchup.entity.ToolDO;
import com.mybatisflex.core.BaseMapper;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface ToolMapper extends BaseMapper<ToolDO> {
    @Select("SELECT * FROM tool WHERE status = 1 AND (category_id = #{categoryId} OR category_id IS NULL)")
    List<ToolDO> selectByCategoryOrGlobal(Long categoryId);
}
