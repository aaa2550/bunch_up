package com.bunchup.controller;

import com.bunchup.common.R;
import com.bunchup.dto.ChatGroup;
import com.bunchup.service.ChatGroupService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/groups")
public class ChatGroupController {
    @Autowired
    private ChatGroupService chatGroupService;

    @GetMapping("/category/{categoryId}")
    public R<List<ChatGroup>> getGroupsByCategoryId(@PathVariable Long categoryId) {
        return R.ok(chatGroupService.getGroupsByCategoryId(categoryId));
    }
    
    @GetMapping("/{groupId}/online-count")
    public R<Integer> getGroupOnlineCount(@PathVariable Long groupId) {
        return R.ok(chatGroupService.getGroupOnlineCount(groupId));
    }
}
