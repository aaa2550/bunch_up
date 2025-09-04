package com.bunchup.controller;

import com.alibaba.fastjson2.JSON;
import com.bunchup.common.R;
import com.bunchup.dto.ChatMessage;
import com.bunchup.dto.WebSocketMessage;
import com.bunchup.service.ChatService;
import com.bunchup.service.MessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Date;
import java.util.List;
import java.util.Objects;

@RestController
@RequestMapping("/api/v1/chat")
public class ChatController {

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @Autowired
    private ChatService chatService;

    @Autowired
    private MessageService messageService;

    @GetMapping("/group/{groupId}/messages")
    public R<List<ChatMessage>> getGroupMessages(@PathVariable Long groupId) {
        // 获取最近200条消息
        List<ChatMessage> messages = chatService.getMessagesByGroup(groupId, 200);
        return R.ok(messages);
    }

    @MessageMapping("/chat.send")
    @SendTo("/topic/chat")
    public WebSocketMessage sendMessage(@Payload String message, SimpMessageHeaderAccessor headerAccessor) {
        ChatMessage chatMessage = JSON.parseObject(message, ChatMessage.class);
        String username = Objects.requireNonNull(headerAccessor.getUser()).getName();
        chatMessage.setUserName(username);
        chatMessage.setSendTime(new Date());
        if (chatMessage.getMessageType() == null) {
            chatMessage.setMessageType(1); // 默认文本消息
        }
        messageService.send(chatMessage);
        return new WebSocketMessage("CHAT", chatMessage);
    }

    @MessageMapping("/chat.join")
    public void joinGroup(@Payload String message, SimpMessageHeaderAccessor headerAccessor) {
        ChatMessage chatMessage = JSON.parseObject(message, ChatMessage.class);

        String username = Objects.requireNonNull(headerAccessor.getUser()).getName();
        chatMessage.setUserName(username);
        messageService.joinGroup(chatMessage);
    }

    @MessageMapping("/chat.leave")
    public void leaveGroup(@Payload String message, SimpMessageHeaderAccessor headerAccessor) {
        ChatMessage chatMessage = JSON.parseObject(message, ChatMessage.class);
        String username = Objects.requireNonNull(headerAccessor.getUser()).getName();
        chatMessage.setUserName(username);
        messageService.leaveGroup(chatMessage);
    }
} 