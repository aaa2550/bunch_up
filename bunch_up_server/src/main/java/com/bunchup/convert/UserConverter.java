package com.bunchup.convert;

import com.bunchup.dto.User;
import com.bunchup.entity.UserDO;
import com.mybatisflex.core.paginate.Page;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

import java.util.List;

@Mapper
public interface UserConverter {

    UserConverter INSTANCE = Mappers.getMapper(UserConverter.class);
    
    User convertToDTO(UserDO obj);
    List<User> convertToDTO(List<UserDO> list);
    Page<User> convertToDTO(Page<UserDO> page);
    UserDO convertToDO(User obj);
    List<UserDO> convertToDO(List<User> list);

} 