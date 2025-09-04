package com.bunchup.repository.impl;

import com.bunchup.dto.ChatMessage;
import com.bunchup.entity.ChatMessageDO;
import com.bunchup.enums.StatusEnum;
import com.bunchup.mapper.ChatMessageMapper;
import com.bunchup.repository.ChatMessageRepository;
import com.mybatisflex.spring.service.impl.ServiceImpl;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class ChatMessageRepositoryImpl extends ServiceImpl<ChatMessageMapper, ChatMessageDO> implements ChatMessageRepository {
    @Override
    public List<ChatMessage> findByGroupId(Long groupId, int limit) {
        return INSTANCE.convertToDTO(queryChain().eq(ChatMessageDO::getGroupId, groupId)
                .eq(ChatMessageDO::getStatus, StatusEnum.YES.ordinal())
                .orderBy(ChatMessageDO::getSendTime).asc()
                .list());
    }

    @Override
    public void save(ChatMessage chatMessage) {
        ChatMessageDO messageDO = INSTANCE.convertToDO(chatMessage);
        messageDO.setStatus(1);
        save(messageDO);
        chatMessage.setId(messageDO.getId());
    }
}