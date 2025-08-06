package com.bunchup.repository.impl;

import com.bunchup.convert.ChatGroupConverter;
import com.bunchup.dto.ChatGroup;
import com.bunchup.entity.ChatGroupDO;
import com.bunchup.mapper.ChatGroupMapper;
import com.bunchup.repository.ChatGroupRepository;
import com.mybatisflex.spring.service.impl.ServiceImpl;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository
public class ChatGroupRepositoryImpl extends ServiceImpl<ChatGroupMapper, ChatGroupDO> implements ChatGroupRepository {

    @Override
    public List<ChatGroup> findByCategoryId(Long categoryId) {
        List<ChatGroupDO> chatGroupDOS = queryChain()
                .eq(ChatGroupDO::getCategoryId, categoryId)
                .list();
        return ChatGroupConverter.INSTANCE.convertToDTO(chatGroupDOS);
    }
}
