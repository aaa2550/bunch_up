package com.bunchup.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

/**
 * 登录响应DTO
 * 
 * @author bunchup
 */
@Data
@Schema(description = "登录响应")
public class LoginResponse {
    
    @Schema(description = "用户信息")
    private User user;
    
    @Schema(description = "JWT Token")
    private String token;

} 