package com.bunchup.controller;

import com.bunchup.common.R;
import com.bunchup.dto.LoginRequest;
import com.bunchup.dto.LoginResponse;
import com.bunchup.dto.RegisterRequest;
import com.bunchup.dto.User;
import com.bunchup.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@Tag(name = "认证管理", description = "用户认证相关接口")
@RestController
@RequestMapping("/auth")
public class AuthController {
    
    @Autowired
    private UserService userService;
    
    @Operation(summary = "用户注册")
    @PostMapping("/register")
    public R<User> register(@RequestBody RegisterRequest request) {
        User user = new User();
        user.setPhone(request.getPhone());
        user.setPassword(request.getPassword());
        user.setNickname("用户" + request.getPhone().substring(7));
        
        User registeredUser = userService.register(user);
        return R.ok(registeredUser);
    }
    
    @Operation(summary = "用户登录")
    @PostMapping("/login")
    public R<LoginResponse> login(@RequestBody LoginRequest request) {
        User user = userService.login(request.getPhone(), request.getPassword());
        
        LoginResponse response = new LoginResponse();
        response.setUser(user);
        response.setToken("token_" + user.getId() + "_" + System.currentTimeMillis());
        
        return R.ok(response);
    }
    
    @Operation(summary = "发送验证码")
    @PostMapping("/sendVerifyCode")
    public R<String> sendVerifyCode(@RequestParam String phone) {
        boolean success = userService.sendVerifyCode(phone);
        if (success) {
            return R.ok("验证码发送成功");
        } else {
            return R.error("验证码发送失败");
        }
    }
} 