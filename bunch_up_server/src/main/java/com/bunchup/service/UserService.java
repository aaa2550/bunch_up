package com.bunchup.service;

import com.bunchup.dto.User;

public interface UserService {
    
    User get(Long id);
    
    User getByPhone(String phone);
    
    User register(User user);
    
    User login(String phone, String password);
    
    boolean sendVerifyCode(String phone);
    
    boolean existsByPhone(String phone);
} 