package com.bunchup.dto;

import io.swagger.v3.oas.annotations.media.Schema;

/**
 * 登录响应DTO
 * 
 * @author bunchup
 */
@Schema(description = "登录响应")
public class LoginResponse {
    
    @Schema(description = "用户信息")
    private User user;
    
    @Schema(description = "JWT Token")
    private String token;
    
    // Getters and Setters
    public User getUser() {
        return user;
    }
    
    public void setUser(User user) {
        this.user = user;
    }
    
    public String getToken() {
        return token;
    }
    
    public void setToken(String token) {
        this.token = token;
    }
} 