package com.bunchup.mapper;

import com.bunchup.entity.GameRoomDO;
import com.mybatisflex.core.BaseMapper;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface GameRoomMapper extends BaseMapper<GameRoomDO> {
    
    @Select("SELECT * FROM game_room WHERE room_id = #{roomId}")
    GameRoomDO selectByRoomId(String roomId);
    
    @Select("SELECT * FROM game_room WHERE group_id = #{groupId} AND game_type = #{gameType}")
    GameRoomDO selectByGroupAndType(Long groupId, String gameType);
    
    @Select("SELECT * FROM game_room WHERE status = #{status}")
    List<GameRoomDO> selectByStatus(String status);
}