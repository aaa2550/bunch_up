package com.bunchup.service.impl;

import com.bunchup.dto.ChatMessage;
import com.bunchup.dto.WebSocketMessage;
import com.bunchup.service.ChatService;
import com.bunchup.service.MessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
public class MessageServiceImpl implements MessageService {

    @Autowired
    private ChatService chatService;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @Override
    public void send(ChatMessage chatMessage) {
        // 保存消息到数据库
        chatService.saveMessage(chatMessage);
        // 广播消息到群组
        messagingTemplate.convertAndSend("/topic/chat/" + chatMessage.getGroupId(), new WebSocketMessage("CHAT", chatMessage));
    }

    @Override
    public void joinGroup(ChatMessage chatMessage) {
        // 订阅群组消息
        messagingTemplate.convertAndSend("/topic/chat/" + chatMessage.getGroupId(),
                new WebSocketMessage("JOIN", chatMessage.getUserName() + " 加入了群组"));
    }

    @Override
    public void leaveGroup(ChatMessage chatMessage) {
        messagingTemplate.convertAndSend("/topic/chat/" + chatMessage.getGroupId(),
                new WebSocketMessage("LEAVE", chatMessage.getUserName() + " 离开了群组"));
    }
}
