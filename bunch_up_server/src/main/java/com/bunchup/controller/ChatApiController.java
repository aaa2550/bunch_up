package com.bunchup.controller;

import com.bunchup.common.R;
import com.bunchup.dto.ChatGroup;
import com.bunchup.dto.ChatMessage;
import com.bunchup.service.ChatService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "聊天管理", description = "聊天相关接口")
@RestController
@RequestMapping("/chat")
public class ChatApiController {
    
    @Autowired
    private ChatService chatService;
    
    @Operation(summary = "获取类别下的群组列表")
    @GetMapping("/groups/{categoryId}")
    public R<List<ChatGroup>> getGroupsByCategory(@PathVariable Long categoryId) {
        List<ChatGroup> groups = chatService.getGroupsByCategory(categoryId);
        return R.ok(groups);
    }
    
    @Operation(summary = "获取群组消息")
    @GetMapping("/messages/{groupId}")
    public R<List<ChatMessage>> getMessagesByGroup(@PathVariable Long groupId, 
                                                   @RequestParam(defaultValue = "50") int limit) {
        List<ChatMessage> messages = chatService.getMessagesByGroup(groupId, limit);
        return R.ok(messages);
    }
    
    @Operation(summary = "初始化聊天测试数据")
    @PostMapping("/init")
    public R<String> initTestData() {
        chatService.initTestData();
        return R.ok("聊天测试数据初始化成功");
    }
} 