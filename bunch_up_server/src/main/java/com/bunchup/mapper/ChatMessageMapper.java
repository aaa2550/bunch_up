package com.bunchup.mapper;

import com.bunchup.entity.ChatMessageDO;
import com.mybatisflex.core.BaseMapper;
import org.apache.ibatis.annotations.Mapper;
 
@Mapper
public interface ChatMessageMapper extends BaseMapper<ChatMessageDO> {
} 