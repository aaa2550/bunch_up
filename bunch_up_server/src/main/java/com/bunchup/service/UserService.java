package com.bunchup.service;

import com.bunchup.dto.LoginRequest;
import com.bunchup.dto.LoginResponse;
import com.bunchup.dto.RegisterRequest;
import com.bunchup.dto.User;

/**
 * 用户服务接口
 * 
 * @author bunchup
 */
public interface UserService {
    
    /**
     * 用户注册
     */
    User register(RegisterRequest request);
    
    /**
     * 用户登录
     */
    LoginResponse login(LoginRequest request);
    
    /**
     * 验证码登录
     */
    LoginResponse loginByCode(String phone, String verifyCode);
    
    /**
     * 发送验证码
     */
    void sendVerifyCode(String phone, String type);
    
    /**
     * 根据ID获取用户
     */
    User getById(Long id);
    
    /**
     * 根据手机号获取用户
     */
    User getByPhone(String phone);
} 