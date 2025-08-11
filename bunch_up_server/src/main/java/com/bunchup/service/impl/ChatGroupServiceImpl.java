package com.bunchup.service.impl;

import com.bunchup.dto.ChatGroup;
import com.bunchup.repository.ChatGroupRepository;
import com.bunchup.service.ChatGroupService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ChatGroupServiceImpl implements ChatGroupService {
    @Autowired
    private ChatGroupRepository chatGroupRepository;

    @Override
    public List<ChatGroup> getGroupsByCategoryId(Long categoryId) {
        return chatGroupRepository.findByCategoryId(categoryId);
    }
    
    @Override
    public Integer getGroupOnlineCount(Long groupId) {
        // 这里可以从WebSocket连接池或者Redis中获取在线人数
        // 暂时返回模拟数据，后续可以集成Redis或WebSocket连接管理
        return chatGroupRepository.getGroupOnlineCount(groupId);
    }
}
