package com.bunchup.repository;

import com.bunchup.entity.UserDO;

/**
 * 用户Repository接口
 * 
 * @author bunchup
 */
public interface UserRepository {
    
    /**
     * 根据ID获取用户
     */
    UserDO getById(Long id);
    
    /**
     * 根据手机号获取用户
     */
    UserDO getByPhone(String phone);
    
    /**
     * 保存用户
     */
    int save(UserDO user);
    
    /**
     * 更新用户
     */
    int updateById(UserDO user);
} 