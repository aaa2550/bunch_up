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

import java.security.Principal;
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
                System.out.println("WebSocket连接，收到token: " + token);
                
                // 验证token格式和用户身份
                String[] parts = token.split("_");
                if (parts.length >= 2) {
                    try {
                        Long userId = Long.parseLong(parts[1]);
                        System.out.println("解析到用户ID: " + userId);
                        
                        User user = userService.get(userId);
                        System.out.println("UserService.get()返回结果: " + user);
                        
                        if (user != null) {
                            System.out.println("找到用户: " + user.getNickname() + ", ID: " + user.getId());
                            
                            // 创建一个包含用户ID和昵称的Principal对象
                            Principal userPrincipal = new Principal() {
                                @Override
                                public String getName() {
                                    return user.getNickname();
                                }
                                
                                public Long getId() {
                                    return user.getId();
                                }
                                
                                public String getPhone() {
                                    return user.getPhone();
                                }
                            };
                            
                            // 设置用户信息到WebSocket session
                            accessor.setUser(userPrincipal);
                            System.out.println("用户认证成功，设置Principal: " + userPrincipal.getName());
                            return message;
                        } else {
                            System.out.println("用户不存在，ID: " + userId);
                            System.out.println("可能的原因：1. 用户ID不存在 2. 数据库连接问题 3. 转换器问题");
                        }
                    } catch (NumberFormatException e) {
                        System.out.println("token格式错误: " + e.getMessage());
                    }
                } else {
                    System.out.println("token格式不正确，parts长度: " + parts.length);
                }
            } else {
                System.out.println("未找到token");
            }
            // 鉴权失败，拒绝连接
            System.out.println("WebSocket连接认证失败，拒绝连接");
            return null;
        }
        
        return message;
    }
} 