package com.bunchup.mapper;

import com.bunchup.entity.ToolDO;
import com.mybatisflex.core.BaseMapper;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface ToolMapper extends BaseMapper<ToolDO> {
    
    @Select("SELECT DISTINCT t.* FROM tool t " +
            "LEFT JOIN tool_scope ts ON t.id = ts.tool_id " +
            "WHERE t.status = 1 AND (" +
            "ts.scope_type = 'ALL' OR " +
            "(ts.scope_type = 'CATEGORY' AND ts.target_id = #{categoryId})" +
            ")")
    List<ToolDO> selectByCategoryOrGlobal(Long categoryId);
    
    @Select("SELECT DISTINCT t.* FROM tool t " +
            "LEFT JOIN tool_scope ts ON t.id = ts.tool_id " +
            "WHERE t.status = 1 AND (" +
            "ts.scope_type = 'ALL' OR " +
            "(ts.scope_type = 'GROUP' AND ts.target_id = #{groupId})" +
            ")")
    List<ToolDO> selectByGroupOrGlobal(Long groupId);
}
