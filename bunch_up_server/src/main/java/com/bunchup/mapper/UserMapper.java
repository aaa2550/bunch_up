package com.bunchup.mapper;

import com.bunchup.entity.UserDO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Update;

import java.util.List;

/**
 * 用户Mapper接口
 * 
 * @author bunchup
 */
@Mapper
public interface UserMapper {
    
    @Select("SELECT * FROM user WHERE id = #{id}")
    UserDO selectById(Long id);
    
    @Select("SELECT * FROM user WHERE phone = #{phone}")
    UserDO selectByPhone(String phone);
    
    @Select("SELECT * FROM user")
    List<UserDO> selectAll();
    
    @Insert("INSERT INTO user (phone, password, nickname, avatar, status, create_time, update_time) " +
            "VALUES (#{phone}, #{password}, #{nickname}, #{avatar}, #{status}, #{createTime}, #{updateTime})")
    int insert(UserDO user);
    
    @Update("UPDATE user SET phone = #{phone}, password = #{password}, nickname = #{nickname}, " +
            "avatar = #{avatar}, status = #{status}, update_time = #{updateTime} WHERE id = #{id}")
    int updateById(UserDO user);
} 