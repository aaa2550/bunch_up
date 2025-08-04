package com.bunchup.repository.impl;

import com.bunchup.entity.UserDO;
import com.bunchup.mapper.UserMapper;
import com.bunchup.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

/**
 * 用户Repository实现类
 * 
 * @author bunchup
 */
@Repository
public class UserRepositoryImpl implements UserRepository {
    
    @Autowired
    private UserMapper userMapper;
    
    @Override
    public UserDO getById(Long id) {
        return userMapper.selectById(id);
    }
    
    @Override
    public UserDO getByPhone(String phone) {
        return userMapper.selectByPhone(phone);
    }
    
    @Override
    public int save(UserDO user) {
        return userMapper.insert(user);
    }
    
    @Override
    public int updateById(UserDO user) {
        return userMapper.updateById(user);
    }
} 