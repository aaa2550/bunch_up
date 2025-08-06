package com.bunchup.interceptor;

import com.alibaba.fastjson2.JSON;
import com.bunchup.dto.User;
import com.bunchup.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class WebSocketAuthInterceptor implements ChannelInterceptor {
    
    @Autowired
    private UserService userService;
    
    @Override
    public Message<?> preSend(Message<?> message, MessageChannel channel) {
        StompHeaderAccessor accessor = MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);
        
        if (accessor != null && StompCommand.CONNECT.equals(accessor.getCommand())) {
            // 获取token
            List<String> tokenList = accessor.getNativeHeader("token");
            if (tokenList != null && !tokenList.isEmpty()) {
                String token = tokenList.get(0);
                // 这里简化处理，实际应该验证JWT token
                // 假设token格式为 "token_userId_timestamp"
                String[] parts = token.split("_");
                if (parts.length >= 2) {
                    try {
                        Long userId = Long.parseLong(parts[1]);
                        User user = userService.get(userId);
                        if (user != null) {
                            // 设置用户信息到WebSocket session
                            accessor.setUser(() -> user.getNickname());
                            return message;
                        }
                    } catch (NumberFormatException e) {
                        // token格式错误
                    }
                }
            }
            // 鉴权失败，拒绝连接
            return null;
        }
        
        return message;
    }
} 