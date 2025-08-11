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
    
    @Override
    public Integer getGroupOnlineCount(Long groupId) {
        // 这里可以从WebSocket连接池或者Redis中获取在线人数
        // 暂时返回模拟数据，后续可以集成Redis或WebSocket连接管理
        // 模拟返回5-20之间的随机在线人数
        return (int) (Math.random() * 16) + 5;
    }
}
