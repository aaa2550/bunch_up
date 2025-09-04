package com.bunchup.repository;

import com.bunchup.convert.ChatMessageConverter;
import com.bunchup.dto.ChatMessage;
import com.bunchup.entity.ChatMessageDO;
import com.mybatisflex.core.service.IService;
import org.mapstruct.factory.Mappers;

import java.util.List;

public interface ChatMessageRepository extends IService<ChatMessageDO> {
    ChatMessageConverter INSTANCE = Mappers.getMapper(ChatMessageConverter.class);
    List<ChatMessage> findByGroupId(Long groupId, int limit);

    void save(ChatMessage chatMessage);
}