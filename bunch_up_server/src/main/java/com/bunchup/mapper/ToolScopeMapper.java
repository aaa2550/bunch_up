package com.bunchup.mapper;

import com.bunchup.entity.ToolScopeDO;
import com.mybatisflex.core.BaseMapper;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface ToolScopeMapper extends BaseMapper<ToolScopeDO> {
    
    @Select("SELECT * FROM tool_scope WHERE tool_id = #{toolId}")
    List<ToolScopeDO> selectByToolId(Long toolId);
    
    @Select("SELECT * FROM tool_scope WHERE scope_type = 'CATEGORY' AND target_id = #{categoryId}")
    List<ToolScopeDO> selectByCategoryId(Long categoryId);
    
    @Select("SELECT * FROM tool_scope WHERE scope_type = 'GROUP' AND target_id = #{groupId}")
    List<ToolScopeDO> selectByGroupId(Long groupId);
    
    @Select("SELECT * FROM tool_scope WHERE scope_type = 'ALL'")
    List<ToolScopeDO> selectAllScope();
}