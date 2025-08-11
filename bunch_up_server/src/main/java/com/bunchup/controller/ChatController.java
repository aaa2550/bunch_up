package com.bunchup.controller;

import com.alibaba.fastjson2.JSON;
import com.bunchup.common.R;
import com.bunchup.dto.ChatMessage;
import com.bunchup.dto.WebSocketMessage;
import com.bunchup.service.ChatService;
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

import java.util.List;

@RestController
@RequestMapping("/api/v1/chat")
public class ChatController {

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @Autowired
    private ChatService chatService;

    @GetMapping("/group/{groupId}/messages")
    public R<List<ChatMessage>> getGroupMessages(@PathVariable Long groupId) {
        // 获取最近200条消息
        List<ChatMessage> messages = chatService.getMessagesByGroup(groupId, 200);
        
        // 添加调试日志
        System.out.println("ChatController - 获取群组消息，群组ID: " + groupId);
        System.out.println("ChatController - 消息数量: " + messages.size());
        if (!messages.isEmpty()) {
            System.out.println("ChatController - 第一条消息: " + messages.get(0));
            System.out.println("ChatController - 第一条消息的userName: " + messages.get(0).getUserName());
        }
        
        return R.ok(messages);
    }
    
    @GetMapping("/test/messages/{groupId}")
    public R<String> testMessages(@PathVariable Long groupId) {
        // 测试接口，直接查询数据库中的消息数据
        try {
            List<ChatMessage> messages = chatService.getMessagesByGroup(groupId, 5);
            StringBuilder result = new StringBuilder();
            result.append("群组ID: ").append(groupId).append("\n");
            result.append("消息数量: ").append(messages.size()).append("\n");
            
            for (int i = 0; i < messages.size(); i++) {
                ChatMessage msg = messages.get(i);
                result.append("消息").append(i + 1).append(": ")
                      .append("ID=").append(msg.getId())
                      .append(", userId=").append(msg.getUserId())
                      .append(", userName=").append(msg.getUserName())
                      .append(", content=").append(msg.getContent())
                      .append("\n");
            }
            
            return R.ok(result.toString());
        } catch (Exception e) {
            return R.error("查询失败: " + e.getMessage());
        }
    }

    @MessageMapping("/chat.send")
    @SendTo("/topic/chat")
    public WebSocketMessage sendMessage(@Payload String message, SimpMessageHeaderAccessor headerAccessor) {
        ChatMessage chatMessage = JSON.parseObject(message, ChatMessage.class);

        // 验证用户身份
        if (headerAccessor.getUser() == null) {
            throw new RuntimeException("用户未认证，无法发送消息");
        }
        
        String username = headerAccessor.getUser().getName();
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
        
        // 验证用户身份
        if (headerAccessor.getUser() == null) {
            throw new RuntimeException("用户未认证，无法加入群组");
        }
        
        String username = headerAccessor.getUser().getName();

        // 订阅群组消息
        String destination = "/topic/chat/" + joinMessage.getGroupId();
        messagingTemplate.convertAndSend(destination,
                new WebSocketMessage("JOIN", username + " 加入了群组"));
    }

    @MessageMapping("/chat.leave")
    public void leaveGroup(@Payload String message, SimpMessageHeaderAccessor headerAccessor) {
        ChatMessage leaveMessage = JSON.parseObject(message, ChatMessage.class);
        
        // 验证用户身份
        if (headerAccessor.getUser() == null) {
            throw new RuntimeException("用户未认证，无法离开群组");
        }
        
        String username = headerAccessor.getUser().getName();

        // 发送离开消息
        String destination = "/topic/chat/" + leaveMessage.getGroupId();
        messagingTemplate.convertAndSend(destination,
                new WebSocketMessage("LEAVE", username + " 离开了群组"));
    }
} 