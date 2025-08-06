package com.bunchup.controller;

import com.alibaba.fastjson2.JSON;
import com.bunchup.dto.ChatMessage;
import com.bunchup.dto.WebSocketMessage;
import com.bunchup.service.ChatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
public class ChatController {

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @Autowired
    private ChatService chatService;

    @MessageMapping("/chat.send")
    @SendTo("/topic/chat")
    public WebSocketMessage sendMessage(@Payload String message, SimpMessageHeaderAccessor headerAccessor) {
        ChatMessage chatMessage = JSON.parseObject(message, ChatMessage.class);

        // 兼容匿名用户
        String username = chatMessage.getUserName();
        if (username == null || username.isEmpty()) {
            if (headerAccessor.getUser() != null) {
                username = headerAccessor.getUser().getName();
            } else {
                username = "匿名用户";
            }
        }
        chatMessage.setUserName(username);
        chatMessage.setSendTime(java.time.LocalDateTime.now());
        if (chatMessage.getMessageType() == null) {
            chatMessage.setMessageType(1); // 默认文本消息
        }

        // 保存消息到数据库
        chatService.saveMessage(chatMessage);

        // 广播消息到群组
        String destination = "/topic/chat/" + chatMessage.getGroupId();
        messagingTemplate.convertAndSend(destination, new WebSocketMessage("CHAT", chatMessage));

        return new WebSocketMessage("CHAT", chatMessage);
    }

    @MessageMapping("/chat.join")
    public void joinGroup(@Payload String message, SimpMessageHeaderAccessor headerAccessor) {
        ChatMessage joinMessage = JSON.parseObject(message, ChatMessage.class);
        String username = headerAccessor.getUser().getName();

        // 订阅群组消息
        String destination = "/topic/chat/" + joinMessage.getGroupId();
        messagingTemplate.convertAndSend(destination,
                new WebSocketMessage("JOIN", username + " 加入了群组"));
    }

    @MessageMapping("/chat.leave")
    public void leaveGroup(@Payload String message, SimpMessageHeaderAccessor headerAccessor) {
        ChatMessage leaveMessage = JSON.parseObject(message, ChatMessage.class);
        String username = headerAccessor.getUser().getName();

        // 发送离开消息
        String destination = "/topic/chat/" + leaveMessage.getGroupId();
        messagingTemplate.convertAndSend(destination,
                new WebSocketMessage("LEAVE", username + " 离开了群组"));
    }
} 