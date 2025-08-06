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
}
