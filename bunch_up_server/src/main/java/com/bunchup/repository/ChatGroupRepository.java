package com.bunchup.repository;

import com.bunchup.dto.ChatGroup;
import com.bunchup.entity.ChatGroupDO;
import com.mybatisflex.core.service.IService;

import java.util.List;

public interface ChatGroupRepository extends IService<ChatGroupDO> {
    List<ChatGroup> findByCategoryId(Long categoryId);
}
