package com.bunchup.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

/**
 * 注册请求DTO
 * 
 * @author bunchup
 */
@Data
@Schema(description = "注册请求")
public class RegisterRequest {
    
    @Schema(description = "手机号", example = "13800138000")
    @NotBlank(message = "手机号不能为空")
    private String phone;
    
    @Schema(description = "密码", example = "123456")
    @NotBlank(message = "密码不能为空")
    private String password;
    
    @Schema(description = "验证码", example = "123456")
    @NotBlank(message = "验证码不能为空")
    private String verifyCode;

} 