package com.bunchup.service;

import com.bunchup.dto.ChatGroup;
import com.bunchup.dto.ChatMessage;

import java.util.List;

public interface ChatService {
    
    List<ChatGroup> getGroupsByCategory(Long categoryId);
    
    List<ChatMessage> getMessagesByGroup(Long groupId, int limit);
    
    void saveMessage(ChatMessage message);
    
    void initTestData();
} 