package com.bunchup.service;

import com.bunchup.dto.ChatGroup;

import java.util.List;

public interface ChatGroupService {
    List<ChatGroup> getGroupsByCategoryId(Long categoryId);
    
    Integer getGroupOnlineCount(Long groupId);
}
