package com.bunchup.service.impl;

import com.bunchup.dto.User;
import com.bunchup.repository.UserRepository;
import com.bunchup.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserServiceImpl implements UserService {
    
    @Autowired
    private UserRepository userRepository;
    
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
    
    @Override
    public User get(Long id) {
        return userRepository.get(id);
    }
    
    @Override
    public User getByPhone(String phone) {
        return userRepository.getByPhone(phone);
    }
    
    @Override
    public User register(User user) {
        if (userRepository.existsByPhone(user.getPhone())) {
            throw new RuntimeException("手机号已存在");
        }
        
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }
    
    @Override
    public User login(String phone, String password) {
        User user = userRepository.getByPhone(phone);
        if (user == null) {
            throw new RuntimeException("用户不存在");
        }
        
        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new RuntimeException("密码错误");
        }
        
        return user;
    }
    
    @Override
    public boolean sendVerifyCode(String phone) {
        if (!userRepository.existsByPhone(phone)) {
            throw new RuntimeException("手机号不存在");
        }
        return true;
    }
    
    @Override
    public boolean existsByPhone(String phone) {
        return userRepository.existsByPhone(phone);
    }
} 