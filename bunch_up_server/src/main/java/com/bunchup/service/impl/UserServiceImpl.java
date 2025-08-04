package com.bunchup.service.impl;

import com.bunchup.dto.LoginRequest;
import com.bunchup.dto.LoginResponse;
import com.bunchup.dto.RegisterRequest;
import com.bunchup.dto.User;
import com.bunchup.entity.UserDO;
import com.bunchup.repository.UserRepository;
import com.bunchup.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

/**
 * 用户服务实现类
 * 
 * @author bunchup
 */
@Service
public class UserServiceImpl implements UserService {
    
    @Autowired
    private UserRepository userRepository;
    
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
    
    @Override
    public User register(RegisterRequest request) {
        // 检查手机号是否已存在
        UserDO existingUser = userRepository.getByPhone(request.getPhone());
        if (existingUser != null) {
            throw new RuntimeException("手机号已注册");
        }
        
        // 验证验证码（这里简化处理，实际应该验证）
        // TODO: 实现验证码验证逻辑
        
        // 创建新用户
        UserDO userDO = new UserDO();
        userDO.setPhone(request.getPhone());
        userDO.setPassword(passwordEncoder.encode(request.getPassword()));
        userDO.setNickname("用户" + request.getPhone().substring(7)); // 使用手机号后4位作为昵称
        userDO.setStatus(1);
        userDO.setCreateTime(LocalDateTime.now());
        userDO.setUpdateTime(LocalDateTime.now());
        
        userRepository.save(userDO);
        
        // 转换为DTO返回
        return convertToDTO(userDO);
    }
    
    @Override
    public LoginResponse login(LoginRequest request) {
        UserDO userDO = userRepository.getByPhone(request.getPhone());
        if (userDO == null) {
            throw new RuntimeException("用户不存在");
        }
        
        if (!passwordEncoder.matches(request.getPassword(), userDO.getPassword())) {
            throw new RuntimeException("密码错误");
        }
        
        if (userDO.getStatus() != 1) {
            throw new RuntimeException("账户已被禁用");
        }
        
        // 生成JWT Token（这里简化处理）
        String token = generateToken(userDO);
        
        LoginResponse response = new LoginResponse();
        response.setUser(convertToDTO(userDO));
        response.setToken(token);
        
        return response;
    }
    
    @Override
    public LoginResponse loginByCode(String phone, String verifyCode) {
        // TODO: 验证验证码逻辑
        UserDO userDO = userRepository.getByPhone(phone);
        if (userDO == null) {
            throw new RuntimeException("用户不存在");
        }
        
        if (userDO.getStatus() != 1) {
            throw new RuntimeException("账户已被禁用");
        }
        
        // 生成JWT Token
        String token = generateToken(userDO);
        
        LoginResponse response = new LoginResponse();
        response.setUser(convertToDTO(userDO));
        response.setToken(token);
        
        return response;
    }
    
    @Override
    public void sendVerifyCode(String phone, String type) {
        // TODO: 实现验证码发送逻辑
        // 1. 生成6位验证码
        // 2. 调用短信服务发送验证码
        // 3. 保存验证码到数据库
        System.out.println("发送验证码到手机号: " + phone + ", 类型: " + type);
    }
    
    @Override
    public User getById(Long id) {
        UserDO userDO = userRepository.getById(id);
        return userDO != null ? convertToDTO(userDO) : null;
    }
    
    @Override
    public User getByPhone(String phone) {
        UserDO userDO = userRepository.getByPhone(phone);
        return userDO != null ? convertToDTO(userDO) : null;
    }
    
    /**
     * 转换为DTO
     */
    private User convertToDTO(UserDO userDO) {
        User user = new User();
        user.setId(userDO.getId());
        user.setPhone(userDO.getPhone());
        user.setNickname(userDO.getNickname());
        user.setAvatar(userDO.getAvatar());
        user.setStatus(userDO.getStatus());
        user.setCreateTime(userDO.getCreateTime());
        user.setUpdateTime(userDO.getUpdateTime());
        return user;
    }
    
    /**
     * 生成JWT Token（简化实现）
     */
    private String generateToken(UserDO userDO) {
        // TODO: 实现真正的JWT Token生成
        return "token_" + userDO.getId() + "_" + System.currentTimeMillis();
    }
} 