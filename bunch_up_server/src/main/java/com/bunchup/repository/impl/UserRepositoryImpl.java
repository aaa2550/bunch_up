package com.bunchup.repository.impl;

import com.bunchup.convert.UserConverter;
import com.bunchup.dto.User;
import com.bunchup.entity.UserDO;
import com.bunchup.mapper.UserMapper;
import com.bunchup.repository.UserRepository;
import com.mybatisflex.spring.service.impl.ServiceImpl;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class UserRepositoryImpl extends ServiceImpl<UserMapper, UserDO> implements UserRepository {
    
    @Override
    public User get(Long id) {
        UserDO userDO = queryChain()
            .where(UserDO::getId).eq(id)
            .one();
        return UserConverter.INSTANCE.convertToDTO(userDO);
    }
    
    @Override
    public User getByPhone(String phone) {
        UserDO userDO = queryChain()
            .where(UserDO::getPhone).eq(phone)
            .one();
        return UserConverter.INSTANCE.convertToDTO(userDO);
    }
    
    @Override
    public List<User> find() {
        List<UserDO> userDOList = queryChain()
            .list();
        return UserConverter.INSTANCE.convertToDTO(userDOList);
    }
    
    @Override
    public User save(User user) {
        UserDO userDO = UserConverter.INSTANCE.convertToDO(user);
        super.save(userDO);
        return UserConverter.INSTANCE.convertToDTO(userDO);
    }
    
    @Override
    public User update(User user) {
        updateChain()
            .set(UserDO::getUsername, user.getUsername())
            .set(UserDO::getPhone, user.getPhone())
            .set(UserDO::getPassword, user.getPassword())
            .set(UserDO::getNickname, user.getNickname())
            .set(UserDO::getAvatar, user.getAvatar())
            .set(UserDO::getStatus, user.getStatus())
            .where(UserDO::getId).eq(user.getId())
            .update();
        return user;
    }
    
    @Override
    public void delete(Long id) {
        updateChain()
            .where(UserDO::getId).eq(id)
            .remove();
    }
    
    @Override
    public boolean existsByPhone(String phone) {
        return queryChain()
            .where(UserDO::getPhone).eq(phone)
            .exists();
    }
} 