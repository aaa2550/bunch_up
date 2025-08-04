package com.bunchup.controller;

import com.bunchup.common.R;
import com.bunchup.dto.LoginRequest;
import com.bunchup.dto.LoginResponse;
import com.bunchup.dto.RegisterRequest;
import com.bunchup.dto.User;
import com.bunchup.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

/**
 * 认证控制器
 * 
 * @author bunchup
 */
@Tag(name = "认证管理", description = "用户注册、登录相关接口")
@RestController
@RequestMapping("/auth")
public class AuthController {
    
    @Autowired
    private UserService userService;
    
    @Operation(summary = "用户注册")
    @PostMapping("/register")
    public R<User> register(@Valid @RequestBody RegisterRequest request) {
        try {
            User user = userService.register(request);
            return R.success("注册成功", user);
        } catch (Exception e) {
            return R.error(e.getMessage());
        }
    }
    
    @Operation(summary = "密码登录")
    @PostMapping("/login")
    public R<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        try {
            LoginResponse response = userService.login(request);
            return R.success("登录成功", response);
        } catch (Exception e) {
            return R.error(e.getMessage());
        }
    }
    
    @Operation(summary = "验证码登录")
    @PostMapping("/login/code")
    public R<LoginResponse> loginByCode(@RequestParam String phone, @RequestParam String verifyCode) {
        try {
            LoginResponse response = userService.loginByCode(phone, verifyCode);
            return R.success("登录成功", response);
        } catch (Exception e) {
            return R.error(e.getMessage());
        }
    }
    
    @Operation(summary = "发送验证码")
    @PostMapping("/sendVerifyCode")
    public R<String> sendVerifyCode(@RequestParam String phone, @RequestParam String type) {
        try {
            userService.sendVerifyCode(phone, type);
            return R.success("验证码发送成功");
        } catch (Exception e) {
            return R.error(e.getMessage());
        }
    }
    
    @Operation(summary = "获取用户信息")
    @GetMapping("/user/{id}")
    public R<User> getUserById(@PathVariable Long id) {
        try {
            User user = userService.getById(id);
            if (user != null) {
                return R.success(user);
            } else {
                return R.error("用户不存在");
            }
        } catch (Exception e) {
            return R.error(e.getMessage());
        }
    }
} 