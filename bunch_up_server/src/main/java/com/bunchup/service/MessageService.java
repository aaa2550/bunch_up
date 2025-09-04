package com.bunchup.service;

import com.bunchup.dto.ChatMessage;

public interface MessageService {
    void send(ChatMessage chatMessage);

    void joinGroup(ChatMessage chatMessage);

    void leaveGroup(ChatMessage chatMessage);
}
