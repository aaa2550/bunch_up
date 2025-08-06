package com.bunchup.convert;

import com.bunchup.dto.ChatGroup;
import com.bunchup.entity.ChatGroupDO;
import com.mybatisflex.core.paginate.Page;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

import java.util.List;

@Mapper
public interface ChatGroupConverter {
    ChatGroupConverter INSTANCE = Mappers.getMapper(ChatGroupConverter.class);
    
    ChatGroup convertToDTO(ChatGroupDO obj);
    List<ChatGroup> convertToDTO(List<ChatGroupDO> list);
    Page<ChatGroup> convertToDTO(Page<ChatGroupDO> page);
    ChatGroupDO convertToDO(ChatGroup obj);
    List<ChatGroupDO> convertToDO(List<ChatGroup> list);
} 