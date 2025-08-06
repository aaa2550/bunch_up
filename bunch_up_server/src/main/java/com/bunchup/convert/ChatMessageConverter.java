package com.bunchup.convert;

import com.bunchup.dto.ChatMessage;
import com.bunchup.entity.ChatMessageDO;
import com.mybatisflex.core.paginate.Page;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

import java.util.List;

@Mapper
public interface ChatMessageConverter {
    ChatMessageConverter INSTANCE = Mappers.getMapper(ChatMessageConverter.class);
    
    ChatMessage convertToDTO(ChatMessageDO obj);
    List<ChatMessage> convertToDTO(List<ChatMessageDO> list);
    Page<ChatMessage> convertToDTO(Page<ChatMessageDO> page);
    ChatMessageDO convertToDO(ChatMessage obj);
    List<ChatMessageDO> convertToDO(List<ChatMessage> list);
} 