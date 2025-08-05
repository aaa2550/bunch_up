package com.bunchup.repository;

import com.bunchup.dto.User;
import com.bunchup.entity.UserDO;
import com.mybatisflex.core.service.IService;

import java.util.List;

public interface UserRepository extends IService<UserDO> {
    
    User get(Long id);
    User getByPhone(String phone);
    List<User> find();
    User save(User user);
    User update(User user);
    void delete(Long id);
    boolean existsByPhone(String phone);
} 